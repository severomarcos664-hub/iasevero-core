import assert from 'node:assert/strict'

import type {
  GovernedRuntimeHeartbeatObservation,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-observation'

import {
  assessGovernedRuntimeHeartbeatFreshness,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-freshness-assessment'

const observation: GovernedRuntimeHeartbeatObservation = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-heartbeat-observation',

  instanceId: 'instance-v2877325-proof',
  releaseIdentity: 'v287.73.25-proof-release',
  processId: 525252,

  recoveryCompletionVerified: true,
  processIdentityVerified: true,
  heartbeatObservationRecorded: true,

  heartbeatAt: '2026-09-11T20:40:00.000Z',
  observedAt: '2026-09-11T20:40:05.000Z',

  heartbeatFreshnessAssessed: false,
  healthDecisionMade: false,
  failureDecisionMade: false,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const fresh = assessGovernedRuntimeHeartbeatFreshness({
  observation,
  freshnessThresholdMs: 10000,
})

assert.equal(fresh.heartbeatObservationVerified, true)
assert.equal(fresh.processIdentityVerified, true)
assert.equal(fresh.heartbeatFreshnessAssessed, true)
assert.equal(fresh.heartbeatAgeMs, 5000)
assert.equal(fresh.heartbeatFreshness, 'fresh')

const stale = assessGovernedRuntimeHeartbeatFreshness({
  observation: {
    ...observation,
    heartbeatAt: '2026-09-11T20:39:50.000Z',
  },
  freshnessThresholdMs: 10000,
})

assert.equal(stale.heartbeatAgeMs, 15000)
assert.equal(stale.heartbeatFreshness, 'stale')

assert.equal(stale.healthDecisionMade, false)
assert.equal(stale.failureDecisionMade, false)
assert.equal(stale.restartAuthorized, false)
assert.equal(stale.restartApplied, false)
assert.equal(stale.deploymentApplied, false)
assert.equal(stale.runtimeAuthorityGranted, false)
assert.equal(stale.networkAuthorityGranted, false)

assert.throws(
  () =>
    assessGovernedRuntimeHeartbeatFreshness({
      observation,
      freshnessThresholdMs: 0,
    }),
  /requires a positive integer freshness threshold/,
)

console.log({
  architecture:
    'identity-bound-heartbeat-observation -> freshness-assessment -> fresh-or-stale -> no-health-decision',
  processId: fresh.processId,
  freshHeartbeatAgeMs: fresh.heartbeatAgeMs,
  freshStatus: fresh.heartbeatFreshness,
  staleHeartbeatAgeMs: stale.heartbeatAgeMs,
  staleStatus: stale.heartbeatFreshness,
  healthDecisionMade: stale.healthDecisionMade,
  failureDecisionMade: stale.failureDecisionMade,
  restartAuthorized: stale.restartAuthorized,
  restartApplied: stale.restartApplied,
  runtimeAuthorityGranted: stale.runtimeAuthorityGranted,
  networkAuthorityGranted: stale.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime heartbeat freshness assessment foundation proof passed.',
)
