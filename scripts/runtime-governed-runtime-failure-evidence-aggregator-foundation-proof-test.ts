import assert from 'node:assert/strict'

import type {
  GovernedRuntimeLivenessFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-failure-evidence'

import type {
  GovernedRuntimeHeartbeatFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-failure-evidence'

import {
  aggregateGovernedRuntimeFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-failure-evidence-aggregator'

const livenessBase: GovernedRuntimeLivenessFailureEvidence = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-failure-evidence',
  instanceId: 'instance-v2877329-proof',
  releaseIdentity: 'v287.73.29-proof-release',
  authorizationRecordId: 'authorization-v2877329-proof',
  processId: 525252,
  evidenceSource: 'liveness-decision',
  livenessDecisionVerified: true,
  failureEvidenceRecorded: true,
  livenessFailed: false,
  failureSignalObserved: false,
  failureDecisionMade: false,
  recoveryDecisionMade: false,
  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const heartbeatBase: GovernedRuntimeHeartbeatFailureEvidence = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-heartbeat-failure-evidence',
  instanceId: 'instance-v2877329-proof',
  releaseIdentity: 'v287.73.29-proof-release',
  processId: 525252,
  evidenceSource: 'heartbeat-health-assessment',
  heartbeatHealthAssessmentVerified: true,
  failureEvidenceRecorded: true,
  heartbeatDegraded: false,
  failureSignalObserved: false,
  failureDecisionMade: false,
  recoveryDecisionMade: false,
  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const none =
  aggregateGovernedRuntimeFailureEvidence({
    livenessEvidence: livenessBase,
    heartbeatEvidence: heartbeatBase,
  })

assert.equal(none.observedFailureSignalCount, 0)
assert.equal(none.anyFailureSignalObserved, false)
assert.equal(none.allFailureSignalsObserved, false)

const one =
  aggregateGovernedRuntimeFailureEvidence({
    livenessEvidence: {
      ...livenessBase,
      livenessFailed: true,
      failureSignalObserved: true,
    },
    heartbeatEvidence: heartbeatBase,
  })

assert.equal(one.observedFailureSignalCount, 1)
assert.equal(one.anyFailureSignalObserved, true)
assert.equal(one.allFailureSignalsObserved, false)

const both =
  aggregateGovernedRuntimeFailureEvidence({
    livenessEvidence: {
      ...livenessBase,
      livenessFailed: true,
      failureSignalObserved: true,
    },
    heartbeatEvidence: {
      ...heartbeatBase,
      heartbeatDegraded: true,
      failureSignalObserved: true,
    },
  })

assert.equal(both.observedFailureSignalCount, 2)
assert.equal(both.anyFailureSignalObserved, true)
assert.equal(both.allFailureSignalsObserved, true)

assert.equal(both.failureDecisionMade, false)
assert.equal(both.recoveryDecisionMade, false)
assert.equal(both.restartAuthorized, false)
assert.equal(both.restartApplied, false)
assert.equal(both.deploymentApplied, false)
assert.equal(both.runtimeAuthorityGranted, false)
assert.equal(both.networkAuthorityGranted, false)

assert.throws(
  () =>
    aggregateGovernedRuntimeFailureEvidence({
      livenessEvidence: livenessBase,
      heartbeatEvidence: {
        ...heartbeatBase,
        processId: 626262,
      },
    }),
  /requires one continuous runtime identity chain/,
)

console.log({
  architecture:
    'liveness-evidence + heartbeat-evidence -> aggregation -> correlation-only -> no-failure-decision',
  processId: both.processId,
  evidenceSourceCount: both.evidenceSourceCount,
  zeroSignals: none.observedFailureSignalCount,
  oneSignal: one.observedFailureSignalCount,
  twoSignals: both.observedFailureSignalCount,
  anyFailureSignalObserved: both.anyFailureSignalObserved,
  allFailureSignalsObserved: both.allFailureSignalsObserved,
  failureDecisionMade: both.failureDecisionMade,
  recoveryDecisionMade: both.recoveryDecisionMade,
  restartAuthorized: both.restartAuthorized,
  restartApplied: both.restartApplied,
  runtimeAuthorityGranted: both.runtimeAuthorityGranted,
  networkAuthorityGranted: both.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime failure evidence aggregator foundation proof passed.',
)
