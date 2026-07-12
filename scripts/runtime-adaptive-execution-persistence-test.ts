import assert from 'node:assert/strict'

import {
  completeRuntimeAdaptiveExecutionStep,
  createRuntimeAdaptiveExecutionState,
  evaluateRuntimeAdaptiveExecution,
} from '../app/lib/runtime-core/runtime-adaptive-execution-enforcement'

import {
  persistRuntimeAdaptiveExecutionState,
  readLatestRuntimeAdaptiveExecutionState,
} from '../app/lib/runtime-core/runtime-adaptive-execution-persistence'

import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

const plan = planRuntimeTask(
  'Execute uma operação persistente e controlada.',
)

let state =
  createRuntimeAdaptiveExecutionState(plan)

const firstDecision =
  evaluateRuntimeAdaptiveExecution(
    plan,
    state,
  )

assert.equal(
  firstDecision.executionAllowed,
  true,
  'Initial adaptive execution decision must allow the first step.',
)

assert.ok(
  firstDecision.currentStep,
  'Initial adaptive execution decision must expose the first step.',
)

state =
  completeRuntimeAdaptiveExecutionStep(
    plan,
    state,
    firstDecision.currentStep.id,
  )

persistRuntimeAdaptiveExecutionState(
  plan,
  state,
)

const recovered =
  readLatestRuntimeAdaptiveExecutionState(
    plan.taskId,
  )

assert.ok(
  recovered,
  'Persisted adaptive execution state must be recoverable.',
)

assert.equal(
  recovered.taskId,
  plan.taskId,
  'Recovered taskId must match the original plan.',
)

assert.deepEqual(
  recovered.state.steps,
  state.steps,
  'Recovered step state must match the persisted state.',
)

const resumedDecision =
  evaluateRuntimeAdaptiveExecution(
    recovered.plan,
    recovered.state,
  )

assert.equal(
  resumedDecision.executionAllowed,
  true,
  'Recovered state must allow continuation.',
)

assert.notEqual(
  resumedDecision.currentStep?.id,
  firstDecision.currentStep.id,
  'Recovered state must continue from the next step.',
)

console.log(
  'OK: adaptive execution state persisted and resumed correctly.',
)

console.log(
  JSON.stringify(
    {
      taskId: plan.taskId,
      completedStep:
        firstDecision.currentStep.id,
      resumedStep:
        resumedDecision.currentStep?.id ?? null,
      persistedStatuses:
        recovered.state.steps.map(
          ({ order, status }) => ({
            order,
            status,
          }),
        ),
    },
    null,
    2,
  ),
)
