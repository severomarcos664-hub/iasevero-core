import type {
  GovernedRuntimeRecoveryCompletion,
} from './runtime-recovery-completion'

export type GovernedRuntimeHeartbeatObservationInput = {
  recoveryCompletion: GovernedRuntimeRecoveryCompletion

  observedProcessId: number
  heartbeatAt: string
  observedAt: string
}

export type GovernedRuntimeHeartbeatObservation = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-heartbeat-observation'

  instanceId: string
  releaseIdentity: string
  processId: number

  recoveryCompletionVerified: true
  processIdentityVerified: true
  heartbeatObservationRecorded: true

  heartbeatAt: string
  observedAt: string

  heartbeatFreshnessAssessed: false
  healthDecisionMade: false
  failureDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function requireValidTimestamp(
  value: string,
  label: string,
): number {
  const timestamp = Date.parse(value)

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `Governed runtime heartbeat observation requires valid ${label}.`,
    )
  }

  return timestamp
}

export function recordGovernedRuntimeHeartbeatObservation(
  input: GovernedRuntimeHeartbeatObservationInput,
): GovernedRuntimeHeartbeatObservation {
  const { recoveryCompletion } = input

  if (
    recoveryCompletion.restartExecutionVerified !== true ||
    recoveryCompletion.processIdentityRebindingVerified !== true ||
    recoveryCompletion.readinessRestored !== true ||
    recoveryCompletion.livenessRestored !== true ||
    recoveryCompletion.recoveryCompleted !== true ||
    recoveryCompletion.operationalHealthRestored !== true ||
    !Number.isSafeInteger(recoveryCompletion.processId) ||
    recoveryCompletion.processId <= 0
  ) {
    throw new Error(
      'Governed runtime heartbeat observation requires verified recovery completion.',
    )
  }

  if (
    input.observedProcessId !== recoveryCompletion.processId
  ) {
    throw new Error(
      'Governed runtime heartbeat observation requires identity-bound process observation.',
    )
  }

  const heartbeatTime =
    requireValidTimestamp(input.heartbeatAt, 'heartbeat timestamp')

  const observationTime =
    requireValidTimestamp(input.observedAt, 'observation timestamp')

  if (heartbeatTime > observationTime) {
    throw new Error(
      'Governed runtime heartbeat observation rejects future heartbeat timestamps.',
    )
  }

  if (
    recoveryCompletion.deploymentApplied !== false ||
    recoveryCompletion.runtimeAuthorityGranted !== false ||
    recoveryCompletion.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime heartbeat observation requires zero inherited extended authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-heartbeat-observation',

    instanceId: recoveryCompletion.instanceId,
    releaseIdentity: recoveryCompletion.releaseIdentity,
    processId: recoveryCompletion.processId,

    recoveryCompletionVerified: true,
    processIdentityVerified: true,
    heartbeatObservationRecorded: true,

    heartbeatAt: input.heartbeatAt,
    observedAt: input.observedAt,

    heartbeatFreshnessAssessed: false,
    healthDecisionMade: false,
    failureDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
