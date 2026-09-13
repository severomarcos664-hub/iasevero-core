import type {
  GovernedRuntimeBlueGreenDeploymentState,
} from './runtime-blue-green-deployment-state'

import type {
  GovernedRuntimeTrafficSwitchExecutionBoundaryResult,
} from './runtime-traffic-switch-execution-boundary'

export type GovernedRuntimePostTrafficSwitchBlueGreenStateInput = {
  previousState: GovernedRuntimeBlueGreenDeploymentState
  trafficSwitchExecution: GovernedRuntimeTrafficSwitchExecutionBoundaryResult
}

export type GovernedRuntimePostTrafficSwitchBlueGreenState = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-post-traffic-switch-blue-green-state'

  instanceId: string
  releaseIdentity: string
  processId: number

  previousActiveSlot: 'blue' | 'green'
  previousStandbySlot: 'blue' | 'green'

  activeSlot: 'blue' | 'green'
  standbySlot: 'blue' | 'green'

  activeReleaseIdentity: string
  standbyReleaseIdentity: string

  activeContentAddress: string
  standbyContentAddress: string

  trafficSwitchExecutionVerified: true
  previousBlueGreenStateVerified: true
  postTrafficSwitchStateReconciled: true

  trafficSwitchAuthorized: true
  trafficSwitchApplied: true

  rollbackAuthorized: false
  rollbackApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function reconcileGovernedRuntimePostTrafficSwitchBlueGreenState(
  input: GovernedRuntimePostTrafficSwitchBlueGreenStateInput,
): GovernedRuntimePostTrafficSwitchBlueGreenState {
  const {
    previousState,
    trafficSwitchExecution,
  } = input

  if (
    previousState.releaseIdentitiesVerified !== true ||
    previousState.releasesDistinct !== true ||
    previousState.blueGreenStateEstablished !== true ||
    previousState.trafficSwitchAuthorized !== false ||
    previousState.trafficSwitchApplied !== false ||
    previousState.rollbackAuthorized !== false ||
    previousState.rollbackApplied !== false ||
    previousState.deploymentApplied !== false ||
    previousState.runtimeAuthorityGranted !== false ||
    previousState.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime post traffic switch blue/green state requires verified pre-switch blue/green state.',
    )
  }

  if (
    trafficSwitchExecution.trafficSwitchAuthorizationVerified !== true ||
    trafficSwitchExecution.trafficSwitchExecutionVerified !== true ||
    trafficSwitchExecution.trafficSwitchApplied !== true ||
    trafficSwitchExecution.deploymentApplied !== false ||
    trafficSwitchExecution.runtimeAuthorityGranted !== false ||
    trafficSwitchExecution.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime post traffic switch blue/green state requires verified traffic switch execution.',
    )
  }

  if (
    trafficSwitchExecution.previousActiveSlot !==
      previousState.activeSlot ||
    trafficSwitchExecution.previousStandbySlot !==
      previousState.standbySlot ||
    trafficSwitchExecution.newActiveSlot !==
      previousState.standbySlot ||
    trafficSwitchExecution.newStandbySlot !==
      previousState.activeSlot ||
    trafficSwitchExecution.trafficSwitchFromReleaseIdentity !==
      previousState.activeReleaseIdentity ||
    trafficSwitchExecution.trafficSwitchTargetReleaseIdentity !==
      previousState.standbyReleaseIdentity ||
    trafficSwitchExecution.trafficSwitchTargetContentAddress !==
      previousState.standbyContentAddress
  ) {
    throw new Error(
      'Governed runtime post traffic switch blue/green state requires continuous canonical switch provenance.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-post-traffic-switch-blue-green-state',

    instanceId: trafficSwitchExecution.instanceId,
    releaseIdentity: trafficSwitchExecution.releaseIdentity,
    processId: trafficSwitchExecution.processId,

    previousActiveSlot:
      previousState.activeSlot,

    previousStandbySlot:
      previousState.standbySlot,

    activeSlot:
      trafficSwitchExecution.newActiveSlot,

    standbySlot:
      trafficSwitchExecution.newStandbySlot,

    activeReleaseIdentity:
      previousState.standbyReleaseIdentity,

    standbyReleaseIdentity:
      previousState.activeReleaseIdentity,

    activeContentAddress:
      previousState.standbyContentAddress,

    standbyContentAddress:
      previousState.activeContentAddress,

    trafficSwitchExecutionVerified: true,
    previousBlueGreenStateVerified: true,
    postTrafficSwitchStateReconciled: true,

    trafficSwitchAuthorized: true,
    trafficSwitchApplied: true,

    rollbackAuthorized: false,
    rollbackApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
