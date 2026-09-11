import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRestartExecutionResult,
} from '../app/lib/runtime-execution-plane/runtime-restart-execution-boundary'

import type {
  GovernedRuntimeProcessIdentityRebinding,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

import type {
  GovernedRuntimeLivenessDecision,
} from '../app/lib/runtime-execution-plane/runtime-liveness-decision'

import {
  completeGovernedRuntimeRecovery,
} from '../app/lib/runtime-execution-plane/runtime-recovery-completion'

const restartExecution: GovernedRuntimeRestartExecutionResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-restart-execution-result',

  instanceId: 'instance-v2877323-proof',
  releaseIdentity: 'v287.73.23-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877323-proof',

  previousProcessId: 424242,
  newProcessId: 525252,

  restartAuthorizationVerified: true,
  restartExecutionPrepared: true,
  restartApplied: true,

  processIdentityRebindingRequired: true,
  readinessGranted: false,
  livenessGranted: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const identityRebinding: GovernedRuntimeProcessIdentityRebinding = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-rebinding',

  instanceId: restartExecution.instanceId,
  releaseIdentity: restartExecution.releaseIdentity,
  restartAuthorizationRecordId:
    restartExecution.restartAuthorizationRecordId,

  previousProcessId: 424242,
  processId: 525252,

  restartExecutionVerified: true,
  previousProcessIdVerified: true,
  replacementProcessIdVerified: true,
  processIdentityRebound: true,

  readinessGranted: false,
  livenessGranted: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const livenessDecision: GovernedRuntimeLivenessDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-decision',

  instanceId: restartExecution.instanceId,
  releaseIdentity: restartExecution.releaseIdentity,
  authorizationRecordId:
    restartExecution.restartAuthorizationRecordId,
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

const completion = completeGovernedRuntimeRecovery({
  restartExecution,
  identityRebinding,
  livenessDecision,
})

assert.equal(completion.previousProcessId, 424242)
assert.equal(completion.processId, 525252)
assert.equal(completion.restartExecutionVerified, true)
assert.equal(completion.processIdentityRebindingVerified, true)
assert.equal(completion.readinessRestored, true)
assert.equal(completion.livenessRestored, true)
assert.equal(completion.recoveryCompleted, true)
assert.equal(completion.operationalHealthRestored, true)

assert.equal(completion.deploymentApplied, false)
assert.equal(completion.runtimeAuthorityGranted, false)
assert.equal(completion.networkAuthorityGranted, false)

assert.throws(
  () =>
    completeGovernedRuntimeRecovery({
      restartExecution,
      identityRebinding: {
        ...identityRebinding,
        processId: 626262,
      },
      livenessDecision,
    }),
  /requires one continuous recovery identity chain/,
)

console.log({
  architecture:
    'restart-execution -> identity-rebinding -> readiness+liveness-restored -> recovery-completion',
  previousProcessId: completion.previousProcessId,
  processId: completion.processId,
  restartExecutionVerified: completion.restartExecutionVerified,
  processIdentityRebindingVerified:
    completion.processIdentityRebindingVerified,
  readinessRestored: completion.readinessRestored,
  livenessRestored: completion.livenessRestored,
  recoveryCompleted: completion.recoveryCompleted,
  operationalHealthRestored:
    completion.operationalHealthRestored,
  deploymentApplied: completion.deploymentApplied,
  runtimeAuthorityGranted:
    completion.runtimeAuthorityGranted,
  networkAuthorityGranted:
    completion.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime recovery completion foundation proof passed.',
)
