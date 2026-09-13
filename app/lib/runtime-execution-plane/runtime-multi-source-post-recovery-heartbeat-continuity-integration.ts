import {
  recordGovernedRuntimeHeartbeatObservation,
} from './runtime-heartbeat-observation'

import type {
  GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult,
} from './runtime-multi-source-recovery-completion-integration'

type GovernedRuntimeHeartbeatObservationInput =
  Parameters<typeof recordGovernedRuntimeHeartbeatObservation>[0]

type GovernedRuntimeCanonicalHeartbeatObservation =
  ReturnType<typeof recordGovernedRuntimeHeartbeatObservation>

type GovernedRuntimePostRecoveryHeartbeatInput =
  Omit<
    GovernedRuntimeHeartbeatObservationInput,
    'recoveryCompletion'
  >

export type GovernedRuntimeMultiSourcePostRecoveryHeartbeatContinuityInput = {
  recoveryCompletion:
    GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult

  heartbeat:
    GovernedRuntimePostRecoveryHeartbeatInput
}

export type GovernedRuntimeMultiSourcePostRecoveryHeartbeatContinuityResult =
  GovernedRuntimeCanonicalHeartbeatObservation & {
    multiSourceRecoveryCompletionVerified: true
    heartbeatContinuityRestored: true

    sourceLivenessAuthorizationRecordId: string
  }

export function recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat(
  input: GovernedRuntimeMultiSourcePostRecoveryHeartbeatContinuityInput,
): GovernedRuntimeMultiSourcePostRecoveryHeartbeatContinuityResult {
  const {
    recoveryCompletion,
    heartbeat,
  } = input

  if (
    recoveryCompletion.multiSourceRecoveryChainVerified !== true ||
    recoveryCompletion.multiSourceRestartExecutionVerified !== true ||
    recoveryCompletion.multiSourceIdentityRebindingVerified !== true ||
    recoveryCompletion.multiSourceLivenessRevalidationVerified !== true ||
    recoveryCompletion.restartExecutionVerified !== true ||
    recoveryCompletion.processIdentityRebindingVerified !== true ||
    recoveryCompletion.readinessRestored !== true ||
    recoveryCompletion.livenessRestored !== true ||
    recoveryCompletion.recoveryCompleted !== true ||
    recoveryCompletion.operationalHealthRestored !== true
  ) {
    throw new Error(
      'Governed multi-source post-recovery heartbeat continuity requires verified recovery completion.',
    )
  }

  if (
    heartbeat.observedProcessId !== recoveryCompletion.processId
  ) {
    throw new Error(
      'Governed multi-source post-recovery heartbeat continuity requires recovered process identity.',
    )
  }

  if (
    recoveryCompletion.deploymentApplied !== false ||
    recoveryCompletion.runtimeAuthorityGranted !== false ||
    recoveryCompletion.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-recovery heartbeat continuity requires zero inherited operational authority.',
    )
  }

  const observation =
    recordGovernedRuntimeHeartbeatObservation({
      recoveryCompletion,
      ...heartbeat,
    })

  if (
    observation.recoveryCompletionVerified !== true ||
    observation.processIdentityVerified !== true ||
    observation.heartbeatObservationRecorded !== true
  ) {
    throw new Error(
      'Governed multi-source post-recovery heartbeat continuity requires verified canonical heartbeat observation.',
    )
  }

  if (
    observation.processId !== recoveryCompletion.processId ||
    observation.heartbeatFreshnessAssessed !== false ||
    observation.healthDecisionMade !== false ||
    observation.failureDecisionMade !== false ||
    observation.restartAuthorized !== false ||
    observation.runtimeAuthorityGranted !== false ||
    observation.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-recovery heartbeat continuity must remain observation-only.',
    )
  }

  return {
    ...observation,

    multiSourceRecoveryCompletionVerified: true,
    heartbeatContinuityRestored: true,

    sourceLivenessAuthorizationRecordId:
      recoveryCompletion.sourceLivenessAuthorizationRecordId,
  }
}
