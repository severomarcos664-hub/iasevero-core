import { existsSync, rmSync } from 'node:fs'
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
  'iasevero-graduated-memory-trust-proof.sqlite',
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

const tenantId = 'tenant-v283.6'
const userId = 'owner-v283.6'
const now = '2026-07-17T15:30:00.000Z'

try {
  const trustedMemory = repository.createMemory({
    tenantId,
    userId,
    type: 'semantic',
    content:
      'TypeScript oferece tipagem robusta para uma linguagem segura.',
    structuredPayload: {
      trustScenario: 'trusted',
    },
    source: 'runtime-v283.6-trusted-source',
    sourceEventIds: ['event-v283.6-trusted'],
    sourceAuthority: 95,
    confidence: 95,
    observedAt: now,
    validFrom: now,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['graduated-trust', 'trusted'],
  })

  const qualifiedMemory = repository.createMemory({
    tenantId,
    userId,
    type: 'semantic',
    content:
      'A linguagem adotada no projeto utiliza TypeScript.',
    structuredPayload: {
      trustScenario: 'qualified',
    },
    source: 'runtime-v283.6-qualified-source',
    sourceEventIds: ['event-v283.6-qualified'],
    sourceAuthority: 50,
    confidence: 50,
    observedAt: now,
    validFrom: now,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['graduated-trust', 'qualified'],
  })

  const cautionMemory = repository.createMemory({
    tenantId,
    userId,
    type: 'semantic',
    content:
      'TypeScript pode ser considerada uma linguagem neste registro.',
    structuredPayload: {
      trustScenario: 'caution',
    },
    source: 'runtime-v283.6-caution-source',
    sourceEventIds: [],
    sourceAuthority: 20,
    confidence: 20,
    observedAt: now,
    validFrom: now,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['graduated-trust', 'caution'],
  })

  repository.createMemory({
    tenantId,
    userId: 'different-user',
    type: 'semantic',
    content:
      'TypeScript aparece como linguagem de outro usuário.',
    structuredPayload: {
      trustScenario: 'cross-user',
    },
    source: 'runtime-v283.6-cross-user-source',
    sourceEventIds: ['event-v283.6-cross-user'],
    sourceAuthority: 100,
    confidence: 100,
    observedAt: now,
    validFrom: now,
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['graduated-trust', 'cross-user'],
  })

  const report = retrieveHybridEnterpriseMemories(
    repository,
    {
      tenantId,
      userId,
      query: 'typescript linguagem',
      types: ['semantic'],
      limit: 10,
      minimumScore: 20,
      now,
    },
  )

  const trustedResult = report.results.find(
    (result) =>
      result.memory.memoryId === trustedMemory.memoryId,
  )

  const qualifiedResult = report.results.find(
    (result) =>
      result.memory.memoryId === qualifiedMemory.memoryId,
  )

  const cautionResult = report.results.find(
    (result) =>
      result.memory.memoryId === cautionMemory.memoryId,
  )

  if (!trustedResult || !qualifiedResult || !cautionResult) {
    throw new Error(
      'The graduated trust candidates were not all retrieved.',
    )
  }

  if (trustedResult.trustLevel !== 'trusted') {
    throw new Error(
      `Expected trusted, received ${trustedResult.trustLevel}.`,
    )
  }

  if (qualifiedResult.trustLevel !== 'qualified') {
    throw new Error(
      `Expected qualified, received ${qualifiedResult.trustLevel}.`,
    )
  }

  if (cautionResult.trustLevel !== 'caution') {
    throw new Error(
      `Expected caution, received ${cautionResult.trustLevel}.`,
    )
  }

  if (
    trustedResult.score.total <=
      qualifiedResult.score.total ||
    qualifiedResult.score.total <=
      cautionResult.score.total
  ) {
    throw new Error(
      'Graduated trust ranking order is invalid.',
    )
  }

  const crossUserLeakage = report.results.some(
    (result) =>
      result.memory.userId !== userId,
  )

  if (crossUserLeakage) {
    throw new Error(
      'Cross-user memory leakage was detected.',
    )
  }

  console.log(
    'Runtime governed memory graduated trust proof passed.',
  )

  console.log({
    trustedLevel:
      trustedResult.trustLevel,
    qualifiedLevel:
      qualifiedResult.trustLevel,
    cautionLevel:
      cautionResult.trustLevel,
    trustedScore:
      trustedResult.score.total,
    qualifiedScore:
      qualifiedResult.score.total,
    cautionScore:
      cautionResult.score.total,
    rankingOrderCorrect:
      trustedResult.score.total >
        qualifiedResult.score.total &&
      qualifiedResult.score.total >
        cautionResult.score.total,
    cautionProvenancePenalty:
      cautionResult.reasoning.includes(
        'provenancePenalty=8',
      ),
    trustReasoningPresent:
      trustedResult.reasoning.includes(
        'trustLevel=trusted',
      ) &&
      qualifiedResult.reasoning.includes(
        'trustLevel=qualified',
      ) &&
      cautionResult.reasoning.includes(
        'trustLevel=caution',
      ),
    crossUserLeakage,
  })
} finally {
  repository.close()

  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(`${databasePath}${suffix}`, {
      force: true,
    })
  }
}
