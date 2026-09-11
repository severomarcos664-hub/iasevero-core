import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRecoveryCompletion,
} from '../app/lib/runtime-execution-plane/runtime-recovery-completion'

import {
  recordGovernedRuntimeHeartbeatObservation,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-observation'

const recoveryCompletion: GovernedRuntimeRecoveryCompletion = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-recovery-completion',

  instanceId: 'instance-v2877324-proof',
  releaseIdentity: 'v287.73.24-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877324-proof',

  previousProcessId: 424242,
  processId: 525252,

  restartExecutionVerified: true,
  processIdentityRebindingVerified: true,
  readinessRestored: true,
  livenessRestored: true,

  recoveryCompleted: true,
  operationalHealthRestored: true,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const observation =
  recordGovernedRuntimeHeartbeatObservation({
    recoveryCompletion,
    observedProcessId: 525252,
    heartbeatAt: '2026-09-10T22:20:00.000Z',
    observedAt: '2026-09-10T22:20:05.000Z',
  })

assert.equal(observation.recoveryCompletionVerified, true)
assert.equal(observation.processIdentityVerified, true)
assert.equal(observation.heartbeatObservationRecorded, true)

assert.equal(observation.processId, 525252)
assert.equal(observation.heartbeatFreshnessAssessed, false)
assert.equal(observation.healthDecisionMade, false)
assert.equal(observation.failureDecisionMade, false)

assert.equal(observation.restartAuthorized, false)
assert.equal(observation.restartApplied, false)
assert.equal(observation.deploymentApplied, false)
assert.equal(observation.runtimeAuthorityGranted, false)
assert.equal(observation.networkAuthorityGranted, false)

assert.throws(
  () =>
    recordGovernedRuntimeHeartbeatObservation({
      recoveryCompletion,
      observedProcessId: 424242,
      heartbeatAt: '2026-09-10T22:20:00.000Z',
      observedAt: '2026-09-10T22:20:05.000Z',
    }),
  /requires identity-bound process observation/,
)

assert.throws(
  () =>
    recordGovernedRuntimeHeartbeatObservation({
      recoveryCompletion,
      observedProcessId: 525252,
      heartbeatAt: '2026-09-10T22:21:00.000Z',
      observedAt: '2026-09-10T22:20:05.000Z',
    }),
  /rejects future heartbeat timestamps/,
)

console.log({
  architecture:
    'recovery-completion -> identity-bound-heartbeat-observation -> no-health-decision',
  processId: observation.processId,
  recoveryCompletionVerified:
    observation.recoveryCompletionVerified,
  processIdentityVerified:
    observation.processIdentityVerified,
  heartbeatObservationRecorded:
    observation.heartbeatObservationRecorded,
  heartbeatFreshnessAssessed:
    observation.heartbeatFreshnessAssessed,
  healthDecisionMade:
    observation.healthDecisionMade,
  failureDecisionMade:
    observation.failureDecisionMade,
  restartAuthorized:
    observation.restartAuthorized,
  runtimeAuthorityGranted:
    observation.runtimeAuthorityGranted,
  networkAuthorityGranted:
    observation.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime heartbeat observation foundation proof passed.',
)
