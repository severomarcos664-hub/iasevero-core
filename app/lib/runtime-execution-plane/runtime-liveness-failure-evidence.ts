import type {
  GovernedRuntimeLivenessDecision,
} from './runtime-liveness-decision'

export type GovernedRuntimeLivenessFailureEvidence = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-liveness-failure-evidence'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  evidenceSource: 'liveness-decision'

  livenessDecisionVerified: true
  failureEvidenceRecorded: true

  livenessFailed: boolean
  failureSignalObserved: boolean

  failureDecisionMade: false
  recoveryDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function recordGovernedRuntimeLivenessFailureEvidence(
  decision: GovernedRuntimeLivenessDecision,
): GovernedRuntimeLivenessFailureEvidence {
  if (
    decision.livenessAssessmentVerified !== true ||
    decision.livenessDecisionMade !== true ||
    decision.readinessGranted !== true ||
    !Number.isSafeInteger(decision.processId) ||
    decision.processId <= 0
  ) {
    throw new Error(
      'Governed runtime liveness failure evidence requires verified liveness decision.',
    )
  }

  if (
    decision.restartAuthorized !== false ||
    decision.deploymentApplied !== false ||
    decision.runtimeAuthorityGranted !== false ||
    decision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime liveness failure evidence requires zero inherited execution authority.',
    )
  }

  const livenessFailed =
    decision.livenessGranted === false

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-liveness-failure-evidence',

    instanceId: decision.instanceId,
    releaseIdentity: decision.releaseIdentity,
    authorizationRecordId: decision.authorizationRecordId,
    processId: decision.processId,

    evidenceSource: 'liveness-decision',

    livenessDecisionVerified: true,
    failureEvidenceRecorded: true,

    livenessFailed,
    failureSignalObserved: livenessFailed,

    failureDecisionMade: false,
    recoveryDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
