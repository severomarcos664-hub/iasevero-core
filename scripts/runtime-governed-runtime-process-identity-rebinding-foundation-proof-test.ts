import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRestartExecutionResult,
} from '../app/lib/runtime-execution-plane/runtime-restart-execution-boundary'

import {
  rebindGovernedRuntimeProcessIdentity,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

const restart: GovernedRuntimeRestartExecutionResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-restart-execution-result',

  instanceId: 'instance-v2877318-proof',
  releaseIdentity: 'v287.73.18-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877318-proof',

  previousProcessId: 424242,
  newProcessId: 525252,

  restartAuthorizationVerified: true,
  restartExecutionPrepared: true,
  restartApplied: true,

  processIdentityRebindingRequired: true,
  readinessGranted: false,
  livenessGranted: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const rebound = rebindGovernedRuntimeProcessIdentity(restart)

assert.equal(rebound.restartExecutionVerified, true)
assert.equal(rebound.previousProcessIdVerified, true)
assert.equal(rebound.replacementProcessIdVerified, true)
assert.equal(rebound.processIdentityRebound, true)

assert.equal(rebound.previousProcessId, 424242)
assert.equal(rebound.processId, 525252)

assert.equal(rebound.readinessGranted, false)
assert.equal(rebound.livenessGranted, false)
assert.equal(rebound.deploymentApplied, false)
assert.equal(rebound.runtimeAuthorityGranted, false)
assert.equal(rebound.networkAuthorityGranted, false)

assert.throws(
  () =>
    rebindGovernedRuntimeProcessIdentity({
      ...restart,
      newProcessId: 424242,
    }),
  /requires verified restart execution/,
)

console.log({
  architecture:
    'restart-execution -> canonical-process-identity-owner -> replacement-pid-rebinding -> mandatory-health-revalidation',
  restartExecutionVerified: rebound.restartExecutionVerified,
  previousProcessId: rebound.previousProcessId,
  processId: rebound.processId,
  processIdentityRebound: rebound.processIdentityRebound,
  readinessGranted: rebound.readinessGranted,
  livenessGranted: rebound.livenessGranted,
  runtimeAuthorityGranted: rebound.runtimeAuthorityGranted,
  networkAuthorityGranted: rebound.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime process identity rebinding foundation proof passed.',
)
