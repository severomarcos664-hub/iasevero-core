import type {
  GovernedRuntimeBlueGreenDeploymentState,
} from './runtime-blue-green-deployment-state'

import type {
  GovernedRuntimeRollbackExecutionBoundaryResult,
} from './runtime-rollback-execution-boundary'

export type GovernedRuntimeTrafficSwitchAuthorizationInput = {
  blueGreenState: GovernedRuntimeBlueGreenDeploymentState
  rollbackExecution: GovernedRuntimeRollbackExecutionBoundaryResult
  trafficSwitchAuthorizationRecordId: string
  trafficSwitchAuthorizationGranted: boolean
}

export type GovernedRuntimeTrafficSwitchAuthorization = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-traffic-switch-authorization'

  instanceId: string
  releaseIdentity: string
  processId: number

  activeSlot: 'blue' | 'green'
  standbySlot: 'blue' | 'green'

  trafficSwitchFromReleaseIdentity: string
  trafficSwitchTargetReleaseIdentity: string
  trafficSwitchTargetContentAddress: string

  rollbackExecutionVerified: true
  blueGreenStateVerified: true

  trafficSwitchAuthorizationRecordId: string
  trafficSwitchEligible: boolean
  trafficSwitchAuthorizationGranted: boolean
  trafficSwitchAuthorized: boolean

  trafficSwitchApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function authorizeGovernedRuntimeTrafficSwitch(
  input: GovernedRuntimeTrafficSwitchAuthorizationInput,
): GovernedRuntimeTrafficSwitchAuthorization {
  const {
    blueGreenState,
    rollbackExecution,
    trafficSwitchAuthorizationRecordId,
    trafficSwitchAuthorizationGranted,
  } = input

  if (
    rollbackExecution.rollbackAuthorizationVerified !== true ||
    rollbackExecution.rollbackExecutionVerified !== true ||
    rollbackExecution.rollbackApplied !== true ||
    !Number.isSafeInteger(rollbackExecution.processId) ||
    rollbackExecution.processId <= 0
  ) {
    throw new Error(
      'Governed runtime traffic switch authorization requires verified rollback execution.',
    )
  }

  if (
    blueGreenState.releaseIdentitiesVerified !== true ||
    blueGreenState.releasesDistinct !== true ||
    blueGreenState.blueGreenStateEstablished !== true ||
    blueGreenState.trafficSwitchAuthorized !== false ||
    blueGreenState.trafficSwitchApplied !== false ||
    blueGreenState.rollbackAuthorized !== false ||
    blueGreenState.rollbackApplied !== false ||
    blueGreenState.deploymentApplied !== false ||
    blueGreenState.runtimeAuthorityGranted !== false ||
    blueGreenState.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime traffic switch authorization requires verified authority-free blue/green state.',
    )
  }

  if (
    rollbackExecution.trafficSwitchAuthorized !== false ||
    rollbackExecution.trafficSwitchApplied !== false ||
    rollbackExecution.deploymentApplied !== false ||
    rollbackExecution.runtimeAuthorityGranted !== false ||
    rollbackExecution.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime traffic switch authorization requires zero inherited traffic switch and execution authority.',
    )
  }

  if (
    rollbackExecution.rollbackFromReleaseIdentity !==
      blueGreenState.activeReleaseIdentity ||
    rollbackExecution.rollbackTargetReleaseIdentity !==
      blueGreenState.standbyReleaseIdentity ||
    rollbackExecution.rollbackTargetContentAddress !==
      blueGreenState.standbyContentAddress
  ) {
    throw new Error(
      'Governed runtime traffic switch authorization requires canonical active-to-standby rollback continuity.',
    )
  }

  const normalizedAuthorizationRecordId =
    trafficSwitchAuthorizationRecordId.trim()

  if (normalizedAuthorizationRecordId.length === 0) {
    throw new Error(
      'Governed runtime traffic switch authorization requires traffic switch authorization record id.',
    )
  }

  const trafficSwitchEligible = true

  const trafficSwitchAuthorized =
    trafficSwitchEligible &&
    trafficSwitchAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-traffic-switch-authorization',

    instanceId: rollbackExecution.instanceId,
    releaseIdentity: rollbackExecution.releaseIdentity,
    processId: rollbackExecution.processId,

    activeSlot: blueGreenState.activeSlot,
    standbySlot: blueGreenState.standbySlot,

    trafficSwitchFromReleaseIdentity:
      blueGreenState.activeReleaseIdentity,

    trafficSwitchTargetReleaseIdentity:
      blueGreenState.standbyReleaseIdentity,

    trafficSwitchTargetContentAddress:
      blueGreenState.standbyContentAddress,

    rollbackExecutionVerified: true,
    blueGreenStateVerified: true,

    trafficSwitchAuthorizationRecordId:
      normalizedAuthorizationRecordId,

    trafficSwitchEligible,
    trafficSwitchAuthorizationGranted,
    trafficSwitchAuthorized,

    trafficSwitchApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
