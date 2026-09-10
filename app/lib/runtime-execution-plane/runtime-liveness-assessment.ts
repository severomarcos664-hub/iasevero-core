import type {
  GovernedRuntimeLivenessEvidence,
} from './runtime-liveness-evidence'

export type GovernedRuntimeLivenessAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-liveness-assessment'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  livenessEvidenceVerified: true
  assessmentCompleted: true
  livenessCriteriaSatisfied: boolean

  readinessGranted: true
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeLiveness(
  evidence: GovernedRuntimeLivenessEvidence,
): GovernedRuntimeLivenessAssessment {
  if (
    evidence.readinessDecisionVerified !== true ||
    evidence.processIdentityVerified !== true ||
    evidence.livenessEvidenceRecorded !== true ||
    !Number.isSafeInteger(evidence.observationSequence) ||
    evidence.observationSequence <= 0 ||
    !Number.isSafeInteger(evidence.processId) ||
    evidence.processId <= 0
  ) {
    throw new Error(
      'Governed runtime liveness assessment requires verified liveness evidence.',
    )
  }

  if (
    evidence.readinessGranted !== true ||
    evidence.livenessGranted !== false ||
    evidence.restartAuthorized !== false ||
    evidence.deploymentApplied !== false ||
    evidence.runtimeAuthorityGranted !== false ||
    evidence.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime liveness assessment requires bounded inherited readiness only.',
    )
  }

  const livenessCriteriaSatisfied =
    evidence.processResponsive === true &&
    evidence.eventLoopResponsive === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-liveness-assessment',

    instanceId: evidence.instanceId,
    releaseIdentity: evidence.releaseIdentity,
    authorizationRecordId: evidence.authorizationRecordId,
    processId: evidence.processId,

    livenessEvidenceVerified: true,
    assessmentCompleted: true,
    livenessCriteriaSatisfied,

    readinessGranted: true,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
