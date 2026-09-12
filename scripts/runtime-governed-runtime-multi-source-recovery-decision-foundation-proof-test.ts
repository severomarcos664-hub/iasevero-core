import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceFailureAssessment,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-failure-assessment'

import {
  decideGovernedRuntimeMultiSourceRecovery,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-recovery-decision'

const base: GovernedRuntimeMultiSourceFailureAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-multi-source-failure-assessment',

  instanceId: 'instance-v2877331-proof',
  releaseIdentity: 'v287.73.31-proof-release',
  livenessAuthorizationRecordId:
    'authorization-v2877331-proof',
  processId: 525252,

  failureEvidenceAggregationVerified: true,
  failureAssessmentCompleted: true,

  evidenceSourceCount: 2,
  observedFailureSignalCount: 0,

  livenessFailureSignalObserved: false,
  heartbeatFailureSignalObserved: false,
  heartbeatDegradationObserved: false,

  failureDetected: false,
  failureClassified: true,
  failureClassification: 'none',
  recoveryRequired: false,

  recoveryDecisionMade: false,
  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthy =
  decideGovernedRuntimeMultiSourceRecovery(base)

assert.equal(healthy.recoveryRequired, false)
assert.equal(healthy.recoveryApproved, false)
assert.equal(healthy.failureClassification, 'none')

const livenessFailure =
  decideGovernedRuntimeMultiSourceRecovery({
    ...base,

    observedFailureSignalCount: 1,

    livenessFailureSignalObserved: true,

    failureDetected: true,
    failureClassification: 'liveness-failure',
    recoveryRequired: true,
  })

assert.equal(livenessFailure.recoveryRequired, true)
assert.equal(livenessFailure.recoveryApproved, true)
assert.equal(
  livenessFailure.failureClassification,
  'liveness-failure',
)

const multiSourceFailure =
  decideGovernedRuntimeMultiSourceRecovery({
    ...base,

    observedFailureSignalCount: 2,

    livenessFailureSignalObserved: true,
    heartbeatFailureSignalObserved: true,
    heartbeatDegradationObserved: true,

    failureDetected: true,
    failureClassification: 'multi-source-failure',
    recoveryRequired: true,
  })

assert.equal(multiSourceFailure.recoveryDecisionMade, true)
assert.equal(multiSourceFailure.recoveryRequired, true)
assert.equal(multiSourceFailure.recoveryApproved, true)
assert.equal(
  multiSourceFailure.failureClassification,
  'multi-source-failure',
)

assert.equal(multiSourceFailure.restartAuthorized, false)
assert.equal(multiSourceFailure.restartApplied, false)
assert.equal(multiSourceFailure.deploymentApplied, false)
assert.equal(multiSourceFailure.runtimeAuthorityGranted, false)
assert.equal(multiSourceFailure.networkAuthorityGranted, false)

assert.throws(
  () =>
    decideGovernedRuntimeMultiSourceRecovery({
      ...base,
      failureDetected: true,
      recoveryRequired: false,
    }),
  /requires internally consistent failure assessment/,
)

console.log({
  architecture:
    'multi-source-failure-assessment -> recovery-decision -> approval-only -> no-restart-authorization',
  processId: multiSourceFailure.processId,

  healthyRecoveryApproved:
    healthy.recoveryApproved,

  livenessRecoveryApproved:
    livenessFailure.recoveryApproved,

  multiSourceRecoveryApproved:
    multiSourceFailure.recoveryApproved,

  failureClassification:
    multiSourceFailure.failureClassification,

  recoveryDecisionMade:
    multiSourceFailure.recoveryDecisionMade,

  restartAuthorized:
    multiSourceFailure.restartAuthorized,
  restartApplied:
    multiSourceFailure.restartApplied,

  runtimeAuthorityGranted:
    multiSourceFailure.runtimeAuthorityGranted,
  networkAuthorityGranted:
    multiSourceFailure.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source recovery decision foundation proof passed.',
)
