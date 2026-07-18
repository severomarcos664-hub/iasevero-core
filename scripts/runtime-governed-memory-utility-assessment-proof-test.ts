import assert from 'node:assert/strict'

import type {
  EnterpriseCognitiveMemoryRecord,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

import {
  assessGovernedMemoryUtility,
} from '../app/lib/runtime-core/runtime-governed-memory-utility-assessment'

const evaluatedAt = '2026-07-17T23:00:00.000Z'

function createMemory(
  overrides: Partial<EnterpriseCognitiveMemoryRecord> = {},
): EnterpriseCognitiveMemoryRecord {
  const base: EnterpriseCognitiveMemoryRecord = {
    memoryId: 'memory-utility-proof-1',
    tenantId: 'tenant-utility-proof',
    userId: 'user-utility-proof',
    type: 'semantic',
    source: 'runtime-governed-memory-utility-assessment-proof',
    status: 'active',
    content: 'IASevero uses governed cognitive memory.',
    structuredPayload: {
      topic: 'governed-memory',
    },
    sourceEventIds: [
      'event-utility-proof-1',
    ],
    sourceAuthority: 85,
    confidence: 90,
    createdAt: '2026-07-15T23:00:00.000Z',
    updatedAt: '2026-07-15T23:00:00.000Z',
    observedAt: '2026-07-15T23:00:00.000Z',
    validFrom: '2026-07-15T23:00:00.000Z',
    validUntil: '2099-12-31T23:59:59.000Z',
    version: 1,
    retentionPolicy: 'governed',
    policyTags: [
      'memory',
      'utility-assessment',
    ],
    checksum: 'utility-proof-checksum',
  }

  return Object.assign(base, overrides)
}

const originalMemory = createMemory()
const originalSnapshot = JSON.stringify(originalMemory)

const retainAssessment = assessGovernedMemoryUtility({
  memory: originalMemory,
  evaluatedAt,
})

const repeatedRetainAssessment = assessGovernedMemoryUtility({
  memory: originalMemory,
  evaluatedAt,
})

assert.deepEqual(
  repeatedRetainAssessment,
  retainAssessment,
  'The same memory and evaluation instant must produce the same assessment.',
)

assert.equal(
  retainAssessment.recommendation,
  'retain',
)

assert.equal(
  retainAssessment.mutationApplied,
  false,
)

assert.equal(
  JSON.stringify(originalMemory),
  originalSnapshot,
  'Utility assessment must not mutate the source memory.',
)

const absentOperationalUtilitySignal =
  retainAssessment.signals.find(
    (signal) =>
      signal.name === 'operational-utility',
  )

assert.equal(
  absentOperationalUtilitySignal?.available,
  false,
)

assert.equal(
  absentOperationalUtilitySignal?.value,
  null,
)

const demoteAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-demote-proof',
    status: 'superseded',
  }),
  evaluatedAt,
})

assert.equal(
  demoteAssessment.recommendation,
  'demote',
)

const consolidateAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-consolidate-proof',
  }),
  evaluatedAt,
  externalSignals: {
    redundancyScore: 90,
  },
})

assert.equal(
  consolidateAssessment.recommendation,
  'consolidate',
)

const expireAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-expire-proof',
    validUntil: '2026-07-16T23:00:00.000Z',
  }),
  evaluatedAt,
})

assert.equal(
  expireAssessment.recommendation,
  'expire',
)

const revokeAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-revoke-proof',
  }),
  evaluatedAt,
  externalSignals: {
    sourceInvalidated: true,
  },
})

assert.equal(
  revokeAssessment.recommendation,
  'revoke',
)

const disputeAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-dispute-proof',
  }),
  evaluatedAt,
  externalSignals: {
    conflictDetected: true,
  },
})

assert.equal(
  disputeAssessment.recommendation,
  'dispute',
)

const boundedAssessment = assessGovernedMemoryUtility({
  memory: createMemory({
    memoryId: 'memory-bounds-proof',
    sourceAuthority: 1000,
    confidence: -100,
  }),
  evaluatedAt,
  externalSignals: {
    operationalUtility: 1000,
    redundancyScore: -100,
  },
})

assert.ok(
  boundedAssessment.utilityScore >= 0 &&
    boundedAssessment.utilityScore <= 100,
)

assert.equal(
  boundedAssessment.mutationApplied,
  false,
)

console.log(
  'Runtime governed memory utility assessment proof passed.',
)

console.log({
  deterministic:
    JSON.stringify(retainAssessment) ===
    JSON.stringify(repeatedRetainAssessment),
  retainRecommendation:
    retainAssessment.recommendation,
  demoteRecommendation:
    demoteAssessment.recommendation,
  consolidateRecommendation:
    consolidateAssessment.recommendation,
  expireRecommendation:
    expireAssessment.recommendation,
  revokeRecommendation:
    revokeAssessment.recommendation,
  disputeRecommendation:
    disputeAssessment.recommendation,
  missingSignalsExplicit:
    absentOperationalUtilitySignal?.available === false,
  mutationApplied:
    retainAssessment.mutationApplied,
  sourceMemoryPreserved:
    JSON.stringify(originalMemory) === originalSnapshot,
  utilityScoreBounded:
    boundedAssessment.utilityScore >= 0 &&
    boundedAssessment.utilityScore <= 100,
})
