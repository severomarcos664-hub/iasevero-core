import assert from 'node:assert/strict'

import type {
  GovernedRuntimeFailureEvidenceAggregation,
} from '../app/lib/runtime-execution-plane/runtime-failure-evidence-aggregator'

import {
  assessGovernedRuntimeMultiSourceFailure,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-failure-assessment'

const base: GovernedRuntimeFailureEvidenceAggregation = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-failure-evidence-aggregation',

  instanceId: 'instance-v2877330-proof',
  releaseIdentity: 'v287.73.30-proof-release',
  processId: 525252,

  livenessAuthorizationRecordId:
    'authorization-v2877330-proof',

  evidenceAggregationCompleted: true,
  livenessEvidenceVerified: true,
  heartbeatEvidenceVerified: true,
  evidenceSourceCount: 2,

  livenessFailureSignalObserved: false,
  heartbeatFailureSignalObserved: false,
  observedFailureSignalCount: 0,
  anyFailureSignalObserved: false,
  allFailureSignalsObserved: false,

  failureDecisionMade: false,
  recoveryDecisionMade: false,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthy =
  assessGovernedRuntimeMultiSourceFailure(base)

assert.equal(healthy.failureDetected, false)
assert.equal(healthy.failureClassification, 'none')
assert.equal(healthy.recoveryRequired, false)

const heartbeatOnly =
  assessGovernedRuntimeMultiSourceFailure({
    ...base,
    heartbeatFailureSignalObserved: true,
    observedFailureSignalCount: 1,
    anyFailureSignalObserved: true,
  })

assert.equal(heartbeatOnly.heartbeatDegradationObserved, true)
assert.equal(heartbeatOnly.failureDetected, false)
assert.equal(heartbeatOnly.failureClassification, 'none')
assert.equal(heartbeatOnly.recoveryRequired, false)

const livenessOnly =
  assessGovernedRuntimeMultiSourceFailure({
    ...base,
    livenessFailureSignalObserved: true,
    observedFailureSignalCount: 1,
    anyFailureSignalObserved: true,
  })

assert.equal(livenessOnly.failureDetected, true)
assert.equal(
  livenessOnly.failureClassification,
  'liveness-failure',
)
assert.equal(livenessOnly.recoveryRequired, true)

const both =
  assessGovernedRuntimeMultiSourceFailure({
    ...base,
    livenessFailureSignalObserved: true,
    heartbeatFailureSignalObserved: true,
    observedFailureSignalCount: 2,
    anyFailureSignalObserved: true,
    allFailureSignalsObserved: true,
  })

assert.equal(both.failureDetected, true)
assert.equal(
  both.failureClassification,
  'multi-source-failure',
)
assert.equal(both.recoveryRequired, true)

assert.equal(both.recoveryDecisionMade, false)
assert.equal(both.restartAuthorized, false)
assert.equal(both.restartApplied, false)
assert.equal(both.deploymentApplied, false)
assert.equal(both.runtimeAuthorityGranted, false)
assert.equal(both.networkAuthorityGranted, false)

assert.throws(
  () =>
    assessGovernedRuntimeMultiSourceFailure({
      ...base,
      observedFailureSignalCount: 2,
    }),
  /requires internally consistent aggregated evidence/,
)

console.log({
  architecture:
    'aggregated-evidence -> multi-source-failure-assessment -> policy-bounded-decision -> no-recovery-decision',
  processId: both.processId,
  heartbeatOnlyFailureDetected:
    heartbeatOnly.failureDetected,
  livenessFailureDetected:
    livenessOnly.failureDetected,
  combinedFailureDetected:
    both.failureDetected,
  combinedClassification:
    both.failureClassification,
  recoveryRequired:
    both.recoveryRequired,
  recoveryDecisionMade:
    both.recoveryDecisionMade,
  restartAuthorized:
    both.restartAuthorized,
  restartApplied:
    both.restartApplied,
  runtimeAuthorityGranted:
    both.runtimeAuthorityGranted,
  networkAuthorityGranted:
    both.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source failure assessment foundation proof passed.',
)
