import assert from 'node:assert/strict'

import {
  establishGovernedRuntimeBlueGreenDeploymentState,
} from '../app/lib/runtime-execution-plane/runtime-blue-green-deployment-state'

import type {
  GovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import type {
  GovernedRuntimeRollbackExecutionBoundaryResult,
} from '../app/lib/runtime-execution-plane/runtime-rollback-execution-boundary'

import {
  authorizeGovernedRuntimeTrafficSwitch,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-authorization'

const activeRelease: GovernedReleaseRuntimeIdentity = {
  schemaVersion: 1,
  kind: 'iasevero-governed-release-runtime-identity',
  releaseIdentity: 'v287.73.48-active-proof',
  sourceCommit: 'active-commit-v2877348-proof',
  sourceTag: 'v287.73.48-proof',
  artifactSha256: 'a'.repeat(64),
  attestationSha256: 'b'.repeat(64),
  contentAddress: `sha256:${'a'.repeat(64)}`,
  signerKeyId: 'signer-v2877348-proof',
  evidenceVerified: true,
  bindingVerified: true,
  promotionApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const standbyRelease: GovernedReleaseRuntimeIdentity = {
  schemaVersion: 1,
  kind: 'iasevero-governed-release-runtime-identity',
  releaseIdentity: 'v287.73.47-standby-proof',
  sourceCommit: 'standby-commit-v2877348-proof',
  sourceTag: 'v287.73.47-proof',
  artifactSha256: 'c'.repeat(64),
  attestationSha256: 'd'.repeat(64),
  contentAddress: `sha256:${'c'.repeat(64)}`,
  signerKeyId: 'signer-v2877347-proof',
  evidenceVerified: true,
  bindingVerified: true,
  promotionApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const blueGreenState =
  establishGovernedRuntimeBlueGreenDeploymentState({
    activeSlot: 'blue',
    activeRelease,
    standbyRelease,
  })

const rollbackExecution: GovernedRuntimeRollbackExecutionBoundaryResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-rollback-execution-boundary',

  instanceId: 'instance-v2877348-proof',
  releaseIdentity: activeRelease.releaseIdentity,
  processId: 626262,

  rollbackFromReleaseIdentity:
    activeRelease.releaseIdentity,

  rollbackTargetReleaseIdentity:
    standbyRelease.releaseIdentity,

  rollbackTargetContentAddress:
    standbyRelease.contentAddress,

  rollbackAuthorizationRecordId:
    'rollback-authorization-v2877348-proof',

  rollbackAuthorizationVerified: true,
  rollbackExecutionVerified: true,
  rollbackApplied: true,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const authorized =
  authorizeGovernedRuntimeTrafficSwitch({
    blueGreenState,
    rollbackExecution,
    trafficSwitchAuthorizationRecordId:
      'traffic-switch-authorization-v2877348-proof',
    trafficSwitchAuthorizationGranted: true,
  })

assert.equal(authorized.rollbackExecutionVerified, true)
assert.equal(authorized.blueGreenStateVerified, true)
assert.equal(authorized.trafficSwitchEligible, true)
assert.equal(
  authorized.trafficSwitchAuthorizationGranted,
  true,
)
assert.equal(authorized.trafficSwitchAuthorized, true)

assert.equal(authorized.trafficSwitchApplied, false)
assert.equal(authorized.deploymentApplied, false)
assert.equal(authorized.runtimeAuthorityGranted, false)
assert.equal(authorized.networkAuthorityGranted, false)

const denied =
  authorizeGovernedRuntimeTrafficSwitch({
    blueGreenState,
    rollbackExecution,
    trafficSwitchAuthorizationRecordId:
      'traffic-switch-authorization-denied-v2877348-proof',
    trafficSwitchAuthorizationGranted: false,
  })

assert.equal(denied.trafficSwitchEligible, true)
assert.equal(
  denied.trafficSwitchAuthorizationGranted,
  false,
)
assert.equal(denied.trafficSwitchAuthorized, false)

assert.throws(
  () =>
    authorizeGovernedRuntimeTrafficSwitch({
      blueGreenState,
      rollbackExecution: {
        ...rollbackExecution,
        rollbackTargetReleaseIdentity:
          'different-standby-release',
      },
      trafficSwitchAuthorizationRecordId:
        'traffic-switch-authorization-invalid-v2877348-proof',
      trafficSwitchAuthorizationGranted: true,
    }),
  /requires canonical active-to-standby rollback continuity/,
)

assert.throws(
  () =>
    authorizeGovernedRuntimeTrafficSwitch({
      blueGreenState,
      rollbackExecution,
      trafficSwitchAuthorizationRecordId: '   ',
      trafficSwitchAuthorizationGranted: true,
    }),
  /requires traffic switch authorization record id/,
)

console.log({
  architecture:
    'verified-rollback-effect + blue-green-state -> explicit-traffic-switch-authorization -> authorization-only -> no-traffic-switch-effect',

  activeSlot: authorized.activeSlot,
  standbySlot: authorized.standbySlot,

  trafficSwitchFromReleaseIdentity:
    authorized.trafficSwitchFromReleaseIdentity,

  trafficSwitchTargetReleaseIdentity:
    authorized.trafficSwitchTargetReleaseIdentity,

  rollbackExecutionVerified:
    authorized.rollbackExecutionVerified,

  blueGreenStateVerified:
    authorized.blueGreenStateVerified,

  trafficSwitchEligible:
    authorized.trafficSwitchEligible,

  trafficSwitchAuthorizationGranted:
    authorized.trafficSwitchAuthorizationGranted,

  trafficSwitchAuthorized:
    authorized.trafficSwitchAuthorized,

  trafficSwitchApplied:
    authorized.trafficSwitchApplied,

  deploymentApplied:
    authorized.deploymentApplied,

  runtimeAuthorityGranted:
    authorized.runtimeAuthorityGranted,

  networkAuthorityGranted:
    authorized.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime traffic switch authorization foundation proof passed.',
)
