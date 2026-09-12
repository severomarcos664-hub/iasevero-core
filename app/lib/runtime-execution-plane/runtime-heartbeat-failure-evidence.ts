import type {
  GovernedRuntimeHeartbeatHealthAssessment,
} from './runtime-heartbeat-health-assessment'

export type GovernedRuntimeHeartbeatFailureEvidence = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-heartbeat-failure-evidence'

  instanceId: string
  releaseIdentity: string
  processId: number

  evidenceSource: 'heartbeat-health-assessment'

  heartbeatHealthAssessmentVerified: true
  failureEvidenceRecorded: true

  heartbeatDegraded: boolean
  failureSignalObserved: boolean

  failureDecisionMade: false
  recoveryDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function recordGovernedRuntimeHeartbeatFailureEvidence(
  assessment: GovernedRuntimeHeartbeatHealthAssessment,
): GovernedRuntimeHeartbeatFailureEvidence {
  if (
    assessment.heartbeatFreshnessVerified !== true ||
    assessment.healthAssessmentCompleted !== true ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed runtime heartbeat failure evidence requires verified heartbeat health assessment.',
    )
  }

  if (
    assessment.failureDecisionMade !== false ||
    assessment.recoveryDecisionMade !== false ||
    assessment.restartAuthorized !== false ||
    assessment.restartApplied !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime heartbeat failure evidence requires zero inherited decision and execution authority.',
    )
  }

  const heartbeatDegraded =
    assessment.heartbeatHealth === 'degraded'

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-heartbeat-failure-evidence',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    processId: assessment.processId,

    evidenceSource: 'heartbeat-health-assessment',

    heartbeatHealthAssessmentVerified: true,
    failureEvidenceRecorded: true,

    heartbeatDegraded,
    failureSignalObserved: heartbeatDegraded,

    failureDecisionMade: false,
    recoveryDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
