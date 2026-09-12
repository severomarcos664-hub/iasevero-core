import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRecoveryDecision,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-recovery-decision'

import {
  authorizeGovernedRuntimeMultiSourceRestart,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-authorization'

const base: GovernedRuntimeMultiSourceRecoveryDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-multi-source-recovery-decision',

  instanceId: 'instance-v2877332-proof',
  releaseIdentity: 'v287.73.32-proof-release',
  livenessAuthorizationRecordId:
    'liveness-authorization-v2877332-proof',
  processId: 525252,

  multiSourceFailureAssessmentVerified: true,
  recoveryDecisionMade: true,

  observedFailureSignalCount: 2,
  failureClassification: 'multi-source-failure',

  recoveryRequired: true,
  recoveryApproved: true,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const authorized =
  authorizeGovernedRuntimeMultiSourceRestart({
    recoveryDecision: base,
    restartAuthorizationRecordId:
      'restart-authorization-v2877332-proof',
    restartAuthorizationGranted: true,
  })

assert.equal(
  authorized.restartAuthorizationGranted,
  true,
)
assert.equal(authorized.restartAuthorized, true)
assert.equal(authorized.restartApplied, false)
assert.equal(authorized.deploymentApplied, false)
assert.equal(authorized.runtimeAuthorityGranted, false)
assert.equal(authorized.networkAuthorityGranted, false)

const denied =
  authorizeGovernedRuntimeMultiSourceRestart({
    recoveryDecision: base,
    restartAuthorizationRecordId:
      'restart-authorization-v2877332-denied',
    restartAuthorizationGranted: false,
  })

assert.equal(
  denied.restartAuthorizationGranted,
  false,
)
assert.equal(denied.restartAuthorized, false)

const healthy =
  authorizeGovernedRuntimeMultiSourceRestart({
    recoveryDecision: {
      ...base,
      observedFailureSignalCount: 0,
      failureClassification: 'none',
      recoveryRequired: false,
      recoveryApproved: false,
    },
    restartAuthorizationRecordId:
      'restart-authorization-v2877332-healthy',
    restartAuthorizationGranted: true,
  })

assert.equal(healthy.restartAuthorized, false)

assert.throws(
  () =>
    authorizeGovernedRuntimeMultiSourceRestart({
      recoveryDecision: base,
      restartAuthorizationRecordId: '   ',
      restartAuthorizationGranted: true,
    }),
  /requires authorization record identity/,
)

console.log({
  architecture:
    'multi-source-recovery-decision -> explicit-restart-authorization -> no-restart-execution',

  processId: authorized.processId,

  recoveryRequired:
    authorized.recoveryRequired,
  recoveryApproved:
    authorized.recoveryApproved,

  restartAuthorizationGranted:
    authorized.restartAuthorizationGranted,
  restartAuthorized:
    authorized.restartAuthorized,

  deniedRestartAuthorized:
    denied.restartAuthorized,

  healthyRestartAuthorized:
    healthy.restartAuthorized,

  restartApplied:
    authorized.restartApplied,

  runtimeAuthorityGranted:
    authorized.runtimeAuthorityGranted,
  networkAuthorityGranted:
    authorized.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source restart authorization foundation proof passed.',
)
