import assert from 'node:assert/strict'

import type {
  GovernedRuntimeLivenessDecision,
} from '../app/lib/runtime-execution-plane/runtime-liveness-decision'

import {
  assessGovernedRuntimeFailure,
} from '../app/lib/runtime-execution-plane/runtime-failure-assessment'

const healthyDecision: GovernedRuntimeLivenessDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-decision',

  instanceId: 'instance-v2877314-proof',
  releaseIdentity: 'v287.73.14-proof-release',
  authorizationRecordId: 'authorization-v2877314-proof',
  processId: 424242,

  livenessAssessmentVerified: true,
  livenessDecisionMade: true,

  readinessGranted: true,
  livenessGranted: true,

  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const healthy = assessGovernedRuntimeFailure(healthyDecision)

assert.equal(healthy.livenessDecisionVerified, true)
assert.equal(healthy.failureAssessmentCompleted, true)
assert.equal(healthy.failureDetected, false)
assert.equal(healthy.failureClassified, true)
assert.equal(healthy.failureClassification, 'none')
assert.equal(healthy.recoveryRequired, false)

const failed = assessGovernedRuntimeFailure({
  ...healthyDecision,
  livenessGranted: false,
})

assert.equal(failed.failureDetected, true)
assert.equal(failed.failureClassified, true)
assert.equal(failed.failureClassification, 'liveness-failure')
assert.equal(failed.recoveryRequired, true)

assert.equal(failed.restartAuthorized, false)
assert.equal(failed.restartApplied, false)
assert.equal(failed.deploymentApplied, false)
assert.equal(failed.runtimeAuthorityGranted, false)
assert.equal(failed.networkAuthorityGranted, false)

console.log({
  architecture:
    'liveness-decision -> failure-assessment -> recovery-required-without-restart-authority',
  failureAssessmentCompleted: failed.failureAssessmentCompleted,
  failureDetected: failed.failureDetected,
  failureClassification: failed.failureClassification,
  recoveryRequired: failed.recoveryRequired,
  restartAuthorized: failed.restartAuthorized,
  restartApplied: failed.restartApplied,
  runtimeAuthorityGranted: failed.runtimeAuthorityGranted,
  networkAuthorityGranted: failed.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime failure assessment foundation proof passed.',
)
