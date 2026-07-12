import assert from 'node:assert/strict'

import {
  readRuntimeCognitiveLearningState,
  resetRuntimeCognitiveLearningState,
  updateRuntimeCognitiveLearningState,
} from '../app/lib/runtime-cognitive-learning/runtime-cognitive-learning-state'

const phase = process.env.LEARNING_PERSISTENCE_PHASE

if (phase === 'write') {
  resetRuntimeCognitiveLearningState()

  const written = updateRuntimeCognitiveLearningState({
    lastKernelId: 'durable-kernel-test',
    lastCorrelationId: 'durable-correlation-test',
    lastExecutionAllowed: true,
    lastStopReason: 'completed',
    lastRecommendation: 'preserve-durable-learning',
    lastReflectionState: 'stable',
    lastConsensusRatio: 0.91,
  })

  assert.equal(written.cycleCount, 1)
  assert.equal(written.lastKernelId, 'durable-kernel-test')

  console.log(
    'OK: durable cognitive learning state written by first process.',
  )
} else if (phase === 'read') {
  const restored = readRuntimeCognitiveLearningState()

  assert.equal(restored.cycleCount, 1)
  assert.equal(restored.lastKernelId, 'durable-kernel-test')
  assert.equal(
    restored.lastCorrelationId,
    'durable-correlation-test',
  )
  assert.equal(restored.lastExecutionAllowed, true)
  assert.equal(restored.lastStopReason, 'completed')
  assert.equal(
    restored.lastRecommendation,
    'preserve-durable-learning',
  )
  assert.equal(restored.lastReflectionState, 'stable')
  assert.equal(restored.lastConsensusRatio, 0.91)

  console.log(
    'OK: durable cognitive learning state restored by second process.',
  )
} else {
  throw new Error(
    'LEARNING_PERSISTENCE_PHASE must be write or read',
  )
}
