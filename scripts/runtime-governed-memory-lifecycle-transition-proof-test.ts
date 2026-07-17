import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

const databasePath = join(
  tmpdir(),
  'iasevero-governed-memory-lifecycle-proof.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const candidatePath = `${databasePath}${suffix}`

  if (existsSync(candidatePath)) {
    rmSync(candidatePath, { force: true })
  }
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-v283.7'
const userId = 'owner-v283.7'
const transitionedAt = '2026-07-17T17:20:00.000Z'

try {
  const revocableMemory = repository.createMemory({
    tenantId,
    userId,
    entityId: 'lifecycle-revocation',
    executionKey: 'execution-v283.7-revocation',
    type: 'semantic',
    content:
      'Esta memória deve ser revogada de forma governada.',
    structuredPayload: {
      lifecycleScenario: 'revocation',
    },
    source: 'runtime-v283.7-lifecycle-proof',
    sourceEventIds: ['event-v283.7-revocation-source'],
    sourceAuthority: 95,
    confidence: 95,
    observedAt: transitionedAt,
    validFrom: transitionedAt,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['lifecycle', 'revocation'],
  })

  const expirableMemory = repository.createMemory({
    tenantId,
    userId,
    entityId: 'lifecycle-expiration',
    executionKey: 'execution-v283.7-expiration',
    type: 'semantic',
    content:
      'Esta memória deve ser expirada de forma governada.',
    structuredPayload: {
      lifecycleScenario: 'expiration',
    },
    source: 'runtime-v283.7-lifecycle-proof',
    sourceEventIds: ['event-v283.7-expiration-source'],
    sourceAuthority: 90,
    confidence: 90,
    observedAt: transitionedAt,
    validFrom: transitionedAt,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['lifecycle', 'expiration'],
  })

  const revokedChecksumBefore =
    revocableMemory.checksum

  const expiredChecksumBefore =
    expirableMemory.checksum

  const revokedTransition =
    repository.transitionMemoryLifecycle({
      tenantId,
      userId,
      memoryId: revocableMemory.memoryId,
      targetStatus: 'revoked',
      reason:
        'A informação perdeu autorização para uso.',
      source:
        'runtime-v283.7-lifecycle-governor',
      sourceAuthority: 100,
      transitionedAt,
    })

  const expiredTransition =
    repository.transitionMemoryLifecycle({
      tenantId,
      userId,
      memoryId: expirableMemory.memoryId,
      targetStatus: 'expired',
      reason:
        'A validade operacional da informação terminou.',
      source:
        'runtime-v283.7-lifecycle-governor',
      sourceAuthority: 100,
      transitionedAt,
    })

  if (
    revokedTransition.previousStatus !== 'active' ||
    revokedTransition.targetStatus !== 'revoked' ||
    revokedTransition.memory.status !== 'revoked'
  ) {
    throw new Error(
      'Governed revocation transition is invalid.',
    )
  }

  if (
    expiredTransition.previousStatus !== 'active' ||
    expiredTransition.targetStatus !== 'expired' ||
    expiredTransition.memory.status !== 'expired'
  ) {
    throw new Error(
      'Governed expiration transition is invalid.',
    )
  }

  if (
    revokedTransition.memory.checksum !==
      revokedChecksumBefore ||
    expiredTransition.memory.checksum !==
      expiredChecksumBefore
  ) {
    throw new Error(
      'Lifecycle transition incorrectly changed the immutable checksum.',
    )
  }

  const persistedRevoked =
    repository.readMemoryById({
      tenantId,
      userId,
      memoryId: revocableMemory.memoryId,
    })

  const persistedExpired =
    repository.readMemoryById({
      tenantId,
      userId,
      memoryId: expirableMemory.memoryId,
    })

  if (
    persistedRevoked?.status !== 'revoked' ||
    persistedExpired?.status !== 'expired'
  ) {
    throw new Error(
      'Lifecycle history was not preserved in the repository.',
    )
  }

  const activeMemories =
    repository.readActiveMemories({
      tenantId,
      userId,
      limit: 100,
      now: transitionedAt,
    })

  if (
    activeMemories.some(
      (memory) =>
        memory.memoryId ===
          revocableMemory.memoryId ||
        memory.memoryId ===
          expirableMemory.memoryId,
    )
  ) {
    throw new Error(
      'Revoked or expired memory remained active.',
    )
  }

  const lifecycleEvents = repository.readEvents({
    tenantId,
    userId,
    eventTypes: ['policy-change'],
    limit: 100,
  })

  const revokedEventPresent =
    lifecycleEvents.some(
      (event) =>
        event.eventId ===
          revokedTransition.event.eventId &&
        event.payload.action ===
          'memory-lifecycle-transition' &&
        event.payload.targetStatus === 'revoked',
    )

  const expiredEventPresent =
    lifecycleEvents.some(
      (event) =>
        event.eventId ===
          expiredTransition.event.eventId &&
        event.payload.action ===
          'memory-lifecycle-transition' &&
        event.payload.targetStatus === 'expired',
    )

  if (!revokedEventPresent || !expiredEventPresent) {
    throw new Error(
      'Lifecycle audit events were not persisted.',
    )
  }

  let terminalTransitionBlocked = false

  try {
    repository.transitionMemoryLifecycle({
      tenantId,
      userId,
      memoryId: revocableMemory.memoryId,
      targetStatus: 'expired',
      reason:
        'Tentativa inválida sobre estado terminal.',
      source:
        'runtime-v283.7-lifecycle-governor',
      sourceAuthority: 100,
      transitionedAt,
    })
  } catch {
    terminalTransitionBlocked = true
  }

  if (!terminalTransitionBlocked) {
    throw new Error(
      'Terminal lifecycle transition was not blocked.',
    )
  }

  let crossUserTransitionBlocked = false

  try {
    repository.transitionMemoryLifecycle({
      tenantId,
      userId: 'different-user',
      memoryId: expirableMemory.memoryId,
      targetStatus: 'revoked',
      reason:
        'Tentativa de transição fora do escopo.',
      source:
        'runtime-v283.7-lifecycle-governor',
      sourceAuthority: 100,
      transitionedAt,
    })
  } catch {
    crossUserTransitionBlocked = true
  }

  if (!crossUserTransitionBlocked) {
    throw new Error(
      'Cross-user lifecycle transition was not blocked.',
    )
  }

  console.log(
    'Runtime governed memory lifecycle transition proof passed.',
  )

  console.log({
    revokedStatus:
      revokedTransition.memory.status,
    expiredStatus:
      expiredTransition.memory.status,
    historicalRecordsPreserved:
      Boolean(
        persistedRevoked &&
        persistedExpired,
      ),
    immutableChecksumsPreserved:
      revokedTransition.memory.checksum ===
        revokedChecksumBefore &&
      expiredTransition.memory.checksum ===
        expiredChecksumBefore,
    revokedExcludedFromActive:
      !activeMemories.some(
        (memory) =>
          memory.memoryId ===
          revocableMemory.memoryId,
      ),
    expiredExcludedFromActive:
      !activeMemories.some(
        (memory) =>
          memory.memoryId ===
          expirableMemory.memoryId,
      ),
    revokedEventPresent,
    expiredEventPresent,
    terminalTransitionBlocked,
    crossUserTransitionBlocked,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
