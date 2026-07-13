import assert from 'node:assert/strict'

import {
  runRuntimeCognitiveKernel,
} from '../app/lib/runtime-core/runtime-cognitive-kernel-integration'

const executionKey =
  `stable-execution-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`

const firstRun =
  runRuntimeCognitiveKernel({
    message:
      'Execute uma operação controlada com retomada persistente.',
    userId: 'stable-execution-test-user',
    executionKey,
  })

assert.equal(
  firstRun.stages.executionPersistence.executionKey,
  executionKey,
  'The first run must preserve the supplied executionKey.',
)

assert.equal(
  firstRun.stages.executionPersistence.source,
  'new',
  'The first run must create a new persistent execution.',
)

const originalTaskId =
  firstRun.stages.executionPersistence.taskId

const secondRun =
  runRuntimeCognitiveKernel({
    message:
      'Execute uma operação controlada com retomada persistente.',
    userId: 'stable-execution-test-user',
    executionKey,
  })

assert.equal(
  secondRun.stages.executionPersistence.executionKey,
  executionKey,
  'The second run must preserve the same executionKey.',
)

assert.equal(
  secondRun.stages.executionPersistence.source,
  'recovered',
  'The second run must recover the persisted execution.',
)

assert.equal(
  secondRun.stages.executionPersistence.taskId,
  originalTaskId,
  'The recovered execution must preserve the original taskId.',
)

assert.deepEqual(
  secondRun.stages.planning,
  firstRun.stages.planning,
  'The recovered execution must reuse the original plan.',
)

assert.equal(
  secondRun.stages.executionEnforcement
    .initialState.planTaskId,
  originalTaskId,
  'The recovered execution state must belong to the original plan.',
)

console.log(
  'OK: stable executionKey recovered the original persistent execution.',
)

console.log(
  JSON.stringify(
    {
      executionKey,
      firstSource:
        firstRun.stages.executionPersistence.source,
      secondSource:
        secondRun.stages.executionPersistence.source,
      originalTaskId,
      recoveredTaskId:
        secondRun.stages.executionPersistence.taskId,
      finalReason:
        secondRun.stages.executionEnforcement
          .finalDecision.reason,
    },
    null,
    2,
  ),
)
