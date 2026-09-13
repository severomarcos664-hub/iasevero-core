import type {
  GovernedRuntimeRollbackAssessment,
} from './runtime-rollback-assessment'

import type {
  GovernedRuntimeMultiSourceFailureAssessment,
} from './runtime-multi-source-failure-assessment'

export type GovernedRuntimeRollbackConditionEvidence = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-condition-evidence'

  instanceId: string
  releaseIdentity: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackAssessmentVerified: true
  failureAssessmentVerified: true
  rollbackTargetVerified: true
  sourceReleaseContinuityVerified: true

  rollbackConditionEvidenceRecorded: true

  failureDetected: boolean
  failureClassification:
    GovernedRuntimeMultiSourceFailureAssessment['failureClassification']
  recoveryRequired: boolean

  rollbackConditionSignalObserved: boolean

  rollbackConditionAssessed: false
  rollbackDecisionMade: false
  rollbackAuthorized: false
  rollbackApplied: false

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function recordGovernedRuntimeRollbackConditionEvidence(
  rollbackAssessment: GovernedRuntimeRollbackAssessment,
  failureAssessment: GovernedRuntimeMultiSourceFailureAssessment,
): GovernedRuntimeRollbackConditionEvidence {
  if (
    rollbackAssessment.blueGreenStateVerified !== true ||
    rollbackAssessment.rollbackAssessmentCompleted !== true ||
    rollbackAssessment.rollbackTargetIdentified !== true ||
    rollbackAssessment.rollbackConditionAssessed !== false ||
    rollbackAssessment.rollbackDecisionMade !== false
  ) {
    throw new Error(
      'Governed runtime rollback condition evidence requires verified rollback assessment.',
    )
  }

  if (
    failureAssessment.failureAssessmentCompleted !== true ||
    !Number.isSafeInteger(failureAssessment.processId) ||
    failureAssessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime rollback condition evidence requires verified multi-source failure assessment.',
    )
  }

  if (
    rollbackAssessment.rollbackFromReleaseIdentity !==
    failureAssessment.releaseIdentity
  ) {
    throw new Error(
      'Governed runtime rollback condition evidence requires continuous source release identity.',
    )
  }

  if (
    rollbackAssessment.rollbackAuthorized !== false ||
    rollbackAssessment.rollbackApplied !== false ||
    rollbackAssessment.trafficSwitchAuthorized !== false ||
    rollbackAssessment.trafficSwitchApplied !== false ||
    rollbackAssessment.deploymentApplied !== false ||
    rollbackAssessment.runtimeAuthorityGranted !== false ||
    rollbackAssessment.networkAuthorityGranted !== false ||
    failureAssessment.recoveryDecisionMade !== false ||
    failureAssessment.restartAuthorized !== false ||
    failureAssessment.restartApplied !== false ||
    failureAssessment.deploymentApplied !== false ||
    failureAssessment.runtimeAuthorityGranted !== false ||
    failureAssessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback condition evidence requires zero inherited decision and execution authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-condition-evidence',

    instanceId: failureAssessment.instanceId,
    releaseIdentity: failureAssessment.releaseIdentity,
    processId: failureAssessment.processId,

    rollbackFromReleaseIdentity:
      rollbackAssessment.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      rollbackAssessment.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      rollbackAssessment.rollbackTargetContentAddress,

    rollbackAssessmentVerified: true,
    failureAssessmentVerified: true,
    rollbackTargetVerified: true,
    sourceReleaseContinuityVerified: true,

    rollbackConditionEvidenceRecorded: true,

    failureDetected:
      failureAssessment.failureDetected,

    failureClassification:
      failureAssessment.failureClassification,

    recoveryRequired:
      failureAssessment.recoveryRequired,

    rollbackConditionSignalObserved:
      failureAssessment.failureDetected,

    rollbackConditionAssessed: false,
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
