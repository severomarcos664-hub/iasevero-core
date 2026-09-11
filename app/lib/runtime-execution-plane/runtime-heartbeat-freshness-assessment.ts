import type {
  GovernedRuntimeHeartbeatObservation,
} from './runtime-heartbeat-observation'

export type GovernedRuntimeHeartbeatFreshness =
  | 'fresh'
  | 'stale'

export type GovernedRuntimeHeartbeatFreshnessAssessmentInput = {
  observation: GovernedRuntimeHeartbeatObservation
  freshnessThresholdMs: number
}

export type GovernedRuntimeHeartbeatFreshnessAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-heartbeat-freshness-assessment'

  instanceId: string
  releaseIdentity: string
  processId: number

  heartbeatObservationVerified: true
  processIdentityVerified: true
  heartbeatFreshnessAssessed: true

  heartbeatAgeMs: number
  freshnessThresholdMs: number
  heartbeatFreshness: GovernedRuntimeHeartbeatFreshness

  healthDecisionMade: false
  failureDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeHeartbeatFreshness(
  input: GovernedRuntimeHeartbeatFreshnessAssessmentInput,
): GovernedRuntimeHeartbeatFreshnessAssessment {
  const { observation, freshnessThresholdMs } = input

  if (
    observation.recoveryCompletionVerified !== true ||
    observation.processIdentityVerified !== true ||
    observation.heartbeatObservationRecorded !== true ||
    observation.heartbeatFreshnessAssessed !== false ||
    !Number.isSafeInteger(observation.processId) ||
    observation.processId <= 0
  ) {
    throw new Error(
      'Governed runtime heartbeat freshness assessment requires verified heartbeat observation.',
    )
  }

  if (
    !Number.isSafeInteger(freshnessThresholdMs) ||
    freshnessThresholdMs <= 0
  ) {
    throw new Error(
      'Governed runtime heartbeat freshness assessment requires a positive integer freshness threshold.',
    )
  }

  const heartbeatTime = Date.parse(observation.heartbeatAt)
  const observationTime = Date.parse(observation.observedAt)

  if (
    !Number.isFinite(heartbeatTime) ||
    !Number.isFinite(observationTime) ||
    heartbeatTime > observationTime
  ) {
    throw new Error(
      'Governed runtime heartbeat freshness assessment requires valid ordered timestamps.',
    )
  }

  if (
    observation.healthDecisionMade !== false ||
    observation.failureDecisionMade !== false ||
    observation.restartAuthorized !== false ||
    observation.restartApplied !== false ||
    observation.deploymentApplied !== false ||
    observation.runtimeAuthorityGranted !== false ||
    observation.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime heartbeat freshness assessment requires zero inherited decision and execution authority.',
    )
  }

  const heartbeatAgeMs = observationTime - heartbeatTime

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-heartbeat-freshness-assessment',

    instanceId: observation.instanceId,
    releaseIdentity: observation.releaseIdentity,
    processId: observation.processId,

    heartbeatObservationVerified: true,
    processIdentityVerified: true,
    heartbeatFreshnessAssessed: true,

    heartbeatAgeMs,
    freshnessThresholdMs,
    heartbeatFreshness:
      heartbeatAgeMs <= freshnessThresholdMs
        ? 'fresh'
        : 'stale',

    healthDecisionMade: false,
    failureDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
