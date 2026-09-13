import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRollbackConditionAssessment,
} from '../app/lib/runtime-execution-plane/runtime-rollback-condition-assessment'

import {
  decideGovernedRuntimeRollback,
} from '../app/lib/runtime-execution-plane/runtime-rollback-decision'

const base: GovernedRuntimeRollbackConditionAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-rollback-condition-assessment',

  instanceId: 'instance-v2877345-proof',
  releaseIdentity: 'v287.73.45-active-proof',
  processId: 626262,

  rollbackFromReleaseIdentity:
    'v287.73.45-active-proof',

  rollbackTargetReleaseIdentity:
    'v287.73.44-standby-proof',

  rollbackTargetContentAddress:
    `sha256:${'b'.repeat(64)}`,

  rollbackConditionEvidenceVerified: true,
  rollbackConditionAssessed: true,

  failureDetected: true,
  recoveryRequired: true,

  rollbackConditionSatisfied: true,

  rollbackDecisionMade: false,
  rollbackAuthorized: false,
  rollbackApplied: false,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const approved =
  decideGovernedRuntimeRollback(base)

assert.equal(
  approved.rollbackConditionAssessmentVerified,
  true,
)

assert.equal(approved.rollbackDecisionMade, true)
assert.equal(approved.rollbackRequired, true)
assert.equal(approved.rollbackApproved, true)

assert.equal(approved.rollbackAuthorized, false)
assert.equal(approved.rollbackApplied, false)

assert.equal(approved.trafficSwitchAuthorized, false)
assert.equal(approved.trafficSwitchApplied, false)

assert.equal(approved.deploymentApplied, false)
assert.equal(approved.runtimeAuthorityGranted, false)
assert.equal(approved.networkAuthorityGranted, false)

const denied =
  decideGovernedRuntimeRollback({
    ...base,
    failureDetected: false,
    recoveryRequired: false,
    rollbackConditionSatisfied: false,
  })

assert.equal(denied.rollbackDecisionMade, true)
assert.equal(denied.rollbackRequired, false)
assert.equal(denied.rollbackApproved, false)

const authorityInjected = {
  ...base,
  rollbackAuthorized: true,
} as unknown as GovernedRuntimeRollbackConditionAssessment

assert.throws(
  () =>
    decideGovernedRuntimeRollback(
      authorityInjected,
    ),
  /requires zero inherited rollback and execution authority/,
)

const inconsistentCondition = {
  ...base,
  failureDetected: false,
  recoveryRequired: false,
  rollbackConditionSatisfied: true,
} as GovernedRuntimeRollbackConditionAssessment

assert.throws(
  () =>
    decideGovernedRuntimeRollback(
      inconsistentCondition,
    ),
  /requires internally consistent rollback condition assessment/,
)

console.log({
  architecture:
    'rollback-condition-assessment -> rollback-decision -> decision-only -> no-authorization -> no-execution',

  instanceId: approved.instanceId,
  releaseIdentity: approved.releaseIdentity,
  processId: approved.processId,

  rollbackFromReleaseIdentity:
    approved.rollbackFromReleaseIdentity,

  rollbackTargetReleaseIdentity:
    approved.rollbackTargetReleaseIdentity,

  rollbackConditionAssessmentVerified:
    approved.rollbackConditionAssessmentVerified,

  rollbackDecisionMade:
    approved.rollbackDecisionMade,

  rollbackRequired:
    approved.rollbackRequired,

  rollbackApproved:
    approved.rollbackApproved,

  rollbackAuthorized:
    approved.rollbackAuthorized,

  rollbackApplied:
    approved.rollbackApplied,

  trafficSwitchAuthorized:
    approved.trafficSwitchAuthorized,

  trafficSwitchApplied:
    approved.trafficSwitchApplied,

  deploymentApplied:
    approved.deploymentApplied,

  runtimeAuthorityGranted:
    approved.runtimeAuthorityGranted,

  networkAuthorityGranted:
    approved.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime rollback decision foundation proof passed.',
)
