import assert from 'node:assert/strict'

import type {
  GovernedRuntimeBlueGreenDeploymentState,
} from '../app/lib/runtime-execution-plane/runtime-blue-green-deployment-state'

import {
  assessGovernedRuntimeRollback,
} from '../app/lib/runtime-execution-plane/runtime-rollback-assessment'

const blueGreenState: GovernedRuntimeBlueGreenDeploymentState = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-blue-green-deployment-state',

  activeSlot: 'blue',
  standbySlot: 'green',

  activeReleaseIdentity: 'v287.73.41-active-proof',
  standbyReleaseIdentity: 'v287.73.42-standby-proof',

  activeContentAddress: `sha256:${'a'.repeat(64)}`,
  standbyContentAddress: `sha256:${'b'.repeat(64)}`,

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

const assessment =
  assessGovernedRuntimeRollback(blueGreenState)

assert.equal(assessment.blueGreenStateVerified, true)
assert.equal(assessment.rollbackAssessmentCompleted, true)
assert.equal(assessment.rollbackTargetIdentified, true)

assert.equal(
  assessment.rollbackFromReleaseIdentity,
  blueGreenState.activeReleaseIdentity,
)

assert.equal(
  assessment.rollbackTargetReleaseIdentity,
  blueGreenState.standbyReleaseIdentity,
)

assert.equal(assessment.rollbackConditionAssessed, false)
assert.equal(assessment.rollbackDecisionMade, false)
assert.equal(assessment.rollbackAuthorized, false)
assert.equal(assessment.rollbackApplied, false)

assert.equal(assessment.trafficSwitchAuthorized, false)
assert.equal(assessment.trafficSwitchApplied, false)

assert.equal(assessment.deploymentApplied, false)
assert.equal(assessment.runtimeAuthorityGranted, false)
assert.equal(assessment.networkAuthorityGranted, false)

const authorityInjected = {
  ...blueGreenState,
  rollbackAuthorized: true,
} as unknown as GovernedRuntimeBlueGreenDeploymentState

assert.throws(
  () =>
    assessGovernedRuntimeRollback(authorityInjected),
  /requires zero inherited execution authority/,
)

const identityCorrupted = {
  ...blueGreenState,
  standbyReleaseIdentity:
    blueGreenState.activeReleaseIdentity,
} as unknown as GovernedRuntimeBlueGreenDeploymentState

assert.throws(
  () =>
    assessGovernedRuntimeRollback(identityCorrupted),
  /requires verified blue\/green deployment state/,
)

console.log({
  architecture:
    'blue-green-state -> rollback-assessment -> rollback-target-only -> no-decision -> no-authorization -> no-execution',

  activeSlot: assessment.activeSlot,
  standbySlot: assessment.standbySlot,

  rollbackFromReleaseIdentity:
    assessment.rollbackFromReleaseIdentity,

  rollbackTargetReleaseIdentity:
    assessment.rollbackTargetReleaseIdentity,

  blueGreenStateVerified:
    assessment.blueGreenStateVerified,

  rollbackAssessmentCompleted:
    assessment.rollbackAssessmentCompleted,

  rollbackTargetIdentified:
    assessment.rollbackTargetIdentified,

  rollbackConditionAssessed:
    assessment.rollbackConditionAssessed,

  rollbackDecisionMade:
    assessment.rollbackDecisionMade,

  rollbackAuthorized:
    assessment.rollbackAuthorized,

  rollbackApplied:
    assessment.rollbackApplied,

  trafficSwitchAuthorized:
    assessment.trafficSwitchAuthorized,

  deploymentApplied:
    assessment.deploymentApplied,

  runtimeAuthorityGranted:
    assessment.runtimeAuthorityGranted,

  networkAuthorityGranted:
    assessment.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime rollback assessment foundation proof passed.',
)
