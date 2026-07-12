import type {
  RuntimeTaskPlan,
  RuntimeTaskStep,
} from './runtime-task-planner'

export type RuntimeAdaptiveExecutionStepStatus =
  | 'pending'
  | 'ready'
  | 'running'
  | 'completed'
  | 'failed'
  | 'blocked'

export type RuntimeAdaptiveExecutionStepState = {
  id: string
  order: number
  status: RuntimeAdaptiveExecutionStepStatus
}

export type RuntimeAdaptiveExecutionState = {
  planTaskId: string
  steps: RuntimeAdaptiveExecutionStepState[]
}

export type RuntimeAdaptiveExecutionDecision = {
  executionAllowed: boolean
  currentStep: RuntimeTaskStep | null
  blockedStep: RuntimeTaskStep | null
  reason:
    | 'plan-completed'
    | 'next-step-ready'
    | 'previous-step-incomplete'
    | 'previous-step-failed'
    | 'invalid-execution-state'
  completedStepCount: number
  totalStepCount: number
}

function findStateForStep(
  state: RuntimeAdaptiveExecutionState,
  step: RuntimeTaskStep,
): RuntimeAdaptiveExecutionStepState | undefined {
  return state.steps.find(
    (candidate) => candidate.id === step.id,
  )
}

function isCompleted(
  state: RuntimeAdaptiveExecutionState,
  step: RuntimeTaskStep,
): boolean {
  return (
    findStateForStep(state, step)?.status ===
    'completed'
  )
}

export function createRuntimeAdaptiveExecutionState(
  plan: RuntimeTaskPlan,
): RuntimeAdaptiveExecutionState {
  return {
    planTaskId: plan.taskId,
    steps: plan.steps.map((step, index) => ({
      id: step.id,
      order: step.order,
      status:
        index === 0
          ? 'ready'
          : 'pending',
    })),
  }
}

export function evaluateRuntimeAdaptiveExecution(
  plan: RuntimeTaskPlan,
  state: RuntimeAdaptiveExecutionState,
): RuntimeAdaptiveExecutionDecision {
  if (state.planTaskId !== plan.taskId) {
    return {
      executionAllowed: false,
      currentStep: null,
      blockedStep: null,
      reason: 'invalid-execution-state',
      completedStepCount: 0,
      totalStepCount: plan.steps.length,
    }
  }

  const orderedSteps = [...plan.steps].sort(
    (a, b) => a.order - b.order,
  )

  const completedStepCount =
    orderedSteps.filter(
      (step) => isCompleted(state, step),
    ).length

  if (
    completedStepCount ===
    orderedSteps.length
  ) {
    return {
      executionAllowed: false,
      currentStep: null,
      blockedStep: null,
      reason: 'plan-completed',
      completedStepCount,
      totalStepCount: orderedSteps.length,
    }
  }

  for (
    let index = 0;
    index < orderedSteps.length;
    index += 1
  ) {
    const step = orderedSteps[index]
    const stepState =
      findStateForStep(state, step)

    if (!stepState) {
      return {
        executionAllowed: false,
        currentStep: null,
        blockedStep: step,
        reason: 'invalid-execution-state',
        completedStepCount,
        totalStepCount: orderedSteps.length,
      }
    }

    if (
      stepState.status === 'failed' ||
      stepState.status === 'blocked'
    ) {
      return {
        executionAllowed: false,
        currentStep: null,
        blockedStep: step,
        reason: 'previous-step-failed',
        completedStepCount,
        totalStepCount: orderedSteps.length,
      }
    }

    if (stepState.status === 'completed') {
      continue
    }

    const previousSteps =
      orderedSteps.slice(0, index)

    const previousCompleted =
      previousSteps.every(
        (previousStep) =>
          isCompleted(state, previousStep),
      )

    if (!previousCompleted) {
      return {
        executionAllowed: false,
        currentStep: null,
        blockedStep: step,
        reason: 'previous-step-incomplete',
        completedStepCount,
        totalStepCount: orderedSteps.length,
      }
    }

    if (
      stepState.status !== 'ready' &&
      stepState.status !== 'running'
    ) {
      return {
        executionAllowed: false,
        currentStep: null,
        blockedStep: step,
        reason: 'previous-step-incomplete',
        completedStepCount,
        totalStepCount: orderedSteps.length,
      }
    }

    return {
      executionAllowed: true,
      currentStep: step,
      blockedStep: null,
      reason: 'next-step-ready',
      completedStepCount,
      totalStepCount: orderedSteps.length,
    }
  }

  return {
    executionAllowed: false,
    currentStep: null,
    blockedStep: null,
    reason: 'invalid-execution-state',
    completedStepCount,
    totalStepCount: orderedSteps.length,
  }
}

export function completeRuntimeAdaptiveExecutionStep(
  plan: RuntimeTaskPlan,
  state: RuntimeAdaptiveExecutionState,
  stepId: string,
): RuntimeAdaptiveExecutionState {
  const orderedSteps = [...plan.steps].sort(
    (a, b) => a.order - b.order,
  )

  const currentIndex = orderedSteps.findIndex(
    (step) => step.id === stepId,
  )

  if (currentIndex < 0) {
    throw new Error(
      `Unknown runtime execution step: ${stepId}`,
    )
  }

  const currentDecision =
    evaluateRuntimeAdaptiveExecution(
      plan,
      state,
    )

  if (
    !currentDecision.executionAllowed ||
    currentDecision.currentStep?.id !==
      stepId
  ) {
    throw new Error(
      `Runtime execution step is not allowed: ${stepId}`,
    )
  }

  const nextStep =
    orderedSteps[currentIndex + 1]

  return {
    ...state,
    steps: state.steps.map((stepState) => {
      if (stepState.id === stepId) {
        return {
          ...stepState,
          status: 'completed',
        }
      }

      if (
        nextStep &&
        stepState.id === nextStep.id &&
        stepState.status === 'pending'
      ) {
        return {
          ...stepState,
          status: 'ready',
        }
      }

      return stepState
    }),
  }
}
