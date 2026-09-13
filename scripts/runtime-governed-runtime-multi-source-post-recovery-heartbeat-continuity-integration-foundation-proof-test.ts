import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-recovery-completion-integration'

import {
  recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-recovery-heartbeat-continuity-integration'

const recoveryCompletion:
  GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-recovery-completion',

  instanceId: 'instance-v2877339-proof',
  releaseIdentity: 'v287.73.39-proof-release',

  restartAuthorizationRecordId:
    'restart-authorization-v2877339-proof',

  previousProcessId: 525252,
  processId: 626262,

  restartExecutionVerified: true,
  processIdentityRebindingVerified: true,

  readinessRestored: true,
  livenessRestored: true,

  recoveryCompleted: true,
  operationalHealthRestored: true,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceRecoveryChainVerified: true,
  multiSourceRestartExecutionVerified: true,
  multiSourceIdentityRebindingVerified: true,
  multiSourceLivenessRevalidationVerified: true,

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877339-proof',
}

const observation =
  recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat({
    recoveryCompletion,

    heartbeat: {
      observedProcessId: 626262,
      heartbeatAt: '2026-09-10T22:20:05.000Z',
      observedAt: '2026-09-10T22:20:10.000Z',
    },
  })

assert.equal(
  observation.multiSourceRecoveryCompletionVerified,
  true,
)

assert.equal(
  observation.heartbeatContinuityRestored,
  true,
)

assert.equal(
  observation.recoveryCompletionVerified,
  true,
)

assert.equal(
  observation.processIdentityVerified,
  true,
)

assert.equal(
  observation.heartbeatObservationRecorded,
  true,
)

assert.equal(observation.processId, 626262)

assert.equal(
  observation.heartbeatFreshnessAssessed,
  false,
)

assert.equal(
  observation.healthDecisionMade,
  false,
)

assert.equal(
  observation.failureDecisionMade,
  false,
)

assert.equal(
  observation.restartAuthorized,
  false,
)

assert.equal(
  observation.runtimeAuthorityGranted,
  false,
)

assert.equal(
  observation.networkAuthorityGranted,
  false,
)

assert.equal(
  observation.sourceLivenessAuthorizationRecordId,
  recoveryCompletion.sourceLivenessAuthorizationRecordId,
)

assert.throws(
  () =>
    recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat({
      recoveryCompletion,

      heartbeat: {
        observedProcessId: 737373,
        heartbeatAt: '2026-09-10T22:20:05.000Z',
        observedAt: '2026-09-10T22:20:10.000Z',
      },
    }),
  /requires recovered process identity/,
)

console.log({
  architecture:
    'multi-source-recovery-completion -> canonical-heartbeat-observation -> monitoring-continuity-only',

  processId:
    observation.processId,

  multiSourceRecoveryCompletionVerified:
    observation.multiSourceRecoveryCompletionVerified,

  recoveryCompleted:
    recoveryCompletion.recoveryCompleted,

  operationalHealthRestored:
    recoveryCompletion.operationalHealthRestored,

  heartbeatContinuityRestored:
    observation.heartbeatContinuityRestored,

  heartbeatObservationRecorded:
    observation.heartbeatObservationRecorded,

  provenancePreserved:
    observation.sourceLivenessAuthorizationRecordId ===
    recoveryCompletion.sourceLivenessAuthorizationRecordId,

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
  'Runtime governed multi-source post-recovery heartbeat continuity integration foundation proof passed.',
)
