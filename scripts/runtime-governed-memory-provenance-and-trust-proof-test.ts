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
  'iasevero-hybrid-memory-retrieval-test.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  const path = `${databasePath}${suffix}`

  if (existsSync(path)) {
    rmSync(path, { force: true })
  }
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-hybrid-retrieval'
const userId = 'user-hybrid-retrieval'
const otherUserId = 'other-user'
const now = '2026-07-15T20:00:00.000Z'

const preferredMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preferences',
  executionKey: 'hybrid-retrieval-test',
  type: 'semantic',
  content:
    'O usuário prefere respostas técnicas, diretas e verificáveis.',
  structuredPayload: {
    preference: 'technical-direct-verifiable',
  },
  source: 'runtime-hybrid-memory-retrieval-test',
  sourceEventIds: ['event-v283.5-trusted-provenance'],
  sourceAuthority: 95,
  confidence: 98,
  observedAt: '2026-07-15T19:00:00.000Z',
  validFrom: '2026-07-15T19:00:00.000Z',
  status: 'active',
  policyTags: ['preference', 'response-style'],
})

repository.createMemory({
  tenantId,
  userId,
  entityId: 'food-preferences',
  type: 'semantic',
  content:
    'O usuário prefere café sem açúcar durante a manhã.',
  structuredPayload: {
    preference: 'coffee-without-sugar',
  },
  source: 'runtime-hybrid-memory-retrieval-test',
  sourceAuthority: 80,
  confidence: 85,
  observedAt: '2026-07-14T10:00:00.000Z',
  validFrom: '2026-07-14T10:00:00.000Z',
  status: 'active',
  policyTags: ['preference'],
})

repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preferences',
  type: 'semantic',
  content:
    'O usuário gostava de respostas muito longas e informais.',
  structuredPayload: {
    preference: 'obsolete-response-style',
  },
  source: 'runtime-hybrid-memory-retrieval-test',
  sourceAuthority: 70,
  confidence: 75,
  observedAt: '2025-01-01T10:00:00.000Z',
  validFrom: '2025-01-01T10:00:00.000Z',
  validUntil: '2025-12-31T23:59:59.000Z',
  status: 'active',
  policyTags: ['preference', 'expired'],
})

repository.createMemory({
  tenantId,
  userId: otherUserId,
  entityId: 'response-preferences',
  type: 'semantic',
  content:
    'Outro usuário prefere respostas técnicas e diretas.',
  structuredPayload: {
    preference: 'other-user-preference',
  },
  source: 'runtime-hybrid-memory-retrieval-test',
  sourceAuthority: 100,
  confidence: 100,
  observedAt: '2026-07-15T19:30:00.000Z',
  validFrom: '2026-07-15T19:30:00.000Z',
  status: 'active',
  policyTags: ['preference'],
})

const unprovenancedMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preferences',
  executionKey: 'v283.5-provenance-trust-proof',
  type: 'semantic',
  content: preferredMemory.content,
  structuredPayload: preferredMemory.structuredPayload,
  source: 'runtime-governed-memory-provenance-proof',
  sourceEventIds: [],
  sourceAuthority: preferredMemory.sourceAuthority,
  confidence: preferredMemory.confidence,
  observedAt: now,
  validFrom: now,
  status: 'active',
  retentionPolicy: 'standard',
  policyTags: [
    'preference',
    'missing-provenance',
  ],
})

if (preferredMemory.sourceEventIds.length === 0) {
  throw new Error(
    'Trusted memory must contain provenance evidence.',
  )
}

const report = retrieveHybridEnterpriseMemories(
  repository,
  {
    tenantId,
    userId,
    query:
      'Qual estilo de respostas técnicas e verificáveis o usuário prefere?',
    entityId: 'response-preferences',
    types: ['semantic'],
    limit: 5,
    minimumScore: 20,
    now,
  },
)

if (report.selectedCount < 1) {
  throw new Error(
    'Hybrid retrieval did not select a relevant memory.',
  )
}

const winner = report.results[0]

const unprovenancedResult = report.results.find(
  (result) =>
    result.memory.memoryId ===
    unprovenancedMemory.memoryId,
)

if (!unprovenancedResult) {
  throw new Error(
    'Memory without provenance was not available for comparison.',
  )
}


if (winner?.memory.memoryId !== preferredMemory.memoryId) {
  throw new Error(
    'Hybrid retrieval did not rank the expected memory first.',
  )
}

if (
  winner.score.total <=
  unprovenancedResult.score.total
) {
  throw new Error(
    'Complete provenance did not improve the governed ranking.',
  )
}

if (
  !winner.reasoning.includes(
    'provenanceComplete=true',
  ) ||
  !winner.reasoning.includes(
    'provenancePenalty=0',
  )
) {
  throw new Error(
    'Trusted memory did not report complete provenance.',
  )
}

if (
  !unprovenancedResult.reasoning.includes(
    'provenanceComplete=false',
  ) ||
  !unprovenancedResult.reasoning.includes(
    'provenancePenalty=8',
  )
) {
  throw new Error(
    'Missing provenance penalty was not reported.',
  )
}

if (
  report.results.some(
    (result) =>
      result.memory.userId !== userId,
  )
) {
  throw new Error(
    'Cross-user memory leakage was detected.',
  )
}

if (
  report.results.some(
    (result) =>
      result.memory.content.includes(
        'muito longas e informais',
      ),
  )
) {
  throw new Error(
    'Expired memory influenced hybrid retrieval.',
  )
}

if (
  winner.score.lexical <= 0 ||
  winner.matchedTerms.length === 0
) {
  throw new Error(
    'Lexical retrieval evidence was not produced.',
  )
}

const irrelevant = retrieveHybridEnterpriseMemories(
  repository,
  {
    tenantId,
    userId,
    query: 'manutenção de turbina industrial',
    types: ['semantic'],
    limit: 5,
    minimumScore: 25,
    now,
  },
)

if (irrelevant.selectedCount !== 0) {
  throw new Error(
    'Irrelevant memories should not have been selected.',
  )
}

repository.close()

console.log(
  'Runtime governed memory provenance and trust proof passed.',
)

console.log({
    trustedMemorySelected:
      winner.memory.memoryId ===
      preferredMemory.memoryId,
    trustedProvenanceComplete:
      winner.reasoning.includes(
        'provenanceComplete=true',
      ),
    trustedProvenancePenaltyZero:
      winner.reasoning.includes(
        'provenancePenalty=0',
      ),
    missingProvenancePenalized:
      unprovenancedResult.reasoning.includes(
        'provenancePenalty=8',
      ),
    higherTrustWinsRanking:
      winner.score.total >
      unprovenancedResult.score.total,
    trustedScore:
      winner.score.total,
    unprovenancedScore:
      unprovenancedResult.score.total,
  winnerMemoryId: winner.memory.memoryId,
  winnerScore: winner.score.total,
  lexicalScore: winner.score.lexical,
  phraseScore: winner.score.phrase,
  matchedTerms: winner.matchedTerms,
  candidateCount: report.candidateCount,
  selectedCount: report.selectedCount,
  irrelevantSelectedCount:
    irrelevant.selectedCount,
  expiredMemorySelected: false,
  crossUserLeakage: 0,
  rankingExplainable: true,
})

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}
