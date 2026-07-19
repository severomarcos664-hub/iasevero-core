import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { rmSync } from 'node:fs'
import { createRequire } from 'node:module'

type RawSQLiteStatement = {
  run: (...parameters: unknown[]) => unknown
}

type RawSQLiteDatabase = {
  prepare: (sql: string) => RawSQLiteStatement
  close: () => void
}

type RawSQLiteModule = {
  DatabaseSync: new (databasePath: string) => RawSQLiteDatabase
}

const require = createRequire(import.meta.url)

const {
  DatabaseSync,
} = require('node:sqlite') as RawSQLiteModule

import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

import {
  assessGovernedMemoryUtility,
} from '../app/lib/runtime-core/runtime-governed-memory-utility-assessment'

const databasePath =
  `/tmp/iasevero-v283-11-${randomUUID()}.sqlite`

const tenantId = 'tenant-v283-11-proof'
const userId = 'user-v283-11-proof'
const otherUserId = 'other-user-v283-11-proof'
const executionKey = 'v283.11-assessment-history-proof'

const firstEvaluatedAt = '2026-07-17T23:30:00.000Z'
const secondEvaluatedAt = '2026-07-18T23:30:00.000Z'

let repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const memory = repository.createMemory({
  tenantId,
  userId,
  executionKey,
  type: 'semantic',
  content:
    'IASevero preserves governed memory utility assessments.',
  structuredPayload: {
    topic: 'governed-memory',
    capability: 'utility-assessment-history',
  },
  source:
    'runtime-governed-memory-assessment-persistence-history-proof',
  sourceEventIds: [
    'event-v283-11-proof-1',
  ],
  sourceAuthority: 90,
  confidence: 92,
  status: 'active',
  policyTags: [
    'memory',
    'utility-assessment',
    'history',
  ],
})

const originalMemorySnapshot =
  JSON.stringify(memory)

const firstAssessment =
  assessGovernedMemoryUtility({
    memory,
    evaluatedAt: firstEvaluatedAt,
  })

const secondAssessment =
  assessGovernedMemoryUtility({
    memory,
    evaluatedAt: secondEvaluatedAt,
    externalSignals: {
      operationalUtility: 20,
      redundancyScore: 15,
      conflictDetected: false,
      sourceInvalidated: false,
    },
  })

repository.appendMemoryUtilityAssessment({
  assessment: firstAssessment,
  createdAt: firstEvaluatedAt,
})

repository.appendMemoryUtilityAssessment({
  assessment: secondAssessment,
  createdAt: secondEvaluatedAt,
})

const inSessionHistory =
  repository.readMemoryUtilityAssessmentHistory({
    tenantId,
    userId,
    memoryId: memory.memoryId,
    limit: 10,
  })

assert.equal(
  inSessionHistory.length,
  2,
  'Two governed assessments must be persisted.',
)

assert.equal(
  inSessionHistory[0]?.assessmentId,
  firstAssessment.assessmentId,
  'The first assessment must preserve insertion order.',
)

assert.equal(
  inSessionHistory[1]?.assessmentId,
  secondAssessment.assessmentId,
  'The second assessment must preserve insertion order.',
)

assert.equal(
  inSessionHistory[0]?.mutationApplied,
  false,
)

assert.equal(
  inSessionHistory[1]?.mutationApplied,
  false,
)

const isolatedHistory =
  repository.readMemoryUtilityAssessmentHistory({
    tenantId,
    userId: otherUserId,
    memoryId: memory.memoryId,
    limit: 10,
  })

assert.equal(
  isolatedHistory.length,
  0,
  'Another user must not read the assessment history.',
)

let duplicateAssessmentBlocked = false

try {
  repository.appendMemoryUtilityAssessment({
    assessment: firstAssessment,
  })
} catch {
  duplicateAssessmentBlocked = true
}

assert.equal(
  duplicateAssessmentBlocked,
  true,
  'A duplicate assessmentId must be rejected.',
)

let missingMemoryBlocked = false

try {
  repository.appendMemoryUtilityAssessment({
    assessment: {
      ...firstAssessment,
      assessmentId: 'assessment-missing-memory-proof',
      memoryId: 'missing-memory-proof',
    },
  })
} catch {
  missingMemoryBlocked = true
}

assert.equal(
  missingMemoryBlocked,
  true,
  'An assessment for a missing memory must be rejected.',
)

let crossUserAppendBlocked = false

try {
  repository.appendMemoryUtilityAssessment({
    assessment: {
      ...firstAssessment,
      assessmentId: 'assessment-cross-user-proof',
      userId: otherUserId,
    },
  })
} catch {
  crossUserAppendBlocked = true
}

assert.equal(
  crossUserAppendBlocked,
  true,
  'Cross-user assessment persistence must be rejected.',
)

let mutationAppliedBlocked = false

try {
  repository.appendMemoryUtilityAssessment({
    assessment: {
      ...firstAssessment,
      assessmentId: 'assessment-mutation-proof',
      mutationApplied: true,
    } as unknown as typeof firstAssessment,
  })
} catch {
  mutationAppliedBlocked = true
}

assert.equal(
  mutationAppliedBlocked,
  true,
  'An assessment declaring an applied mutation must be rejected.',
)

const memoryAfterAssessments =
  repository.readMemoryById({
    tenantId,
    userId,
    memoryId: memory.memoryId,
  })

assert.ok(memoryAfterAssessments)

assert.equal(
  JSON.stringify(memoryAfterAssessments),
  originalMemorySnapshot,
  'Assessment persistence must not mutate the source memory.',
)

repository.close()

const rawDatabase = new DatabaseSync(databasePath)

let updateBlocked = false

try {
  rawDatabase
    .prepare(`
      UPDATE enterprise_memory_utility_assessments
      SET utility_score = 0
      WHERE assessment_id = ?
    `)
    .run(firstAssessment.assessmentId)
} catch {
  updateBlocked = true
}

let deleteBlocked = false

try {
  rawDatabase
    .prepare(`
      DELETE FROM enterprise_memory_utility_assessments
      WHERE assessment_id = ?
    `)
    .run(firstAssessment.assessmentId)
} catch {
  deleteBlocked = true
}

rawDatabase.close()

assert.equal(
  updateBlocked,
  true,
  'Persisted assessments must reject UPDATE.',
)

assert.equal(
  deleteBlocked,
  true,
  'Persisted assessments must reject DELETE.',
)

repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const recoveredHistory =
  repository.readMemoryUtilityAssessmentHistory({
    tenantId,
    userId,
    memoryId: memory.memoryId,
    limit: 10,
  })

assert.deepEqual(
  recoveredHistory,
  inSessionHistory,
  'Assessment history must survive repository reopening.',
)

const recoveredMemory =
  repository.readMemoryById({
    tenantId,
    userId,
    memoryId: memory.memoryId,
  })

assert.ok(recoveredMemory)

assert.equal(
  JSON.stringify(recoveredMemory),
  originalMemorySnapshot,
  'The source memory must remain unchanged after reopening.',
)

repository.close()

rmSync(databasePath, {
  force: true,
})

console.log(
  'Runtime governed memory assessment persistence and history proof passed.',
)

console.log({
  assessmentsPersisted:
    recoveredHistory.length === 2,
  deterministicHistoryOrder:
    recoveredHistory[0]?.assessmentId ===
      firstAssessment.assessmentId &&
    recoveredHistory[1]?.assessmentId ===
      secondAssessment.assessmentId,
  persistenceAfterReopen:
    JSON.stringify(recoveredHistory) ===
    JSON.stringify(inSessionHistory),
  crossUserReadBlocked:
    isolatedHistory.length === 0,
  crossUserAppendBlocked,
  missingMemoryBlocked,
  duplicateAssessmentBlocked,
  mutationAppliedBlocked,
  updateBlocked,
  deleteBlocked,
  sourceMemoryPreserved:
    JSON.stringify(recoveredMemory) ===
    originalMemorySnapshot,
  mutationsApplied:
    recoveredHistory.some(
      (assessment) =>
        assessment.mutationApplied !== false,
    ),
})
