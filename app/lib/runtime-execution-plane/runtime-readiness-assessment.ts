import type {
  GovernedRuntimeReadinessEvidence,
} from './runtime-readiness-evidence'

export type GovernedRuntimeReadinessAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-readiness-assessment'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  readinessEvidenceVerified: true
  assessmentCompleted: true
  readinessCriteriaSatisfied: boolean

  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeReadiness(
  evidence: GovernedRuntimeReadinessEvidence,
): GovernedRuntimeReadinessAssessment {
  if (
    evidence.processIdentityVerified !== true ||
    evidence.endpointSpecificationVerified !== true ||
    evidence.probeEvidenceRecorded !== true ||
    !Number.isSafeInteger(evidence.processId) ||
    evidence.processId <= 0
  ) {
    throw new Error(
      'Governed runtime readiness assessment requires verified readiness evidence.',
    )
  }

  if (
    evidence.readinessGranted !== false ||
    evidence.livenessGranted !== false ||
    evidence.restartAuthorized !== false ||
    evidence.deploymentApplied !== false ||
    evidence.runtimeAuthorityGranted !== false ||
    evidence.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime readiness assessment requires zero inherited runtime authority.',
    )
  }

  const readinessCriteriaSatisfied =
    evidence.transportReachable === true &&
    evidence.applicationResponsive === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-readiness-assessment',

    instanceId: evidence.instanceId,
    releaseIdentity: evidence.releaseIdentity,
    authorizationRecordId: evidence.authorizationRecordId,
    processId: evidence.processId,

    readinessEvidenceVerified: true,
    assessmentCompleted: true,
    readinessCriteriaSatisfied,

    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
