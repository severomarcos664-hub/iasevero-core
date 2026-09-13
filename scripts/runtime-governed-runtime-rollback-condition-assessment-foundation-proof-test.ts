import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRollbackConditionEvidence,
} from '../app/lib/runtime-execution-plane/runtime-rollback-condition-evidence'

import {
  assessGovernedRuntimeRollbackCondition,
} from '../app/lib/runtime-execution-plane/runtime-rollback-condition-assessment'

const base: GovernedRuntimeRollbackConditionEvidence = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-rollback-condition-evidence',

  instanceId: 'instance-v2877344-proof',
  releaseIdentity: 'v287.73.44-active-proof',
  processId: 626262,

  rollbackFromReleaseIdentity: 'v287.73.44-active-proof',
  rollbackTargetReleaseIdentity: 'v287.73.43-standby-proof',
  rollbackTargetContentAddress: `sha256:${'b'.repeat(64)}`,

  rollbackAssessmentVerified: true,
  failureAssessmentVerified: true,
  rollbackTargetVerified: true,
  sourceReleaseContinuityVerified: true,

  rollbackConditionEvidenceRecorded: true,

  failureDetected: true,
  failureClassification: 'multi-source-failure',
  recoveryRequired: true,

  rollbackConditionSignalObserved: true,

  rollbackConditionAssessed: false,
  rollbackDecisionMade: false,
  rollbackAuthorized: false,
  rollbackApplied: false,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const satisfied =
  assessGovernedRuntimeRollbackCondition(base)

assert.equal(
  satisfied.rollbackConditionEvidenceVerified,
  true,
)

assert.equal(
  satisfied.rollbackConditionAssessed,
  true,
)

assert.equal(
  satisfied.rollbackConditionSatisfied,
  true,
)

assert.equal(satisfied.rollbackDecisionMade, false)
assert.equal(satisfied.rollbackAuthorized, false)
assert.equal(satisfied.rollbackApplied, false)

assert.equal(satisfied.trafficSwitchAuthorized, false)
assert.equal(satisfied.trafficSwitchApplied, false)

assert.equal(satisfied.deploymentApplied, false)
assert.equal(satisfied.runtimeAuthorityGranted, false)
assert.equal(satisfied.networkAuthorityGranted, false)

const notSatisfied =
  assessGovernedRuntimeRollbackCondition({
    ...base,
    failureDetected: false,
    failureClassification: 'none',
    recoveryRequired: false,
    rollbackConditionSignalObserved: false,
  })

assert.equal(
  notSatisfied.rollbackConditionAssessed,
  true,
)

assert.equal(
  notSatisfied.rollbackConditionSatisfied,
  false,
)

const authorityInjected = {
  ...base,
  rollbackAuthorized: true,
} as unknown as GovernedRuntimeRollbackConditionEvidence

assert.throws(
  () =>
    assessGovernedRuntimeRollbackCondition(
      authorityInjected,
    ),
  /requires zero inherited execution authority/,
)

console.log({
  architecture:
    'rollback-condition-evidence -> rollback-condition-assessment -> condition-only -> no-decision -> no-authorization -> no-execution',

  instanceId: satisfied.instanceId,
  releaseIdentity: satisfied.releaseIdentity,
  processId: satisfied.processId,

  rollbackFromReleaseIdentity:
    satisfied.rollbackFromReleaseIdentity,

  rollbackTargetReleaseIdentity:
    satisfied.rollbackTargetReleaseIdentity,

  rollbackConditionEvidenceVerified:
    satisfied.rollbackConditionEvidenceVerified,

  rollbackConditionAssessed:
    satisfied.rollbackConditionAssessed,

  rollbackConditionSatisfied:
    satisfied.rollbackConditionSatisfied,

  rollbackDecisionMade:
    satisfied.rollbackDecisionMade,

  rollbackAuthorized:
    satisfied.rollbackAuthorized,

  rollbackApplied:
    satisfied.rollbackApplied,

  trafficSwitchAuthorized:
    satisfied.trafficSwitchAuthorized,

  trafficSwitchApplied:
    satisfied.trafficSwitchApplied,

  deploymentApplied:
    satisfied.deploymentApplied,

  runtimeAuthorityGranted:
    satisfied.runtimeAuthorityGranted,

  networkAuthorityGranted:
    satisfied.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime rollback condition assessment foundation proof passed.',
)
