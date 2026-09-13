import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRollbackDecision,
} from '../app/lib/runtime-execution-plane/runtime-rollback-decision'

import {
  authorizeGovernedRuntimeRollback,
} from '../app/lib/runtime-execution-plane/runtime-rollback-authorization'

const approvedDecision: GovernedRuntimeRollbackDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-rollback-decision',

  instanceId: 'instance-v2877346-proof',
  releaseIdentity: 'v287.73.46-active-proof',
  processId: 626262,

  rollbackFromReleaseIdentity:
    'v287.73.46-active-proof',

  rollbackTargetReleaseIdentity:
    'v287.73.45-standby-proof',

  rollbackTargetContentAddress:
    `sha256:${'b'.repeat(64)}`,

  rollbackConditionAssessmentVerified: true,
  rollbackDecisionMade: true,

  rollbackRequired: true,
  rollbackApproved: true,

  rollbackAuthorized: false,
  rollbackApplied: false,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const authorized =
  authorizeGovernedRuntimeRollback({
    decision: approvedDecision,
    rollbackAuthorizationRecordId:
      'rollback-authorization-v2877346-proof',
    rollbackAuthorizationGranted: true,
  })

assert.equal(authorized.rollbackDecisionVerified, true)
assert.equal(authorized.rollbackEligible, true)
assert.equal(
  authorized.rollbackAuthorizationGranted,
  true,
)
assert.equal(authorized.rollbackAuthorized, true)

assert.equal(authorized.rollbackApplied, false)
assert.equal(authorized.trafficSwitchAuthorized, false)
assert.equal(authorized.trafficSwitchApplied, false)
assert.equal(authorized.deploymentApplied, false)
assert.equal(authorized.runtimeAuthorityGranted, false)
assert.equal(authorized.networkAuthorityGranted, false)

const notGranted =
  authorizeGovernedRuntimeRollback({
    decision: approvedDecision,
    rollbackAuthorizationRecordId:
      'rollback-authorization-denied-v2877346-proof',
    rollbackAuthorizationGranted: false,
  })

assert.equal(notGranted.rollbackEligible, true)
assert.equal(
  notGranted.rollbackAuthorizationGranted,
  false,
)
assert.equal(notGranted.rollbackAuthorized, false)

const notRequiredDecision = {
  ...approvedDecision,
  rollbackRequired: false,
  rollbackApproved: false,
} as GovernedRuntimeRollbackDecision

const notEligible =
  authorizeGovernedRuntimeRollback({
    decision: notRequiredDecision,
    rollbackAuthorizationRecordId:
      'rollback-authorization-not-required-v2877346-proof',
    rollbackAuthorizationGranted: true,
  })

assert.equal(notEligible.rollbackEligible, false)
assert.equal(notEligible.rollbackAuthorized, false)

assert.throws(
  () =>
    authorizeGovernedRuntimeRollback({
      decision: approvedDecision,
      rollbackAuthorizationRecordId: '   ',
      rollbackAuthorizationGranted: true,
    }),
  /requires rollback authorization record id/,
)

const authorityInjected = {
  ...approvedDecision,
  rollbackAuthorized: true,
} as unknown as GovernedRuntimeRollbackDecision

assert.throws(
  () =>
    authorizeGovernedRuntimeRollback({
      decision: authorityInjected,
      rollbackAuthorizationRecordId:
        'rollback-authorization-injected-v2877346-proof',
      rollbackAuthorizationGranted: true,
    }),
  /requires zero inherited rollback and execution authority/,
)

console.log({
  architecture:
    'rollback-decision -> explicit-rollback-authorization -> authorization-only -> no-execution',

  instanceId: authorized.instanceId,
  releaseIdentity: authorized.releaseIdentity,
  processId: authorized.processId,

  rollbackFromReleaseIdentity:
    authorized.rollbackFromReleaseIdentity,

  rollbackTargetReleaseIdentity:
    authorized.rollbackTargetReleaseIdentity,

  rollbackDecisionVerified:
    authorized.rollbackDecisionVerified,

  rollbackRequired:
    authorized.rollbackRequired,

  rollbackApproved:
    authorized.rollbackApproved,

  rollbackEligible:
    authorized.rollbackEligible,

  rollbackAuthorizationGranted:
    authorized.rollbackAuthorizationGranted,

  rollbackAuthorized:
    authorized.rollbackAuthorized,

  rollbackApplied:
    authorized.rollbackApplied,

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
  'Runtime governed runtime rollback authorization foundation proof passed.',
)
