import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRollbackAssessment,
} from '../app/lib/runtime-execution-plane/runtime-rollback-assessment'

import type {
  GovernedRuntimeFailureEvidenceAggregation,
} from '../app/lib/runtime-execution-plane/runtime-failure-evidence-aggregator'

import type {
  GovernedRuntimeMultiSourceFailureAssessment,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-failure-assessment'

import {
  assessGovernedRuntimeMultiSourceFailure,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-failure-assessment'

import {
  recordGovernedRuntimeRollbackConditionEvidence,
} from '../app/lib/runtime-execution-plane/runtime-rollback-condition-evidence'

const rollbackAssessment: GovernedRuntimeRollbackAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-rollback-assessment',

  activeSlot: 'blue',
  standbySlot: 'green',

  rollbackFromReleaseIdentity:
    'v287.73.43-active-proof',

  rollbackTargetReleaseIdentity:
    'v287.73.42-standby-proof',

  rollbackFromContentAddress:
    `sha256:${'a'.repeat(64)}`,

  rollbackTargetContentAddress:
    `sha256:${'b'.repeat(64)}`,

  blueGreenStateVerified: true,
  rollbackAssessmentCompleted: true,
  rollbackTargetIdentified: true,

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

const failureAggregation: GovernedRuntimeFailureEvidenceAggregation = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-failure-evidence-aggregation',

  instanceId: 'instance-v2877343-proof',
  releaseIdentity: 'v287.73.43-active-proof',
  processId: 626262,

  livenessAuthorizationRecordId:
    'liveness-authorization-v2877343-proof',

  evidenceAggregationCompleted: true,
  livenessEvidenceVerified: true,
  heartbeatEvidenceVerified: true,
  evidenceSourceCount: 2,

  livenessFailureSignalObserved: true,
  heartbeatFailureSignalObserved: true,
  observedFailureSignalCount: 2,
  anyFailureSignalObserved: true,
  allFailureSignalsObserved: true,

  failureDecisionMade: false,
  recoveryDecisionMade: false,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const failureAssessment =
  assessGovernedRuntimeMultiSourceFailure(
    failureAggregation,
  )

const evidence =
  recordGovernedRuntimeRollbackConditionEvidence(
    rollbackAssessment,
    failureAssessment,
  )

assert.equal(evidence.rollbackAssessmentVerified, true)
assert.equal(evidence.failureAssessmentVerified, true)
assert.equal(evidence.rollbackTargetVerified, true)
assert.equal(evidence.sourceReleaseContinuityVerified, true)

assert.equal(
  evidence.rollbackConditionEvidenceRecorded,
  true,
)

assert.equal(evidence.failureDetected, true)
assert.equal(evidence.failureClassification, 'multi-source-failure')
assert.equal(evidence.recoveryRequired, true)

assert.equal(
  evidence.rollbackConditionSignalObserved,
  true,
)

assert.equal(evidence.rollbackConditionAssessed, false)
assert.equal(evidence.rollbackDecisionMade, false)
assert.equal(evidence.rollbackAuthorized, false)
assert.equal(evidence.rollbackApplied, false)

assert.equal(evidence.trafficSwitchAuthorized, false)
assert.equal(evidence.trafficSwitchApplied, false)

assert.equal(evidence.deploymentApplied, false)
assert.equal(evidence.runtimeAuthorityGranted, false)
assert.equal(evidence.networkAuthorityGranted, false)

const noFailureAssessment = {
  ...failureAssessment,
  failureDetected: false,
  failureClassification: 'none',
  recoveryRequired: false,
} as GovernedRuntimeMultiSourceFailureAssessment

const noFailureEvidence =
  recordGovernedRuntimeRollbackConditionEvidence(
    rollbackAssessment,
    noFailureAssessment,
  )

assert.equal(
  noFailureEvidence.rollbackConditionSignalObserved,
  false,
)

const mismatchedFailureAssessment = {
  ...failureAssessment,
  releaseIdentity: 'different-release-proof',
} as GovernedRuntimeMultiSourceFailureAssessment

assert.throws(
  () =>
    recordGovernedRuntimeRollbackConditionEvidence(
      rollbackAssessment,
      mismatchedFailureAssessment,
    ),
  /requires continuous source release identity/,
)

const authorityInjected = {
  ...rollbackAssessment,
  rollbackAuthorized: true,
} as unknown as GovernedRuntimeRollbackAssessment

assert.throws(
  () =>
    recordGovernedRuntimeRollbackConditionEvidence(
      authorityInjected,
      failureAssessment,
    ),
  /requires zero inherited decision and execution authority/,
)

console.log({
  architecture:
    'rollback-target + multi-source-failure-assessment -> rollback-condition-evidence -> signal-only -> no-decision -> no-authorization -> no-execution',

  instanceId: evidence.instanceId,
  releaseIdentity: evidence.releaseIdentity,
  processId: evidence.processId,

  rollbackFromReleaseIdentity:
    evidence.rollbackFromReleaseIdentity,

  rollbackTargetReleaseIdentity:
    evidence.rollbackTargetReleaseIdentity,

  sourceReleaseContinuityVerified:
    evidence.sourceReleaseContinuityVerified,

  rollbackConditionEvidenceRecorded:
    evidence.rollbackConditionEvidenceRecorded,

  failureDetected:
    evidence.failureDetected,

  failureClassification:
    evidence.failureClassification,

  recoveryRequired:
    evidence.recoveryRequired,

  rollbackConditionSignalObserved:
    evidence.rollbackConditionSignalObserved,

  rollbackConditionAssessed:
    evidence.rollbackConditionAssessed,

  rollbackDecisionMade:
    evidence.rollbackDecisionMade,

  rollbackAuthorized:
    evidence.rollbackAuthorized,

  rollbackApplied:
    evidence.rollbackApplied,

  trafficSwitchAuthorized:
    evidence.trafficSwitchAuthorized,

  trafficSwitchApplied:
    evidence.trafficSwitchApplied,

  deploymentApplied:
    evidence.deploymentApplied,

  runtimeAuthorityGranted:
    evidence.runtimeAuthorityGranted,

  networkAuthorityGranted:
    evidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime rollback condition evidence foundation proof passed.',
)
