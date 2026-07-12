import assert from 'node:assert/strict'

import {
  adaptRuntimeTaskPlan,
} from '../app/lib/runtime-core/runtime-adaptive-planning-policy'

import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

import type {
  RuntimeCognitiveLearningState,
} from '../app/lib/runtime-cognitive-learning/runtime-cognitive-learning-state'

const message =
  'Execute uma operação governada com validação de risco.'

const createLearningState = (
  overrides: Partial<RuntimeCognitiveLearningState>,
): RuntimeCognitiveLearningState => ({
  version: 1,
  cycleCount: 0,
  lastKernelId: null,
  lastCorrelationId: null,
  lastExecutionAllowed: null,
  lastStopReason: null,
  lastRecommendation: null,
  lastReflectionState: null,
  lastConsensusRatio: null,
  updatedAt: null,
  ...overrides,
})

const basePlan = planRuntimeTask(message)

const baseline = adaptRuntimeTaskPlan(
  basePlan,
  createLearningState({}),
)

assert.equal(baseline.adaptation.mode, 'baseline')
assert.equal(baseline.adaptation.influenced, false)
assert.equal(
  baseline.recommendation,
  basePlan.recommendation,
)

const cautious = adaptRuntimeTaskPlan(
  basePlan,
  createLearningState({
    cycleCount: 3,
    lastExecutionAllowed: true,
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.62,
  }),
)

assert.equal(cautious.adaptation.mode, 'cautious')
assert.equal(cautious.adaptation.influenced, true)
assert.equal(
  cautious.adaptation.reflectionPreviouslyRestricted,
  true,
)
assert.equal(
  cautious.adaptation.consensusPreviouslyLow,
  true,
)
assert.notEqual(
  cautious.recommendation,
  basePlan.recommendation,
)

const recovery = adaptRuntimeTaskPlan(
  basePlan,
  createLearningState({
    cycleCount: 4,
    lastExecutionAllowed: false,
    lastStopReason: 'blocked-by-authority',
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.55,
  }),
)

assert.equal(recovery.adaptation.mode, 'recovery')
assert.equal(recovery.adaptation.influenced, true)
assert.equal(
  recovery.adaptation.executionPreviouslyBlocked,
  true,
)
assert.ok(
  recovery.reasoning.includes(
    'adaptive-reason:previous-execution-blocked',
  ),
)

assert.notEqual(
  recovery.recommendation,
  baseline.recommendation,
)

console.log(
  'OK: cognitive learning state changes adaptive planning behavior.',
)

console.log(
  JSON.stringify(
    {
      baseline: baseline.adaptation,
      cautious: cautious.adaptation,
      recovery: recovery.adaptation,
    },
    null,
    2,
  ),
)
