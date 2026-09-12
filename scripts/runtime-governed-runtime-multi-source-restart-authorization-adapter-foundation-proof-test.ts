import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRestartAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-authorization'

import {
  adaptGovernedRuntimeMultiSourceRestartAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-authorization-adapter'

const authorizedSource:
  GovernedRuntimeMultiSourceRestartAuthorization = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-multi-source-restart-authorization',

    instanceId: 'instance-v2877333-proof',
    releaseIdentity: 'v287.73.33-proof-release',
    livenessAuthorizationRecordId:
      'liveness-authorization-v2877333-proof',
    processId: 525252,

    recoveryDecisionVerified: true,
    recoveryRequired: true,
    recoveryApproved: true,

    restartAuthorizationRecordId:
      'restart-authorization-v2877333-proof',
    restartAuthorizationGranted: true,
    restartAuthorized: true,

    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

const adapted =
  adaptGovernedRuntimeMultiSourceRestartAuthorization(
    authorizedSource,
  )

assert.equal(adapted.adapterVerified, true)
assert.equal(adapted.recoveryDecisionVerified, true)
assert.equal(adapted.restartEligible, true)

assert.equal(
  adapted.recoveryAuthorizationRecordId,
  authorizedSource.livenessAuthorizationRecordId,
)

assert.equal(
  adapted.restartAuthorizationRecordId,
  authorizedSource.restartAuthorizationRecordId,
)

assert.equal(
  adapted.sourceLivenessAuthorizationRecordId,
  authorizedSource.livenessAuthorizationRecordId,
)

assert.equal(
  adapted.restartAuthorizationGranted,
  true,
)

assert.equal(adapted.restartAuthorized, true)

assert.equal(adapted.restartApplied, false)
assert.equal(adapted.deploymentApplied, false)
assert.equal(adapted.runtimeAuthorityGranted, false)
assert.equal(adapted.networkAuthorityGranted, false)

const denied =
  adaptGovernedRuntimeMultiSourceRestartAuthorization({
    ...authorizedSource,
    restartAuthorizationGranted: false,
    restartAuthorized: false,
  })

assert.equal(denied.restartEligible, true)
assert.equal(denied.restartAuthorized, false)

const healthy =
  adaptGovernedRuntimeMultiSourceRestartAuthorization({
    ...authorizedSource,
    recoveryRequired: false,
    recoveryApproved: false,
    restartAuthorizationGranted: true,
    restartAuthorized: false,
  })

assert.equal(healthy.restartEligible, false)
assert.equal(healthy.restartAuthorized, false)

assert.throws(
  () =>
    adaptGovernedRuntimeMultiSourceRestartAuthorization({
      ...authorizedSource,
      restartAuthorized: false,
    }),
  /requires internally consistent restart authorization/,
)

console.log({
  architecture:
    'multi-source-restart-authorization -> governed-adapter -> canonical-restart-authorization-contract -> no-execution',

  processId: adapted.processId,

  adapterVerified:
    adapted.adapterVerified,

  provenancePreserved:
    adapted.recoveryAuthorizationRecordId ===
    adapted.sourceLivenessAuthorizationRecordId,

  restartEligible:
    adapted.restartEligible,

  restartAuthorizationGranted:
    adapted.restartAuthorizationGranted,

  restartAuthorized:
    adapted.restartAuthorized,

  deniedRestartAuthorized:
    denied.restartAuthorized,

  healthyRestartEligible:
    healthy.restartEligible,

  restartApplied:
    adapted.restartApplied,

  runtimeAuthorityGranted:
    adapted.runtimeAuthorityGranted,

  networkAuthorityGranted:
    adapted.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source restart authorization adapter foundation proof passed.',
)
