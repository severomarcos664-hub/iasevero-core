import assert from 'node:assert/strict'

import type {
  GovernedProcessMaterializationResult,
} from '../app/lib/runtime-execution-plane/runtime-process-materialization'

import {
  bindGovernedRuntimeProcessIdentity,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

const validMaterialization: GovernedProcessMaterializationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-process-materialization-result',

  instanceId: 'instance-v28773-proof',
  releaseIdentity: 'v287.73.6-proof-release',
  authorizationRecordId: 'authorization-v28773-proof',

  authorizationVerified: true,
  processSpecificationVerified: true,

  processStarted: true,
  processIdAssigned: true,
  processId: 424242,

  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,

  promotionApplied: false,
  deploymentApplied: false,
  executionApplied: true,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const binding = bindGovernedRuntimeProcessIdentity(validMaterialization)

assert.equal(binding.processIdentityBound, true)
assert.equal(binding.instanceIdVerified, true)
assert.equal(binding.releaseIdentityVerified, true)
assert.equal(binding.authorizationRecordVerified, true)
assert.equal(binding.processIdVerified, true)

assert.equal(binding.processId, 424242)
assert.equal(binding.readinessGranted, false)
assert.equal(binding.livenessGranted, false)
assert.equal(binding.restartAuthorized, false)
assert.equal(binding.runtimeAuthorityGranted, false)
assert.equal(binding.networkAuthorityGranted, false)

console.log({
  architecture:
    'materialization -> runtime-process-identity-binding -> zero-new-authority',
  processIdentityBound: binding.processIdentityBound,
  processId: binding.processId,
  readinessGranted: binding.readinessGranted,
  runtimeAuthorityGranted: binding.runtimeAuthorityGranted,
  networkAuthorityGranted: binding.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime process identity binding foundation proof passed.',
)
