import assert from 'node:assert/strict'

import type {
  GovernedRuntimeLivenessAssessment,
} from '../app/lib/runtime-execution-plane/runtime-liveness-assessment'

import {
  decideGovernedRuntimeLiveness,
} from '../app/lib/runtime-execution-plane/runtime-liveness-decision'

const assessment: GovernedRuntimeLivenessAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-assessment',

  instanceId: 'instance-v2877313-proof',
  releaseIdentity: 'v287.73.13-proof-release',
  authorizationRecordId: 'authorization-v2877313-proof',
  processId: 424242,

  livenessEvidenceVerified: true,
  assessmentCompleted: true,
  livenessCriteriaSatisfied: true,

  readinessGranted: true,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const granted = decideGovernedRuntimeLiveness(assessment)

assert.equal(granted.livenessAssessmentVerified, true)
assert.equal(granted.livenessDecisionMade, true)
assert.equal(granted.readinessGranted, true)
assert.equal(granted.livenessGranted, true)

assert.equal(granted.restartAuthorized, false)
assert.equal(granted.deploymentApplied, false)
assert.equal(granted.runtimeAuthorityGranted, false)
assert.equal(granted.networkAuthorityGranted, false)

const denied = decideGovernedRuntimeLiveness({
  ...assessment,
  livenessCriteriaSatisfied: false,
})

assert.equal(denied.livenessDecisionMade, true)
assert.equal(denied.readinessGranted, true)
assert.equal(denied.livenessGranted, false)
assert.equal(denied.restartAuthorized, false)

console.log({
  architecture:
    'liveness-assessment -> governed-liveness-decision -> bounded-liveness-grant',
  livenessAssessmentVerified: granted.livenessAssessmentVerified,
  livenessDecisionMade: granted.livenessDecisionMade,
  readinessGranted: granted.readinessGranted,
  livenessGranted: granted.livenessGranted,
  restartAuthorized: granted.restartAuthorized,
  deploymentApplied: granted.deploymentApplied,
  runtimeAuthorityGranted: granted.runtimeAuthorityGranted,
  networkAuthorityGranted: granted.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime liveness decision foundation proof passed.',
)
