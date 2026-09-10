import type {
  GovernedRuntimeReadinessAssessment,
} from './runtime-readiness-assessment'

export type GovernedRuntimeReadinessDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-readiness-decision'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  readinessAssessmentVerified: true
  readinessDecisionMade: true
  readinessGranted: boolean

  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function decideGovernedRuntimeReadiness(
  assessment: GovernedRuntimeReadinessAssessment,
): GovernedRuntimeReadinessDecision {
  if (
    assessment.readinessEvidenceVerified !== true ||
    assessment.assessmentCompleted !== true ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime readiness decision requires verified readiness assessment.',
    )
  }

  if (
    assessment.readinessGranted !== false ||
    assessment.livenessGranted !== false ||
    assessment.restartAuthorized !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime readiness decision requires zero inherited runtime authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-readiness-decision',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    authorizationRecordId: assessment.authorizationRecordId,
    processId: assessment.processId,

    readinessAssessmentVerified: true,
    readinessDecisionMade: true,
    readinessGranted: assessment.readinessCriteriaSatisfied === true,

    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
