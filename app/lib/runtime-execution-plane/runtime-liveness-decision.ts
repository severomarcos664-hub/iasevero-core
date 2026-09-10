import type {
  GovernedRuntimeLivenessAssessment,
} from './runtime-liveness-assessment'

export type GovernedRuntimeLivenessDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-liveness-decision'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  livenessAssessmentVerified: true
  livenessDecisionMade: true

  readinessGranted: true
  livenessGranted: boolean

  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function decideGovernedRuntimeLiveness(
  assessment: GovernedRuntimeLivenessAssessment,
): GovernedRuntimeLivenessDecision {
  if (
    assessment.livenessEvidenceVerified !== true ||
    assessment.assessmentCompleted !== true ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime liveness decision requires verified liveness assessment.',
    )
  }

  if (
    assessment.readinessGranted !== true ||
    assessment.livenessGranted !== false ||
    assessment.restartAuthorized !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime liveness decision requires bounded inherited readiness only.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-liveness-decision',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    authorizationRecordId: assessment.authorizationRecordId,
    processId: assessment.processId,

    livenessAssessmentVerified: true,
    livenessDecisionMade: true,

    readinessGranted: true,
    livenessGranted: assessment.livenessCriteriaSatisfied === true,

    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
