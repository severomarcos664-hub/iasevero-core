import type {
  GovernedRuntimeRollbackConditionEvidence,
} from './runtime-rollback-condition-evidence'

export type GovernedRuntimeRollbackConditionAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-condition-assessment'

  instanceId: string
  releaseIdentity: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackConditionEvidenceVerified: true
  rollbackConditionAssessed: true

  failureDetected: boolean
  recoveryRequired: boolean

  rollbackConditionSatisfied: boolean

  rollbackDecisionMade: false
  rollbackAuthorized: false
  rollbackApplied: false

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeRollbackCondition(
  evidence: GovernedRuntimeRollbackConditionEvidence,
): GovernedRuntimeRollbackConditionAssessment {
  if (
    evidence.rollbackAssessmentVerified !== true ||
    evidence.failureAssessmentVerified !== true ||
    evidence.rollbackTargetVerified !== true ||
    evidence.sourceReleaseContinuityVerified !== true ||
    evidence.rollbackConditionEvidenceRecorded !== true ||
    evidence.rollbackConditionAssessed !== false ||
    evidence.rollbackDecisionMade !== false ||
    !Number.isSafeInteger(evidence.processId) ||
    evidence.processId <= 0
  ) {
    throw new Error(
      'Governed runtime rollback condition assessment requires verified rollback condition evidence.',
    )
  }

  if (
    evidence.rollbackAuthorized !== false ||
    evidence.rollbackApplied !== false ||
    evidence.trafficSwitchAuthorized !== false ||
    evidence.trafficSwitchApplied !== false ||
    evidence.deploymentApplied !== false ||
    evidence.runtimeAuthorityGranted !== false ||
    evidence.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback condition assessment requires zero inherited execution authority.',
    )
  }

  const rollbackConditionSatisfied =
    evidence.rollbackConditionSignalObserved === true &&
    evidence.failureDetected === true &&
    evidence.recoveryRequired === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-condition-assessment',

    instanceId: evidence.instanceId,
    releaseIdentity: evidence.releaseIdentity,
    processId: evidence.processId,

    rollbackFromReleaseIdentity:
      evidence.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      evidence.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      evidence.rollbackTargetContentAddress,

    rollbackConditionEvidenceVerified: true,
    rollbackConditionAssessed: true,

    failureDetected:
      evidence.failureDetected,

    recoveryRequired:
      evidence.recoveryRequired,

    rollbackConditionSatisfied,

    rollbackDecisionMade: false,
    rollbackAuthorized: false,
    rollbackApplied: false,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
