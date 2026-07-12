import assert from 'node:assert/strict'

import {
  adaptRuntimeTaskPlan,
} from '../app/lib/runtime-core/runtime-adaptive-planning-policy'

import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

import {
  completeRuntimeAdaptiveExecutionStep,
  createRuntimeAdaptiveExecutionState,
  evaluateRuntimeAdaptiveExecution,
} from '../app/lib/runtime-core/runtime-adaptive-execution-enforcement'

import type {
  RuntimeCognitiveLearningState,
} from '../app/lib/runtime-cognitive-learning/runtime-cognitive-learning-state'

const createState = (
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

const message =
  'Implemente uma alteração controlada e valide o resultado.'

const recoveryPlan = adaptRuntimeTaskPlan(
  planRuntimeTask(message),
  createState({
    cycleCount: 4,
    lastExecutionAllowed: false,
    lastStopReason: 'blocked-by-authority',
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.55,
  }),
)

let executionState =
  createRuntimeAdaptiveExecutionState(
    recoveryPlan,
  )

let decision =
  evaluateRuntimeAdaptiveExecution(
    recoveryPlan,
    executionState,
  )

assert.equal(
  decision.executionAllowed,
  true,
)

assert.equal(
  decision.currentStep?.order,
  1,
)

const executionStep =
  recoveryPlan.steps.find(
    (step) => step.type === 'execution',
  )

assert.ok(executionStep)

assert.throws(
  () =>
    completeRuntimeAdaptiveExecutionStep(
      recoveryPlan,
      executionState,
      executionStep.id,
    ),
  /Runtime execution step is not allowed/,
)

for (const step of recoveryPlan.steps) {
  decision =
    evaluateRuntimeAdaptiveExecution(
      recoveryPlan,
      executionState,
    )

  assert.equal(
    decision.executionAllowed,
    true,
  )

  assert.equal(
    decision.currentStep?.id,
    step.id,
  )

  executionState =
    completeRuntimeAdaptiveExecutionStep(
      recoveryPlan,
      executionState,
      step.id,
    )
}

decision =
  evaluateRuntimeAdaptiveExecution(
    recoveryPlan,
    executionState,
  )

assert.equal(
  decision.executionAllowed,
  false,
)

assert.equal(
  decision.reason,
  'plan-completed',
)

const invalidState = {
  ...executionState,
  planTaskId: 'different-task',
}

const invalidDecision =
  evaluateRuntimeAdaptiveExecution(
    recoveryPlan,
    invalidState,
  )

assert.equal(
  invalidDecision.executionAllowed,
  false,
)

assert.equal(
  invalidDecision.reason,
  'invalid-execution-state',
)

const failedState =
  createRuntimeAdaptiveExecutionState(
    recoveryPlan,
  )

failedState.steps[0].status = 'failed'

const failedDecision =
  evaluateRuntimeAdaptiveExecution(
    recoveryPlan,
    failedState,
  )

assert.equal(
  failedDecision.executionAllowed,
  false,
)

assert.equal(
  failedDecision.reason,
  'previous-step-failed',
)

console.log(
  'OK: adaptive execution enforcement respects canonical plan order.',
)

console.log(
  JSON.stringify(
    {
      mode: recoveryPlan.adaptation.mode,
      totalSteps: recoveryPlan.steps.length,
      finalReason: decision.reason,
      invalidStateReason:
        invalidDecision.reason,
      failedStateReason:
        failedDecision.reason,
    },
    null,
    2,
  ),
)
