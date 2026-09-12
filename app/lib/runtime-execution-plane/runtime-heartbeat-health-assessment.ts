import type {
  GovernedRuntimeHeartbeatFreshnessAssessment,
} from './runtime-heartbeat-freshness-assessment'

export type GovernedRuntimeHeartbeatHealth =
  | 'healthy'
  | 'degraded'

export type GovernedRuntimeHeartbeatHealthAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-heartbeat-health-assessment'

  instanceId: string
  releaseIdentity: string
  processId: number

  heartbeatFreshnessVerified: true
  healthAssessmentCompleted: true

  heartbeatHealth: GovernedRuntimeHeartbeatHealth

  failureDecisionMade: false
  recoveryDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeHeartbeatHealth(
  freshness: GovernedRuntimeHeartbeatFreshnessAssessment,
): GovernedRuntimeHeartbeatHealthAssessment {
  if (
    freshness.heartbeatObservationVerified !== true ||
    freshness.processIdentityVerified !== true ||
    freshness.heartbeatFreshnessAssessed !== true ||
    !Number.isSafeInteger(freshness.processId) ||
    freshness.processId <= 0
  ) {
    throw new Error(
      'Governed runtime heartbeat health assessment requires verified freshness assessment.',
    )
  }

  if (
    freshness.healthDecisionMade !== false ||
    freshness.failureDecisionMade !== false ||
    freshness.restartAuthorized !== false ||
    freshness.restartApplied !== false ||
    freshness.deploymentApplied !== false ||
    freshness.runtimeAuthorityGranted !== false ||
    freshness.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime heartbeat health assessment requires zero inherited decision and execution authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-heartbeat-health-assessment',

    instanceId: freshness.instanceId,
    releaseIdentity: freshness.releaseIdentity,
    processId: freshness.processId,

    heartbeatFreshnessVerified: true,
    healthAssessmentCompleted: true,

    heartbeatHealth:
      freshness.heartbeatFreshness === 'fresh'
        ? 'healthy'
        : 'degraded',

    failureDecisionMade: false,
    recoveryDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
