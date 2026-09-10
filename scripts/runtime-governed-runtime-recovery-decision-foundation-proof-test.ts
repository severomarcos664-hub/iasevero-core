import assert from 'node:assert/strict'

import type {
  GovernedRuntimeFailureAssessment,
} from '../app/lib/runtime-execution-plane/runtime-failure-assessment'

import {
  decideGovernedRuntimeRecovery,
} from '../app/lib/runtime-execution-plane/runtime-recovery-decision'

const failedAssessment: GovernedRuntimeFailureAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-failure-assessment',

  instanceId: 'instance-v2877315-proof',
  releaseIdentity: 'v287.73.15-proof-release',
  authorizationRecordId: 'authorization-v2877315-proof',
  processId: 424242,

  livenessDecisionVerified: true,
  failureAssessmentCompleted: true,

  failureDetected: true,
  failureClassified: true,
  failureClassification: 'liveness-failure',
  recoveryRequired: true,

  restartAuthorized: false,
  restartApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const approved = decideGovernedRuntimeRecovery(failedAssessment)

assert.equal(approved.failureAssessmentVerified, true)
assert.equal(approved.recoveryDecisionMade, true)
assert.equal(approved.recoveryRequired, true)
assert.equal(approved.recoveryApproved, true)

assert.equal(approved.restartAuthorized, false)
assert.equal(approved.restartApplied, false)
assert.equal(approved.deploymentApplied, false)
assert.equal(approved.runtimeAuthorityGranted, false)
assert.equal(approved.networkAuthorityGranted, false)

const healthyDecision = decideGovernedRuntimeRecovery({
  ...failedAssessment,
  failureDetected: false,
  failureClassification: 'none',
  recoveryRequired: false,
})

assert.equal(healthyDecision.recoveryDecisionMade, true)
assert.equal(healthyDecision.recoveryRequired, false)
assert.equal(healthyDecision.recoveryApproved, false)
assert.equal(healthyDecision.restartAuthorized, false)

console.log({
  architecture:
    'failure-assessment -> recovery-decision -> no-restart-authorization',
  failureAssessmentVerified: approved.failureAssessmentVerified,
  recoveryDecisionMade: approved.recoveryDecisionMade,
  recoveryRequired: approved.recoveryRequired,
  recoveryApproved: approved.recoveryApproved,
  restartAuthorized: approved.restartAuthorized,
  restartApplied: approved.restartApplied,
  runtimeAuthorityGranted: approved.runtimeAuthorityGranted,
  networkAuthorityGranted: approved.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime recovery decision foundation proof passed.',
)
