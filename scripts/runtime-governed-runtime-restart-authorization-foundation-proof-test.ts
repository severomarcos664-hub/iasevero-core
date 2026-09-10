import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRecoveryDecision,
} from '../app/lib/runtime-execution-plane/runtime-recovery-decision'

import {
  authorizeGovernedRuntimeRestart,
} from '../app/lib/runtime-execution-plane/runtime-restart-authorization'

const recoveryDecision: GovernedRuntimeRecoveryDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-recovery-decision',

  instanceId: 'instance-v2877316-proof',
  releaseIdentity: 'v287.73.16-proof-release',
  authorizationRecordId: 'recovery-authorization-v2877316-proof',
  processId: 424242,

  failureAssessmentVerified: true,
  recoveryDecisionMade: true,

  recoveryRequired: true,
  recoveryApproved: true,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const authorized = authorizeGovernedRuntimeRestart({
  recoveryDecision,
  restartAuthorizationRecordId:
    'restart-authorization-v2877316-proof',
  restartAuthorizationGranted: true,
})

assert.equal(authorized.recoveryDecisionVerified, true)
assert.equal(authorized.restartEligible, true)
assert.equal(authorized.restartAuthorizationGranted, true)
assert.equal(authorized.restartAuthorized, true)

assert.equal(authorized.restartApplied, false)
assert.equal(authorized.deploymentApplied, false)
assert.equal(authorized.runtimeAuthorityGranted, false)
assert.equal(authorized.networkAuthorityGranted, false)

const denied = authorizeGovernedRuntimeRestart({
  recoveryDecision,
  restartAuthorizationRecordId:
    'restart-authorization-denied-v2877316-proof',
  restartAuthorizationGranted: false,
})

assert.equal(denied.restartEligible, true)
assert.equal(denied.restartAuthorized, false)
assert.equal(denied.restartApplied, false)

const ineligible = authorizeGovernedRuntimeRestart({
  recoveryDecision: {
    ...recoveryDecision,
    recoveryRequired: false,
    recoveryApproved: false,
  },
  restartAuthorizationRecordId:
    'restart-authorization-ineligible-v2877316-proof',
  restartAuthorizationGranted: true,
})

assert.equal(ineligible.restartEligible, false)
assert.equal(ineligible.restartAuthorized, false)
assert.equal(ineligible.restartApplied, false)

console.log({
  architecture:
    'recovery-decision -> explicit-restart-authorization -> no-restart-execution',
  recoveryDecisionVerified: authorized.recoveryDecisionVerified,
  restartEligible: authorized.restartEligible,
  restartAuthorizationGranted:
    authorized.restartAuthorizationGranted,
  restartAuthorized: authorized.restartAuthorized,
  restartApplied: authorized.restartApplied,
  runtimeAuthorityGranted: authorized.runtimeAuthorityGranted,
  networkAuthorityGranted: authorized.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime restart authorization foundation proof passed.',
)
