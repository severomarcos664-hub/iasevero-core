import assert from 'node:assert/strict'

import type {
  GovernedRuntimeProcessIdentityBinding,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

import {
  prepareGovernedPersistentRuntimeLaunch,
} from '../app/lib/runtime-execution-plane/runtime-persistent-launch-boundary'

const binding: GovernedRuntimeProcessIdentityBinding = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-binding',

  instanceId: 'instance-v287737-proof',
  releaseIdentity: 'v287.73.7-proof-release',
  authorizationRecordId: 'authorization-v287737-proof',
  processId: 424242,

  processIdentityBound: true,
  instanceIdVerified: true,
  releaseIdentityVerified: true,
  authorizationRecordVerified: true,
  processIdVerified: true,

  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const launch = prepareGovernedPersistentRuntimeLaunch(binding)

assert.equal(launch.processIdentityVerified, true)
assert.equal(launch.persistentLaunchEligible, true)
assert.equal(launch.persistentLaunchPrepared, true)
assert.equal(launch.processSpawnedByBoundary, false)

assert.equal(launch.readinessGranted, false)
assert.equal(launch.livenessGranted, false)
assert.equal(launch.restartAuthorized, false)
assert.equal(launch.runtimeAuthorityGranted, false)
assert.equal(launch.networkAuthorityGranted, false)

assert.throws(
  () =>
    prepareGovernedPersistentRuntimeLaunch({
      ...binding,
      processId: 0,
    }),
  /requires verified process identity binding/,
)

console.log({
  architecture:
    'process-identity-binding -> persistent-launch-boundary -> zero-new-effect',
  persistentLaunchEligible: launch.persistentLaunchEligible,
  persistentLaunchPrepared: launch.persistentLaunchPrepared,
  processSpawnedByBoundary: launch.processSpawnedByBoundary,
  readinessGranted: launch.readinessGranted,
  restartAuthorized: launch.restartAuthorized,
  runtimeAuthorityGranted: launch.runtimeAuthorityGranted,
  networkAuthorityGranted: launch.networkAuthorityGranted,
})

console.log(
  'Runtime governed persistent runtime launch boundary foundation proof passed.',
)
