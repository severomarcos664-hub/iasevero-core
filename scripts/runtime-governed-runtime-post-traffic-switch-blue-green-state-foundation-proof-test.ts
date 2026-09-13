import assert from 'node:assert/strict'

import type {
  GovernedRuntimeBlueGreenDeploymentState,
} from '../app/lib/runtime-execution-plane/runtime-blue-green-deployment-state'

import type {
  GovernedRuntimeTrafficSwitchExecutionBoundaryResult,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-execution-boundary'

import {
  reconcileGovernedRuntimePostTrafficSwitchBlueGreenState,
} from '../app/lib/runtime-execution-plane/runtime-post-traffic-switch-blue-green-state'

const previousState: GovernedRuntimeBlueGreenDeploymentState = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-blue-green-deployment-state',

  activeSlot: 'blue',
  standbySlot: 'green',

  activeReleaseIdentity:
    'v287.73.50-active-proof',

  standbyReleaseIdentity:
    'v287.73.49-standby-proof',

  activeContentAddress:
    `sha256:${'a'.repeat(64)}`,

  standbyContentAddress:
    `sha256:${'b'.repeat(64)}`,

  releaseIdentitiesVerified: true,
  releasesDistinct: true,
  slotsDistinct: true,
  blueGreenStateEstablished: true,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,

  rollbackAuthorized: false,
  rollbackApplied: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const trafficSwitchExecution:
  GovernedRuntimeTrafficSwitchExecutionBoundaryResult = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-traffic-switch-execution-boundary',

    instanceId: 'instance-v2877350-proof',
    releaseIdentity:
      previousState.activeReleaseIdentity,
    processId: 626262,

    previousActiveSlot:
      previousState.activeSlot,

    previousStandbySlot:
      previousState.standbySlot,

    newActiveSlot:
      previousState.standbySlot,

    newStandbySlot:
      previousState.activeSlot,

    trafficSwitchFromReleaseIdentity:
      previousState.activeReleaseIdentity,

    trafficSwitchTargetReleaseIdentity:
      previousState.standbyReleaseIdentity,

    trafficSwitchTargetContentAddress:
      previousState.standbyContentAddress,

    trafficSwitchAuthorizationRecordId:
      'traffic-switch-authorization-v2877350-proof',

    trafficSwitchAuthorizationVerified: true,
    trafficSwitchExecutionVerified: true,
    trafficSwitchApplied: true,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

const reconciled =
  reconcileGovernedRuntimePostTrafficSwitchBlueGreenState({
    previousState,
    trafficSwitchExecution,
  })

assert.equal(reconciled.previousActiveSlot, 'blue')
assert.equal(reconciled.previousStandbySlot, 'green')

assert.equal(reconciled.activeSlot, 'green')
assert.equal(reconciled.standbySlot, 'blue')

assert.equal(
  reconciled.activeReleaseIdentity,
  previousState.standbyReleaseIdentity,
)

assert.equal(
  reconciled.standbyReleaseIdentity,
  previousState.activeReleaseIdentity,
)

assert.equal(
  reconciled.activeContentAddress,
  previousState.standbyContentAddress,
)

assert.equal(
  reconciled.standbyContentAddress,
  previousState.activeContentAddress,
)

assert.equal(
  reconciled.trafficSwitchExecutionVerified,
  true,
)

assert.equal(
  reconciled.previousBlueGreenStateVerified,
  true,
)

assert.equal(
  reconciled.postTrafficSwitchStateReconciled,
  true,
)

assert.equal(reconciled.trafficSwitchAuthorized, true)
assert.equal(reconciled.trafficSwitchApplied, true)

assert.equal(reconciled.rollbackAuthorized, false)
assert.equal(reconciled.rollbackApplied, false)

assert.equal(reconciled.deploymentApplied, false)
assert.equal(reconciled.runtimeAuthorityGranted, false)
assert.equal(reconciled.networkAuthorityGranted, false)

assert.throws(
  () =>
    reconcileGovernedRuntimePostTrafficSwitchBlueGreenState({
      previousState,
      trafficSwitchExecution: {
        ...trafficSwitchExecution,
        newActiveSlot: 'blue',
        newStandbySlot: 'green',
      },
    }),
  /requires continuous canonical switch provenance/,
)

console.log({
  architecture:
    'verified-traffic-switch-effect + pre-switch-blue-green-state -> post-switch-state-reconciliation -> canonical-active-standby-state -> no-runtime-authority',

  previousActiveSlot:
    reconciled.previousActiveSlot,

  previousStandbySlot:
    reconciled.previousStandbySlot,

  activeSlot:
    reconciled.activeSlot,

  standbySlot:
    reconciled.standbySlot,

  activeReleaseIdentity:
    reconciled.activeReleaseIdentity,

  standbyReleaseIdentity:
    reconciled.standbyReleaseIdentity,

  trafficSwitchExecutionVerified:
    reconciled.trafficSwitchExecutionVerified,

  previousBlueGreenStateVerified:
    reconciled.previousBlueGreenStateVerified,

  postTrafficSwitchStateReconciled:
    reconciled.postTrafficSwitchStateReconciled,

  trafficSwitchApplied:
    reconciled.trafficSwitchApplied,

  deploymentApplied:
    reconciled.deploymentApplied,

  runtimeAuthorityGranted:
    reconciled.runtimeAuthorityGranted,

  networkAuthorityGranted:
    reconciled.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime post traffic switch blue/green state foundation proof passed.',
)
