import assert from 'node:assert/strict'

import {
  decideGovernedMemoryUtilityReview,
  type GovernedMemoryUtilityAssessment,
} from '../app/lib/runtime-core/runtime-governed-memory-utility-assessment'

const tenantId = 'tenant-v283-12-proof'
const userId = 'user-v283-12-proof'
const memoryId = 'memory-v283-12-proof'
const generatedAt = '2026-07-19T23:00:00.000Z'

function createAssessment(
  overrides: Partial<GovernedMemoryUtilityAssessment>,
): GovernedMemoryUtilityAssessment {
  return {
    assessmentVersion: 1,
    assessmentId: 'assessment-v283-12-default',
    tenantId,
    userId,
    memoryId,
    evaluatedAt: '2026-07-19T20:00:00.000Z',
    utilityScore: 80,
    recommendation: 'retain',
    signals: [],
    evidence: [],
    reasoning: [
      'Governed assessment proof.',
    ],
    mutationApplied: false,
    ...overrides,
  }
}

const firstAssessment = createAssessment({
  assessmentId: 'assessment-v283-12-1',
  evaluatedAt: '2026-07-19T20:00:00.000Z',
  utilityScore: 82,
  recommendation: 'retain',
})

const secondAssessment = createAssessment({
  assessmentId: 'assessment-v283-12-2',
  evaluatedAt: '2026-07-19T21:00:00.000Z',
  utilityScore: 76,
  recommendation: 'retain',
})

const stableDecision =
  decideGovernedMemoryUtilityReview({
    assessments: [
      secondAssessment,
      firstAssessment,
    ],
    generatedAt,
  })

const repeatedStableDecision =
  decideGovernedMemoryUtilityReview({
    assessments: [
      firstAssessment,
      secondAssessment,
    ],
    generatedAt,
  })

assert.deepEqual(
  repeatedStableDecision,
  stableDecision,
  'Review decision must not depend on input order.',
)

assert.equal(
  stableDecision.recommendation,
  'retain',
)

assert.equal(
  stableDecision.stable,
  true,
)

assert.equal(
  stableDecision.divergent,
  false,
)

assert.equal(
  stableDecision.requiresReview,
  false,
)

assert.equal(
  stableDecision.mutationApplied,
  false,
)

assert.deepEqual(
  stableDecision.assessmentIds,
  [
    firstAssessment.assessmentId,
    secondAssessment.assessmentId,
  ],
)

const divergentAssessment = createAssessment({
  assessmentId: 'assessment-v283-12-3',
  evaluatedAt: '2026-07-19T22:00:00.000Z',
  utilityScore: 35,
  recommendation: 'demote',
})

const divergentDecision =
  decideGovernedMemoryUtilityReview({
    assessments: [
      divergentAssessment,
      firstAssessment,
    ],
    generatedAt,
  })

assert.equal(
  divergentDecision.recommendation,
  'demote',
  'The latest recommendation must resolve an equal-count tie.',
)

assert.equal(
  divergentDecision.divergent,
  true,
)

assert.equal(
  divergentDecision.requiresReview,
  true,
)

assert.equal(
  divergentDecision.mutationApplied,
  false,
)

let emptyHistoryBlocked = false

try {
  decideGovernedMemoryUtilityReview({
    assessments: [],
    generatedAt,
  })
} catch {
  emptyHistoryBlocked = true
}

assert.equal(
  emptyHistoryBlocked,
  true,
)

let crossUserHistoryBlocked = false

try {
  decideGovernedMemoryUtilityReview({
    assessments: [
      firstAssessment,
      createAssessment({
        assessmentId:
          'assessment-v283-12-cross-user',
        userId: 'other-user-v283-12-proof',
      }),
    ],
    generatedAt,
  })
} catch {
  crossUserHistoryBlocked = true
}

assert.equal(
  crossUserHistoryBlocked,
  true,
)

let mutatedAssessmentBlocked = false

try {
  decideGovernedMemoryUtilityReview({
    assessments: [
      {
        ...firstAssessment,
        mutationApplied: true,
      } as unknown as GovernedMemoryUtilityAssessment,
    ],
    generatedAt,
  })
} catch {
  mutatedAssessmentBlocked = true
}

assert.equal(
  mutatedAssessmentBlocked,
  true,
)

console.log(
  'Runtime governed memory assessment review decision proof passed.',
)

console.log({
  deterministic:
    JSON.stringify(stableDecision) ===
    JSON.stringify(repeatedStableDecision),
  assessmentOrderNormalized:
    stableDecision.assessmentIds[0] ===
      firstAssessment.assessmentId,
  stableRecommendation:
    stableDecision.recommendation === 'retain',
  stableHistoryDetected:
    stableDecision.stable,
  divergentHistoryDetected:
    divergentDecision.divergent,
  latestTieBreakApplied:
    divergentDecision.recommendation ===
      'demote',
  reviewRequired:
    divergentDecision.requiresReview,
  emptyHistoryBlocked,
  crossUserHistoryBlocked,
  mutatedAssessmentBlocked,
  mutationApplied:
    stableDecision.mutationApplied ||
    divergentDecision.mutationApplied,
})
