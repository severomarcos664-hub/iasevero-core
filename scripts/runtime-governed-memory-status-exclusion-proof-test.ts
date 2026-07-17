import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'
import {
  retrieveHybridEnterpriseMemories,
} from '../app/lib/runtime-core/runtime-hybrid-memory-retrieval'

const databasePath = join(
  tmpdir(),
  'iasevero-governed-memory-status-exclusion-proof.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, { force: true })
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-status-exclusion-proof'
const userId = 'owner-user'
const now = new Date()
const past = new Date(now.getTime() - 60_000).toISOString()
const farFuture =
  new Date(now.getTime() + 3_600_000).toISOString()

const create = (
  content: string,
  options: {
    status?: 'candidate' | 'active' | 'superseded' | 'revoked' | 'expired'
    validFrom?: string
    validUntil?: string
    userId?: string
    supersedesMemoryId?: string
    marker: string
  },
) =>
  repository.createMemory({
    tenantId,
    userId: options.userId ?? userId,
    executionKey: 'v283.4-status-exclusion-proof',
    type: 'semantic',
    content,
    structuredPayload: {
      category: 'status-exclusion-proof',
      marker: options.marker,
    },
    source: 'runtime-governed-memory-status-exclusion-proof',
    sourceEventIds: [],
    sourceAuthority: 100,
    confidence: 100,
    observedAt: past,
    validFrom: options.validFrom ?? past,
    validUntil: options.validUntil,
    status: options.status ?? 'active',
    retentionPolicy: 'standard',
    policyTags: ['governed', 'status-exclusion-proof'],
    supersedesMemoryId: options.supersedesMemoryId,
  })

try {
  const active = create(
    'A memória válida confirma que o protocolo principal é IASevero.',
    { marker: 'active-valid' },
  )

  const revoked = create(
    'A memória revogada diz que o protocolo principal é IASevero.',
    {
      status: 'revoked',
      marker: 'revoked',
    },
  )

  const expiredStatus = create(
    'A memória expirada por status diz que o protocolo principal é IASevero.',
    {
      status: 'expired',
      marker: 'expired-status',
    },
  )

  const expiredByTime = create(
    'A memória vencida por tempo diz que o protocolo principal é IASevero.',
    {
      validUntil: past,
      marker: 'expired-by-time',
    },
  )

  const futureMemory = create(
    'A memória futura diz que o protocolo principal é IASevero.',
    {
      validFrom: farFuture,
      marker: 'future',
    },
  )

  const superseded = create(
    'A memória antiga dizia que o protocolo principal é IASevero.',
    { marker: 'superseded-original' },
  )

  create(
    'A memória substituta trata de um assunto diferente.',
    {
      marker: 'superseding-replacement',
      supersedesMemoryId: superseded.memoryId,
    },
  )

  create(
    'A memória de outro usuário diz que o protocolo principal é IASevero.',
    {
      userId: 'different-user',
      marker: 'other-user',
    },
  )

  const directActive = repository.readActiveMemories({
    tenantId,
    userId,
    now: now.toISOString(),
    limit: 100,
  })

  const directIds = new Set(
    directActive.map((memory) => memory.memoryId),
  )

  const excludedIds = [
    revoked.memoryId,
    expiredStatus.memoryId,
    expiredByTime.memoryId,
    futureMemory.memoryId,
    superseded.memoryId,
  ]

  if (!directIds.has(active.memoryId)) {
    throw new Error(
      'The valid active memory was excluded from direct retrieval.',
    )
  }

  if (excludedIds.some((memoryId) => directIds.has(memoryId))) {
    throw new Error(
      'An excluded memory leaked into direct retrieval.',
    )
  }

  const hybrid = retrieveHybridEnterpriseMemories(
    repository,
    {
      tenantId,
      userId,
      query: 'Qual memória confirma que o protocolo principal é IASevero?',
      types: ['semantic'],
      limit: 10,
      candidateLimit: 100,
      minimumScore: 20,
      now: now.toISOString(),
    },
  )

  const hybridIds = new Set(
    hybrid.results.map(({ memory }) => memory.memoryId),
  )

  if (!hybridIds.has(active.memoryId)) {
    throw new Error(
      'The valid active memory was not selected by hybrid retrieval.',
    )
  }

  if (excludedIds.some((memoryId) => hybridIds.has(memoryId))) {
    throw new Error(
      'Hybrid retrieval selected an excluded memory.',
    )
  }

  const otherUser = repository.readActiveMemories({
    tenantId,
    userId: 'different-user',
    now: now.toISOString(),
  })

  const ownerLeakage = directActive.some(
    (memory) => memory.userId !== userId,
  )

  if (ownerLeakage || otherUser.length !== 1) {
    throw new Error(
      'Cross-user isolation failed during status exclusion proof.',
    )
  }

  console.log(
    'Runtime governed memory status exclusion proof passed.',
  )

  console.log({
    activeSelected: hybridIds.has(active.memoryId),
    revokedSelected: hybridIds.has(revoked.memoryId),
    expiredStatusSelected:
      hybridIds.has(expiredStatus.memoryId),
    expiredByTimeSelected:
      hybridIds.has(expiredByTime.memoryId),
    supersededSelected:
      hybridIds.has(superseded.memoryId),
    futureMemorySelected:
      hybridIds.has(futureMemory.memoryId),
    crossUserLeakage: ownerLeakage,
    directStatusFilterApplied:
      excludedIds.every((memoryId) => !directIds.has(memoryId)),
    hybridRetrievalRespected:
      excludedIds.every((memoryId) => !hybridIds.has(memoryId)),
    selectedCount: hybrid.selectedCount,
    rejectedCount: hybrid.rejectedCount,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
