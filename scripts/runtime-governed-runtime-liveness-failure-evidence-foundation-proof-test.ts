import assert from 'node:assert/strict'

import type {
  GovernedRuntimeLivenessDecision,
} from '../app/lib/runtime-execution-plane/runtime-liveness-decision'

import {
  recordGovernedRuntimeLivenessFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-failure-evidence'

const baseDecision: GovernedRuntimeLivenessDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-decision',

  instanceId: 'instance-v2877328-proof',
  releaseIdentity: 'v287.73.28-proof-release',
  authorizationRecordId: 'authorization-v2877328-proof',
  processId: 525252,

  livenessAssessmentVerified: true,
  livenessDecisionMade: true,

  readinessGranted: true,
  livenessGranted: true,

  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthyEvidence =
  recordGovernedRuntimeLivenessFailureEvidence(
    baseDecision,
  )

assert.equal(
  healthyEvidence.evidenceSource,
  'liveness-decision',
)
assert.equal(
  healthyEvidence.livenessDecisionVerified,
  true,
)
assert.equal(healthyEvidence.failureEvidenceRecorded, true)
assert.equal(healthyEvidence.livenessFailed, false)
assert.equal(healthyEvidence.failureSignalObserved, false)

const failedEvidence =
  recordGovernedRuntimeLivenessFailureEvidence({
    ...baseDecision,
    livenessGranted: false,
  })

assert.equal(failedEvidence.livenessFailed, true)
assert.equal(failedEvidence.failureSignalObserved, true)

assert.equal(failedEvidence.failureDecisionMade, false)
assert.equal(failedEvidence.recoveryDecisionMade, false)
assert.equal(failedEvidence.restartAuthorized, false)
assert.equal(failedEvidence.restartApplied, false)
assert.equal(failedEvidence.deploymentApplied, false)
assert.equal(failedEvidence.runtimeAuthorityGranted, false)
assert.equal(failedEvidence.networkAuthorityGranted, false)

assert.throws(
  () =>
    recordGovernedRuntimeLivenessFailureEvidence({
      ...baseDecision,
      restartAuthorized: true as false,
    }),
  /requires zero inherited execution authority/,
)

console.log({
  architecture:
    'liveness-decision -> liveness-failure-evidence -> signal-only -> no-failure-decision',
  processId: failedEvidence.processId,
  evidenceSource: failedEvidence.evidenceSource,
  healthySignal:
    healthyEvidence.failureSignalObserved,
  failedSignal:
    failedEvidence.failureSignalObserved,
  failureDecisionMade:
    failedEvidence.failureDecisionMade,
  recoveryDecisionMade:
    failedEvidence.recoveryDecisionMade,
  restartAuthorized:
    failedEvidence.restartAuthorized,
  restartApplied:
    failedEvidence.restartApplied,
  runtimeAuthorityGranted:
    failedEvidence.runtimeAuthorityGranted,
  networkAuthorityGranted:
    failedEvidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime liveness failure evidence foundation proof passed.',
)
