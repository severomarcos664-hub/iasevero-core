import {
  readRuntimeCognitiveLearningState,
  resetRuntimeCognitiveLearningState,
  updateRuntimeCognitiveLearningState,
} from '../app/lib/runtime-cognitive-learning/runtime-cognitive-learning-state'

function assertCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

resetRuntimeCognitiveLearningState()

const before = readRuntimeCognitiveLearningState()

assertCondition(
  before.cycleCount === 0,
  'Initial learning cycle count must be zero',
)

const first = updateRuntimeCognitiveLearningState({
  lastKernelId: 'kernel-cycle-1',
  lastCorrelationId: 'correlation-cycle-1',
  lastExecutionAllowed: true,
  lastStopReason: 'completed',
  lastRecommendation: 'preserve-stable-route',
  lastReflectionState: 'stable',
  lastConsensusRatio: 0.8,
})

assertCondition(
  first.cycleCount === 1,
  'First update must create learning cycle 1',
)

const second = updateRuntimeCognitiveLearningState({
  lastKernelId: 'kernel-cycle-2',
  lastCorrelationId: 'correlation-cycle-2',
  lastExecutionAllowed: false,
  lastStopReason: 'blocked-by-authority',
  lastRecommendation: 'reduce-operational-risk',
  lastReflectionState: 'restricted',
  lastConsensusRatio: 0.6,
})

assertCondition(
  second.cycleCount === 2,
  'Second update must create learning cycle 2',
)

assertCondition(
  second.lastKernelId === 'kernel-cycle-2',
  'Second cycle must replace the previous kernel reference',
)

assertCondition(
  second.lastRecommendation === 'reduce-operational-risk',
  'Second cycle must preserve the latest recommendation',
)

assertCondition(
  typeof second.updatedAt === 'string' &&
    second.updatedAt.length > 0,
  'Learning state must contain an update timestamp',
)

console.log(
  'OK: runtime cognitive learning state preserved information across two cycles.',
)

console.log(
  JSON.stringify(
    {
      before,
      first,
      second,
    },
    null,
    2,
  ),
)
