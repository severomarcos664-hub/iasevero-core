import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import { createRequire } from 'node:module'

import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

import {
  decideGovernedMemoryUtilityReview,
  type GovernedMemoryUtilityAssessment,
} from '../app/lib/runtime-core/runtime-governed-memory-utility-assessment'

type RawSQLiteStatement = {
  run: (...parameters: unknown[]) => unknown
}

type RawSQLiteDatabase = {
  prepare: (sql: string) => RawSQLiteStatement
  close: () => void
}

type RawSQLiteModule = {
  DatabaseSync: new (
    databasePath: string,
  ) => RawSQLiteDatabase
}

const require = createRequire(import.meta.url)

const {
  DatabaseSync,
} = require('node:sqlite') as RawSQLiteModule

const databasePath =
  'data/v283-13-governed-memory-review-workflow-proof.sqlite'

rmSync(databasePath, {
  force: true,
})

const tenantId = 'tenant-v283-13'
const userId = 'user-v283-13'
const otherUserId = 'other-user-v283-13'
const executionKey = 'execution-v283-13'

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const memory = repository.createMemory({
  tenantId,
  userId,
  executionKey,
  type: 'semantic',
  content:
    'A IASevero preserva decisões de memória sob governança.',
  structuredPayload: {
    topic: 'governed-memory-review',
  },
  source: 'runtime-v283-13-proof',
  sourceEventIds: [],
  sourceAuthority: 90,
  confidence: 88,
  status: 'active',
  policyTags: [
    'governed-memory',
    'review-workflow',
  ],
})

function assessment(
  input: {
    assessmentId: string
    evaluatedAt: string
    utilityScore: number
    recommendation:
      GovernedMemoryUtilityAssessment['recommendation']
  },
): GovernedMemoryUtilityAssessment {
  return {
    assessmentVersion: 1,
    assessmentId: input.assessmentId,
    tenantId,
    userId,
    memoryId: memory.memoryId,
    evaluatedAt: input.evaluatedAt,
    utilityScore: input.utilityScore,
    recommendation: input.recommendation,
    signals: [],
    evidence: [],
    reasoning: [],
    mutationApplied: false,
  }
}

const reviewDecision =
  decideGovernedMemoryUtilityReview({
    assessments: [
      assessment({
        assessmentId: 'assessment-v283-13-1',
        evaluatedAt:
          '2026-07-20T18:00:00.000Z',
        utilityScore: 40,
        recommendation: 'demote',
      }),
      assessment({
        assessmentId: 'assessment-v283-13-2',
        evaluatedAt:
          '2026-07-20T19:00:00.000Z',
        utilityScore: 35,
        recommendation: 'demote',
      }),
    ],
    generatedAt:
      '2026-07-20T19:10:00.000Z',
  })

assert.equal(
  reviewDecision.requiresReview,
  true,
)

const request =
  repository.createMemoryReviewRequest({
    decision: reviewDecision,
    requestId: 'review-request-v283-13',
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
    createdAt:
      '2026-07-20T19:11:00.000Z',
  })

assert.ok(request)

assert.equal(
  request.status,
  'pending',
)

assert.equal(
  request.mutationApplied,
  false,
)

const pendingHistory =
  repository.readMemoryReviewHistory({
    tenantId,
    userId,
    requestId: request.requestId,
  })

assert.equal(
  pendingHistory.length,
  1,
)

assert.equal(
  pendingHistory[0]?.eventType,
  'review-requested',
)

const acceptedEvent =
  repository.transitionMemoryReviewRequest({
    eventId: 'review-event-v283-13-accepted',
    tenantId,
    userId,
    requestId: request.requestId,
    targetStatus: 'accepted',
    actorId: userId,
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
    reason:
      'A recomendação foi aceita para processamento futuro.',
    createdAt:
      '2026-07-20T19:12:00.000Z',
  })

assert.equal(
  acceptedEvent.resultingStatus,
  'accepted',
)

assert.equal(
  acceptedEvent.mutationApplied,
  false,
)

const acceptedRequest =
  repository.readMemoryReviewRequest({
    tenantId,
    userId,
    requestId: request.requestId,
  })

assert.equal(
  acceptedRequest?.status,
  'accepted',
)

const finalHistory =
  repository.readMemoryReviewHistory({
    tenantId,
    userId,
    requestId: request.requestId,
  })

assert.deepEqual(
  finalHistory.map(
    (event) => event.eventType,
  ),
  [
    'review-requested',
    'review-accepted',
  ],
)

let terminalReopenBlocked = false

try {
  repository.transitionMemoryReviewRequest({
    tenantId,
    userId,
    requestId: request.requestId,
    targetStatus: 'cancelled',
    actorId: userId,
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
    reason:
      'Tentativa inválida após estado terminal.',
  })
} catch {
  terminalReopenBlocked = true
}

assert.equal(
  terminalReopenBlocked,
  true,
)

let crossUserBlocked = false

try {
  repository.transitionMemoryReviewRequest({
    tenantId,
    userId: otherUserId,
    requestId: request.requestId,
    targetStatus: 'rejected',
    actorId: otherUserId,
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
    reason:
      'Tentativa cruzada entre usuários.',
  })
} catch {
  crossUserBlocked = true
}

assert.equal(
  crossUserBlocked,
  true,
)

let duplicateDecisionBlocked = false

try {
  repository.createMemoryReviewRequest({
    decision: reviewDecision,
    requestId:
      'review-request-v283-13-duplicate',
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
  })
} catch {
  duplicateDecisionBlocked = true
}

assert.equal(
  duplicateDecisionBlocked,
  true,
)

const secondDecision = {
  ...reviewDecision,
  decisionId:
    `${reviewDecision.decisionId}:rejection-proof`,
}

const rejectionRequest =
  repository.createMemoryReviewRequest({
    decision: secondDecision,
    requestId:
      'review-request-v283-13-rejection',
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
  })

assert.ok(rejectionRequest)

let rejectionWithoutReasonBlocked = false

try {
  repository.transitionMemoryReviewRequest({
    tenantId,
    userId,
    requestId: rejectionRequest.requestId,
    targetStatus: 'rejected',
    actorId: userId,
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
  })
} catch {
  rejectionWithoutReasonBlocked = true
}

assert.equal(
  rejectionWithoutReasonBlocked,
  true,
)

const stableDecision =
  decideGovernedMemoryUtilityReview({
    assessments: [
      assessment({
        assessmentId:
          'assessment-v283-13-stable-1',
        evaluatedAt:
          '2026-07-20T18:00:00.000Z',
        utilityScore: 90,
        recommendation: 'retain',
      }),
      assessment({
        assessmentId:
          'assessment-v283-13-stable-2',
        evaluatedAt:
          '2026-07-20T19:00:00.000Z',
        utilityScore: 92,
        recommendation: 'retain',
      }),
    ],
    generatedAt:
      '2026-07-20T19:20:00.000Z',
  })

const stableRequest =
  repository.createMemoryReviewRequest({
    decision: stableDecision,
    source: 'runtime-v283-13-proof',
    sourceAuthority: 95,
  })

assert.equal(
  stableRequest,
  undefined,
)

const memoryAfterWorkflow =
  repository.readMemoryById({
    tenantId,
    userId,
    memoryId: memory.memoryId,
  })

assert.deepEqual(
  memoryAfterWorkflow,
  memory,
  'Review workflow must not mutate the source memory.',
)

repository.close()

const rawDatabase =
  new DatabaseSync(databasePath)

let requestUpdateBlocked = false

try {
  rawDatabase
    .prepare(
      `
        UPDATE enterprise_memory_review_requests
        SET source = ?
        WHERE request_id = ?
      `,
    )
    .run(
      'forbidden-update',
      request.requestId,
    )
} catch {
  requestUpdateBlocked = true
}

assert.equal(
  requestUpdateBlocked,
  true,
)

let eventDeleteBlocked = false

try {
  rawDatabase
    .prepare(
      `
        DELETE FROM enterprise_memory_review_events
        WHERE request_id = ?
      `,
    )
    .run(request.requestId)
} catch {
  eventDeleteBlocked = true
}

assert.equal(
  eventDeleteBlocked,
  true,
)

rawDatabase.close()

rmSync(databasePath, {
  force: true,
})

console.log(
  'Runtime governed memory review workflow proof passed.',
)

console.log({
  pendingCreated:
    request.status === 'pending',
  stableDecisionSkipped:
    stableRequest === undefined,
  acceptedRecorded:
    acceptedRequest?.status === 'accepted',
  historyAppendOnly:
    requestUpdateBlocked &&
    eventDeleteBlocked,
  historyOrdered:
    finalHistory[0]?.eventType ===
      'review-requested' &&
    finalHistory[1]?.eventType ===
      'review-accepted',
  terminalReopenBlocked,
  crossUserBlocked,
  duplicateDecisionBlocked,
  rejectionWithoutReasonBlocked,
  sourceMemoryPreserved:
    JSON.stringify(memoryAfterWorkflow) ===
    JSON.stringify(memory),
  mutationApplied:
    request.mutationApplied ||
    acceptedEvent.mutationApplied,
})
