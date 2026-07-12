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

  const recommendation =
    mode === 'recovery'
      ? 'Revalidate authority, risk, and execution constraints before retrying the operation.'
      : mode === 'cautious'
        ? 'Apply additional validation before continuing with the planned operation.'
        : plan.recommendation

  return {
    ...plan,
    recommendation,
    reasoning: [
      ...plan.reasoning,
      `adaptive-mode:${mode}`,
      `adaptive-influenced:${influenced}`,
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
