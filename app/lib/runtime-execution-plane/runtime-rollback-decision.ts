import type {
  GovernedRuntimeRollbackConditionAssessment,
} from './runtime-rollback-condition-assessment'

export type GovernedRuntimeRollbackDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-decision'

  instanceId: string
  releaseIdentity: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackConditionAssessmentVerified: true
  rollbackDecisionMade: true

  rollbackRequired: boolean
  rollbackApproved: boolean

  rollbackAuthorized: false
  rollbackApplied: false

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function decideGovernedRuntimeRollback(
  assessment: GovernedRuntimeRollbackConditionAssessment,
): GovernedRuntimeRollbackDecision {
  if (
    assessment.rollbackConditionEvidenceVerified !== true ||
    assessment.rollbackConditionAssessed !== true ||
    assessment.rollbackDecisionMade !== false ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime rollback decision requires verified rollback condition assessment.',
    )
  }

  if (
    assessment.rollbackAuthorized !== false ||
    assessment.rollbackApplied !== false ||
    assessment.trafficSwitchAuthorized !== false ||
    assessment.trafficSwitchApplied !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback decision requires zero inherited rollback and execution authority.',
    )
  }

  const expectedConditionSatisfied =
    assessment.failureDetected === true &&
    assessment.recoveryRequired === true

  if (
    assessment.rollbackConditionSatisfied !==
    expectedConditionSatisfied
  ) {
    throw new Error(
      'Governed runtime rollback decision requires internally consistent rollback condition assessment.',
    )
  }

  const rollbackRequired =
    assessment.rollbackConditionSatisfied === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-decision',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    processId: assessment.processId,

    rollbackFromReleaseIdentity:
      assessment.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      assessment.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      assessment.rollbackTargetContentAddress,

    rollbackConditionAssessmentVerified: true,
    rollbackDecisionMade: true,

    rollbackRequired,
    rollbackApproved: rollbackRequired,

    rollbackAuthorized: false,
    rollbackApplied: false,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
