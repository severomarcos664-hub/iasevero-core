import type {
  RuntimeTaskPlan,
} from './runtime-task-planner'

import type {
  RuntimeCognitiveLearningState,
} from '../runtime-cognitive-learning/runtime-cognitive-learning-state'

export type RuntimeAdaptivePlanningMode =
  | 'baseline'
  | 'cautious'
  | 'recovery'

export type RuntimeAdaptivePlanningEvidence = {
  mode: RuntimeAdaptivePlanningMode
  influenced: boolean
  previousCycleCount: number
  executionPreviouslyBlocked: boolean
  reflectionPreviouslyRestricted: boolean
  consensusPreviouslyLow: boolean
  reasons: string[]
}

export type RuntimeAdaptiveTaskPlan = RuntimeTaskPlan & {
  adaptation: RuntimeAdaptivePlanningEvidence
}

const LOW_CONSENSUS_THRESHOLD = 0.7


function buildAdaptiveSteps(
  plan: RuntimeTaskPlan,
  mode: RuntimeAdaptivePlanningMode,
): RuntimeTaskPlan['steps'] {
  if (mode === 'baseline') {
    return plan.steps
  }

  const firstStep = plan.steps[0]
  const executionStep =
    plan.steps.find((step) => step.type === 'execution') ??
    plan.steps[1] ??
    firstStep

  if (!firstStep || !executionStep) {
    return plan.steps
  }

  if (mode === 'cautious') {
    return [
      {
        ...firstStep,
        id: `${plan.taskId}-adaptive-analysis`,
        order: 1,
        title: firstStep.title,
        status: 'ready',
      },
      {
        ...firstStep,
        id: `${plan.taskId}-risk-review`,
        order: 2,
        title:
          'Review previous operational risk and validate constraints.',
        type: 'analysis',
        required: true,
        status: 'ready',
      },
      {
        ...executionStep,
        id: `${plan.taskId}-controlled-execution`,
        order: 3,
        title:
          'Prepare controlled execution after additional validation.',
        type: 'execution',
        required: true,
        status: 'pending',
      },
      {
        ...firstStep,
        id: `${plan.taskId}-post-validation`,
        order: 4,
        title:
          'Validate the execution result against risk and governance criteria.',
        type: 'analysis',
        required: true,
        status: 'pending',
      },
    ]
  }

  return [
    {
      ...firstStep,
      id: `${plan.taskId}-failure-analysis`,
      order: 1,
      title:
        'Analyze the previous blocked or restricted operation.',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      ...firstStep,
      id: `${plan.taskId}-alternative-route`,
      order: 2,
      title:
        'Create an alternative route that avoids the previous failure condition.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
    {
      ...firstStep,
      id: `${plan.taskId}-authority-revalidation`,
      order: 3,
      title:
        'Revalidate authority, policy, and execution constraints.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
    {
      ...executionStep,
      id: `${plan.taskId}-contained-execution`,
      order: 4,
      title:
        'Execute the authorized alternative route with containment.',
      type: 'execution',
      required: true,
      status: 'pending',
    },
    {
      ...firstStep,
      id: `${plan.taskId}-recovery-verification`,
      order: 5,
      title:
        'Verify recovery, integrity, and operational stability.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
  ]
}

export function adaptRuntimeTaskPlan(
  plan: RuntimeTaskPlan,
  learningState: RuntimeCognitiveLearningState,
): RuntimeAdaptiveTaskPlan {
  const executionPreviouslyBlocked =
    learningState.lastExecutionAllowed === false

  const reflectionPreviouslyRestricted =
    learningState.lastReflectionState === 'restricted'

  const consensusPreviouslyLow =
    learningState.lastConsensusRatio !== null &&
    learningState.lastConsensusRatio <
      LOW_CONSENSUS_THRESHOLD

  const reasons: string[] = []

  if (executionPreviouslyBlocked) {
    reasons.push('previous-execution-blocked')
  }

  if (reflectionPreviouslyRestricted) {
    reasons.push('previous-reflection-restricted')
  }

  if (consensusPreviouslyLow) {
    reasons.push('previous-consensus-low')
  }

  const influenced =
    learningState.cycleCount > 0 &&
    reasons.length > 0

  const mode: RuntimeAdaptivePlanningMode =
    executionPreviouslyBlocked
      ? 'recovery'
      : influenced
        ? 'cautious'
        : 'baseline'

  const adaptiveSteps = buildAdaptiveSteps(
    plan,
    mode,
  )

  const recommendation =
    mode === 'recovery'
      ? 'Revalidate authority, risk, and execution constraints before retrying the operation.'
      : mode === 'cautious'
        ? 'Apply additional validation before continuing with the planned operation.'
        : plan.recommendation

  return {
    ...plan,
    steps: adaptiveSteps,
    recommendation,
    reasoning: [
      ...plan.reasoning,
      `adaptive-mode:${mode}`,
      `adaptive-influenced:${influenced}`,
      `adaptive-original-steps:${plan.steps.length}`,
      `adaptive-final-steps:${adaptiveSteps.length}`,
      ...reasons.map(
        (reason) => `adaptive-reason:${reason}`,
      ),
    ],
    adaptation: {
      mode,
      influenced,
      previousCycleCount: learningState.cycleCount,
      executionPreviouslyBlocked,
      reflectionPreviouslyRestricted,
      consensusPreviouslyLow,
      reasons,
    },
  }
}
