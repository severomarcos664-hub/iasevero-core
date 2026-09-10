import type {
  GovernedRuntimeLivenessDecision,
} from './runtime-liveness-decision'

export type GovernedRuntimeFailureClassification =
  | 'none'
  | 'liveness-failure'

export type GovernedRuntimeFailureAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-failure-assessment'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  livenessDecisionVerified: true
  failureAssessmentCompleted: true

  failureDetected: boolean
  failureClassified: true
  failureClassification: GovernedRuntimeFailureClassification
  recoveryRequired: boolean

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeFailure(
  decision: GovernedRuntimeLivenessDecision,
): GovernedRuntimeFailureAssessment {
  if (
    decision.livenessAssessmentVerified !== true ||
    decision.livenessDecisionMade !== true ||
    decision.readinessGranted !== true ||
    !Number.isSafeInteger(decision.processId) ||
    decision.processId <= 0
  ) {
    throw new Error(
      'Governed runtime failure assessment requires verified liveness decision.',
    )
  }

  if (
    decision.restartAuthorized !== false ||
    decision.deploymentApplied !== false ||
    decision.runtimeAuthorityGranted !== false ||
    decision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime failure assessment requires zero inherited recovery authority.',
    )
  }

  const failureDetected = decision.livenessGranted === false

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-failure-assessment',

    instanceId: decision.instanceId,
    releaseIdentity: decision.releaseIdentity,
    authorizationRecordId: decision.authorizationRecordId,
    processId: decision.processId,

    livenessDecisionVerified: true,
    failureAssessmentCompleted: true,

    failureDetected,
    failureClassified: true,
    failureClassification: failureDetected
      ? 'liveness-failure'
      : 'none',
    recoveryRequired: failureDetected,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
