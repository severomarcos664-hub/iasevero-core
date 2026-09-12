import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-execution-integration'

import {
  rebindGovernedRuntimeMultiSourceProcessIdentity,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-process-identity-rebinding-integration'

const restart:
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-restart-execution-result',

  instanceId: 'instance-v2877335-proof',
  releaseIdentity: 'v287.73.35-proof-release',

  restartAuthorizationRecordId:
    'restart-authorization-v2877335-proof',

  previousProcessId: 525252,
  newProcessId: 626262,

  restartAuthorizationVerified: true,
  restartExecutionPrepared: true,
  restartApplied: true,

  processIdentityRebindingRequired: true,
  readinessGranted: false,
  livenessGranted: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceAuthorizationVerified: true,
  authorizationAdapterVerified: true,

  sourceKind:
    'iasevero-governed-runtime-multi-source-restart-authorization',

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877335-proof',
}

const rebound =
  rebindGovernedRuntimeMultiSourceProcessIdentity(
    restart,
  )

assert.equal(
  rebound.multiSourceRestartExecutionVerified,
  true,
)

assert.equal(
  rebound.multiSourceAuthorizationVerified,
  true,
)

assert.equal(
  rebound.authorizationAdapterVerified,
  true,
)

assert.equal(
  rebound.restartExecutionVerified,
  true,
)

assert.equal(
  rebound.previousProcessIdVerified,
  true,
)

assert.equal(
  rebound.replacementProcessIdVerified,
  true,
)

assert.equal(
  rebound.processIdentityRebound,
  true,
)

assert.equal(rebound.previousProcessId, 525252)
assert.equal(rebound.processId, 626262)

assert.equal(
  rebound.sourceLivenessAuthorizationRecordId,
  restart.sourceLivenessAuthorizationRecordId,
)

assert.equal(rebound.readinessGranted, false)
assert.equal(rebound.livenessGranted, false)

assert.equal(rebound.deploymentApplied, false)
assert.equal(rebound.runtimeAuthorityGranted, false)
assert.equal(rebound.networkAuthorityGranted, false)

const invalidRestartExecution = {
  ...restart,
  processIdentityRebindingRequired: false,
} as unknown as GovernedRuntimeMultiSourceRestartExecutionIntegrationResult

assert.throws(
  () =>
    rebindGovernedRuntimeMultiSourceProcessIdentity(
      invalidRestartExecution,
    ),
  /requires verified restart execution/,
)

console.log({
  architecture:
    'multi-source-restart-execution -> canonical-process-identity-owner -> replacement-pid-rebinding -> mandatory-health-revalidation',

  previousProcessId:
    rebound.previousProcessId,

  replacementProcessId:
    rebound.processId,

  multiSourceRestartExecutionVerified:
    rebound.multiSourceRestartExecutionVerified,

  processIdentityRebound:
    rebound.processIdentityRebound,

  provenancePreserved:
    rebound.sourceLivenessAuthorizationRecordId ===
    restart.sourceLivenessAuthorizationRecordId,

  readinessGranted:
    rebound.readinessGranted,

  livenessGranted:
    rebound.livenessGranted,

  runtimeAuthorityGranted:
    rebound.runtimeAuthorityGranted,

  networkAuthorityGranted:
    rebound.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source process identity rebinding integration foundation proof passed.',
)
