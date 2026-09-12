import assert from 'node:assert/strict'

import type {
  GovernedRuntimeHeartbeatHealthAssessment,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-health-assessment'

import {
  recordGovernedRuntimeHeartbeatFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-failure-evidence'

const baseAssessment: GovernedRuntimeHeartbeatHealthAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-heartbeat-health-assessment',

  instanceId: 'instance-v2877327-proof',
  releaseIdentity: 'v287.73.27-proof-release',
  processId: 525252,

  heartbeatFreshnessVerified: true,
  healthAssessmentCompleted: true,

  heartbeatHealth: 'healthy',

  failureDecisionMade: false,
  recoveryDecisionMade: false,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthyEvidence =
  recordGovernedRuntimeHeartbeatFailureEvidence(
    baseAssessment,
  )

assert.equal(
  healthyEvidence.evidenceSource,
  'heartbeat-health-assessment',
)
assert.equal(
  healthyEvidence.heartbeatHealthAssessmentVerified,
  true,
)
assert.equal(healthyEvidence.failureEvidenceRecorded, true)
assert.equal(healthyEvidence.heartbeatDegraded, false)
assert.equal(healthyEvidence.failureSignalObserved, false)

const degradedEvidence =
  recordGovernedRuntimeHeartbeatFailureEvidence({
    ...baseAssessment,
    heartbeatHealth: 'degraded',
  })

assert.equal(degradedEvidence.heartbeatDegraded, true)
assert.equal(degradedEvidence.failureSignalObserved, true)

assert.equal(degradedEvidence.failureDecisionMade, false)
assert.equal(degradedEvidence.recoveryDecisionMade, false)
assert.equal(degradedEvidence.restartAuthorized, false)
assert.equal(degradedEvidence.restartApplied, false)
assert.equal(degradedEvidence.deploymentApplied, false)
assert.equal(degradedEvidence.runtimeAuthorityGranted, false)
assert.equal(degradedEvidence.networkAuthorityGranted, false)

assert.throws(
  () =>
    recordGovernedRuntimeHeartbeatFailureEvidence({
      ...baseAssessment,
      restartAuthorized: true as false,
    }),
  /requires zero inherited decision and execution authority/,
)

console.log({
  architecture:
    'heartbeat-health-assessment -> failure-evidence -> signal-only -> no-failure-decision',
  processId: degradedEvidence.processId,
  evidenceSource: degradedEvidence.evidenceSource,
  healthySignal:
    healthyEvidence.failureSignalObserved,
  degradedSignal:
    degradedEvidence.failureSignalObserved,
  failureDecisionMade:
    degradedEvidence.failureDecisionMade,
  recoveryDecisionMade:
    degradedEvidence.recoveryDecisionMade,
  restartAuthorized:
    degradedEvidence.restartAuthorized,
  restartApplied:
    degradedEvidence.restartApplied,
  runtimeAuthorityGranted:
    degradedEvidence.runtimeAuthorityGranted,
  networkAuthorityGranted:
    degradedEvidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime heartbeat failure evidence foundation proof passed.',
)
