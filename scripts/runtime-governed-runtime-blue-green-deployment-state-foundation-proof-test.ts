import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import {
  establishGovernedRuntimeBlueGreenDeploymentState,
} from '../app/lib/runtime-execution-plane/runtime-blue-green-deployment-state'

const activeArtifactSha256 = 'a'.repeat(64)
const standbyArtifactSha256 = 'c'.repeat(64)

const activeRelease =
  createGovernedReleaseRuntimeIdentity({
    releaseIdentity: 'v287.73.40-active-proof',
    sourceCommit: 'active-commit-v2877340-proof',
    sourceTag: 'v287.73.40-proof',
    provenanceVerified: true,
    attestationVerified: true,
    signatureVerified: true,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,
    artifactSha256: activeArtifactSha256,
    attestationSha256: 'b'.repeat(64),
    contentAddress: `sha256:${activeArtifactSha256}`,
    signerKeyId: 'signer-v2877340-proof',
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  })

const standbyRelease =
  createGovernedReleaseRuntimeIdentity({
    releaseIdentity: 'v287.73.41-standby-proof',
    sourceCommit: 'standby-commit-v2877341-proof',
    sourceTag: 'v287.73.41-proof',
    provenanceVerified: true,
    attestationVerified: true,
    signatureVerified: true,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,
    artifactSha256: standbyArtifactSha256,
    attestationSha256: 'd'.repeat(64),
    contentAddress: `sha256:${standbyArtifactSha256}`,
    signerKeyId: 'signer-v2877341-proof',
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  })

const state =
  establishGovernedRuntimeBlueGreenDeploymentState({
    activeSlot: 'blue',
    activeRelease,
    standbyRelease,
  })

assert.equal(state.activeSlot, 'blue')
assert.equal(state.standbySlot, 'green')

assert.equal(
  state.activeReleaseIdentity,
  activeRelease.releaseIdentity,
)

assert.equal(
  state.standbyReleaseIdentity,
  standbyRelease.releaseIdentity,
)

assert.equal(
  state.releaseIdentitiesVerified,
  true,
)

assert.equal(state.releasesDistinct, true)
assert.equal(state.slotsDistinct, true)
assert.equal(state.blueGreenStateEstablished, true)

assert.equal(state.trafficSwitchAuthorized, false)
assert.equal(state.trafficSwitchApplied, false)

assert.equal(state.rollbackAuthorized, false)
assert.equal(state.rollbackApplied, false)

assert.equal(state.deploymentApplied, false)
assert.equal(state.runtimeAuthorityGranted, false)
assert.equal(state.networkAuthorityGranted, false)

assert.throws(
  () =>
    establishGovernedRuntimeBlueGreenDeploymentState({
      activeSlot: 'blue',
      activeRelease,
      standbyRelease: activeRelease,
    }),
  /requires distinct active and standby release identities/,
)

const authorityInjected = {
  ...standbyRelease,
  runtimeAuthorityGranted: true,
} as unknown as typeof standbyRelease

assert.throws(
  () =>
    establishGovernedRuntimeBlueGreenDeploymentState({
      activeSlot: 'blue',
      activeRelease,
      standbyRelease: authorityInjected,
    }),
  /requires zero inherited deployment and runtime authority/,
)

console.log({
  architecture:
    'verified-release-identities -> blue-green-state -> active+standby-slots -> no-traffic-switch -> no-rollback -> no-execution',

  activeSlot: state.activeSlot,
  standbySlot: state.standbySlot,

  activeReleaseIdentity:
    state.activeReleaseIdentity,

  standbyReleaseIdentity:
    state.standbyReleaseIdentity,

  releaseIdentitiesVerified:
    state.releaseIdentitiesVerified,

  releasesDistinct:
    state.releasesDistinct,

  blueGreenStateEstablished:
    state.blueGreenStateEstablished,

  trafficSwitchAuthorized:
    state.trafficSwitchAuthorized,

  trafficSwitchApplied:
    state.trafficSwitchApplied,

  rollbackAuthorized:
    state.rollbackAuthorized,

  rollbackApplied:
    state.rollbackApplied,

  deploymentApplied:
    state.deploymentApplied,

  runtimeAuthorityGranted:
    state.runtimeAuthorityGranted,

  networkAuthorityGranted:
    state.networkAuthorityGranted,
})

console.log(
  'Runtime governed blue/green deployment state foundation proof passed.',
)
