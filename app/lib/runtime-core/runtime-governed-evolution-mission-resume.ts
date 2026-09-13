import {
  loadGovernedEvolutionMissionState,
  type GovernedEvolutionMissionState,
} from './runtime-governed-evolution-mission-state'

export type GovernedEvolutionMissionResumeReason =
  | 'active-mission-resumable'
  | 'research-iterations-exhausted'
  | 'waiting-human-authorization'
  | 'mission-paused'
  | 'mission-completed'
  | 'mission-failed'

export type GovernedEvolutionMissionResumeAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-resume-assessment'

  missionId: string
  objectiveId: string

  missionStateVerified: true
  checkpointVerified: true
  resumeAssessmentCompleted: true

  checkpointSequence: number
  currentTaskId: string | null
  researchIteration: number
  maximumResearchIterations: number

  resumeEligible: boolean
  reason: GovernedEvolutionMissionResumeReason

  executionApplied: false
  sandboxExecutionApplied: false
  productionMutationApplied: false
  selfPromotionApplied: false

  humanAuthorizationRequired: true
}

function assessResumeReason(
  state: GovernedEvolutionMissionState,
): {
  resumeEligible: boolean
  reason: GovernedEvolutionMissionResumeReason
} {
  if (state.status === 'waiting_authorization') {
    return {
      resumeEligible: false,
      reason: 'waiting-human-authorization',
    }
  }

  if (state.status === 'paused') {
    return {
      resumeEligible: false,
      reason: 'mission-paused',
    }
  }

  if (state.status === 'completed') {
    return {
      resumeEligible: false,
      reason: 'mission-completed',
    }
  }

  if (state.status === 'failed') {
    return {
      resumeEligible: false,
      reason: 'mission-failed',
    }
  }

  if (
    state.researchIteration >=
    state.maximumResearchIterations
  ) {
    return {
      resumeEligible: false,
      reason: 'research-iterations-exhausted',
    }
  }

  return {
    resumeEligible: true,
    reason: 'active-mission-resumable',
  }
}

export function assessGovernedEvolutionMissionResume(
  repositoryDir: string,
  missionId: string,
): GovernedEvolutionMissionResumeAssessment {
  const state =
    loadGovernedEvolutionMissionState(
      repositoryDir,
      missionId,
    )

  if (!state) {
    throw new Error(
      'Governed evolution mission resume requires a persisted mission state.',
    )
  }

  if (
    state.selfPromotionAllowed !== false ||
    state.productionMutationAllowed !== false ||
    state.humanAuthorizationRequired !== true
  ) {
    throw new Error(
      'Governed evolution mission resume requires zero inherited promotion and production mutation authority.',
    )
  }

  const assessment =
    assessResumeReason(state)

  return {
    schemaVersion: 1,
    kind:
      'iasevero-governed-evolution-mission-resume-assessment',

    missionId: state.missionId,
    objectiveId: state.objectiveId,

    missionStateVerified: true,
    checkpointVerified: true,
    resumeAssessmentCompleted: true,

    checkpointSequence:
      state.checkpointSequence,
    currentTaskId:
      state.currentTaskId,
    researchIteration:
      state.researchIteration,
    maximumResearchIterations:
      state.maximumResearchIterations,

    resumeEligible:
      assessment.resumeEligible,
    reason:
      assessment.reason,

    executionApplied: false,
    sandboxExecutionApplied: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,

    humanAuthorizationRequired: true,
  }
}
