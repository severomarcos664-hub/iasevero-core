import assert from 'node:assert/strict'

import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

const message = 'Analisar o estado operacional e propor a próxima ação segura.'

const withoutLearning = planRuntimeTask(message)

assert.equal(
  withoutLearning.learning.influenced,
  false,
)

assert.equal(
  withoutLearning.learning.previousCycleCount,
  0,
)

assert.equal(
  withoutLearning.learning.previousRecommendation,
  null,
)

const withLearning = planRuntimeTask(message, {
  cycleCount: 4,
  lastExecutionAllowed: false,
  lastRecommendation: 'reduce-operational-risk',
  lastReflectionState: 'restricted',
  lastConsensusRatio: 0.62,
})

assert.equal(
  withLearning.learning.influenced,
  true,
)

assert.equal(
  withLearning.learning.previousCycleCount,
  4,
)

assert.equal(
  withLearning.learning.previousExecutionAllowed,
  false,
)

assert.equal(
  withLearning.learning.previousRecommendation,
  'reduce-operational-risk',
)

assert.equal(
  withLearning.learning.previousReflectionState,
  'restricted',
)

assert.equal(
  withLearning.learning.previousConsensusRatio,
  0.62,
)

assert.notDeepEqual(
  withoutLearning.learning,
  withLearning.learning,
)

console.log(
  'OK: previous cognitive learning state influences the canonical task plan.',
)

console.log(
  JSON.stringify(
    {
      withoutLearning: withoutLearning.learning,
      withLearning: withLearning.learning,
    },
    null,
    2,
  ),
)
