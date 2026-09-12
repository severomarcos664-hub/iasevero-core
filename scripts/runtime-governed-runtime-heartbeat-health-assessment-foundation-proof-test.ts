import assert from 'node:assert/strict'

import type {
  GovernedRuntimeHeartbeatFreshnessAssessment,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-freshness-assessment'

import {
  assessGovernedRuntimeHeartbeatHealth,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-health-assessment'

const baseFreshness: GovernedRuntimeHeartbeatFreshnessAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-heartbeat-freshness-assessment',

  instanceId: 'instance-v2877326-proof',
  releaseIdentity: 'v287.73.26-proof-release',
  processId: 525252,

  heartbeatObservationVerified: true,
  processIdentityVerified: true,
  heartbeatFreshnessAssessed: true,

  heartbeatAgeMs: 5000,
  freshnessThresholdMs: 10000,
  heartbeatFreshness: 'fresh',

  healthDecisionMade: false,
  failureDecisionMade: false,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthy =
  assessGovernedRuntimeHeartbeatHealth(baseFreshness)

assert.equal(healthy.heartbeatFreshnessVerified, true)
assert.equal(healthy.healthAssessmentCompleted, true)
assert.equal(healthy.heartbeatHealth, 'healthy')

const degraded =
  assessGovernedRuntimeHeartbeatHealth({
    ...baseFreshness,
    heartbeatAgeMs: 15000,
    heartbeatFreshness: 'stale',
  })

assert.equal(degraded.heartbeatHealth, 'degraded')

assert.equal(degraded.failureDecisionMade, false)
assert.equal(degraded.recoveryDecisionMade, false)
assert.equal(degraded.restartAuthorized, false)
assert.equal(degraded.restartApplied, false)
assert.equal(degraded.deploymentApplied, false)
assert.equal(degraded.runtimeAuthorityGranted, false)
assert.equal(degraded.networkAuthorityGranted, false)

assert.throws(
  () =>
    assessGovernedRuntimeHeartbeatHealth({
      ...baseFreshness,
      failureDecisionMade: true as false,
    }),
  /requires zero inherited decision and execution authority/,
)

console.log({
  architecture:
    'heartbeat-freshness -> heartbeat-health-assessment -> healthy-or-degraded -> no-failure-decision',
  processId: healthy.processId,
  healthyStatus: healthy.heartbeatHealth,
  degradedStatus: degraded.heartbeatHealth,
  failureDecisionMade: degraded.failureDecisionMade,
  recoveryDecisionMade: degraded.recoveryDecisionMade,
  restartAuthorized: degraded.restartAuthorized,
  restartApplied: degraded.restartApplied,
  runtimeAuthorityGranted: degraded.runtimeAuthorityGranted,
  networkAuthorityGranted: degraded.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime heartbeat health assessment foundation proof passed.',
)
