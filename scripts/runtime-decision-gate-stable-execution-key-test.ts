import assert from 'node:assert/strict'

import {
  evaluateRuntimeDecisionGate,
} from '../app/lib/runtime-core/runtime-decision-gate'

const executionKey =
  `decision-gate-stable-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`

const message =
  'Execute uma tarefa governada com recuperação persistente.'

const userId =
  'decision-gate-stable-execution-test-user'

const firstRun =
  evaluateRuntimeDecisionGate(
    message,
    userId,
    executionKey,
  )

const secondRun =
  evaluateRuntimeDecisionGate(
    message,
    userId,
    executionKey,
  )

assert.equal(
  firstRun.kernel.stages.executionPersistence.executionKey,
  executionKey,
  'Decision Gate must forward the supplied executionKey.',
)

assert.equal(
  firstRun.kernel.stages.executionPersistence.source,
  'new',
  'The first Decision Gate call must create a new execution.',
)

assert.equal(
  secondRun.kernel.stages.executionPersistence.source,
  'recovered',
  'The second Decision Gate call must recover the execution.',
)

assert.equal(
  secondRun.kernel.stages.executionPersistence.taskId,
  firstRun.kernel.stages.executionPersistence.taskId,
  'Decision Gate recovery must preserve the original taskId.',
)

console.log(
  'OK: Decision Gate preserved stable persistent execution.',
)

console.log(
  JSON.stringify(
    {
      executionKey,
      firstSource:
        firstRun.kernel.stages.executionPersistence.source,
      secondSource:
        secondRun.kernel.stages.executionPersistence.source,
      taskId:
        secondRun.kernel.stages.executionPersistence.taskId,
      allowed:
        secondRun.allowed,
    },
    null,
    2,
  ),
)
