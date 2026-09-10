import type {
  GovernedRuntimeFailureAssessment,
} from './runtime-failure-assessment'

export type GovernedRuntimeRecoveryDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-recovery-decision'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  failureAssessmentVerified: true
  recoveryDecisionMade: true

  recoveryRequired: boolean
  recoveryApproved: boolean

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function decideGovernedRuntimeRecovery(
  assessment: GovernedRuntimeFailureAssessment,
): GovernedRuntimeRecoveryDecision {
  if (
    assessment.livenessDecisionVerified !== true ||
    assessment.failureAssessmentCompleted !== true ||
    assessment.failureClassified !== true ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime recovery decision requires verified failure assessment.',
    )
  }

  if (
    assessment.restartAuthorized !== false ||
    assessment.restartApplied !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime recovery decision requires zero inherited restart authority.',
    )
  }

  const recoveryRequired = assessment.recoveryRequired === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-recovery-decision',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    authorizationRecordId: assessment.authorizationRecordId,
    processId: assessment.processId,

    failureAssessmentVerified: true,
    recoveryDecisionMade: true,

    recoveryRequired,
    recoveryApproved: recoveryRequired,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
