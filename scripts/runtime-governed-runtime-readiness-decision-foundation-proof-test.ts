import assert from 'node:assert/strict'

import type {
  GovernedRuntimeReadinessAssessment,
} from '../app/lib/runtime-execution-plane/runtime-readiness-assessment'

import {
  decideGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-readiness-decision'

const assessment: GovernedRuntimeReadinessAssessment = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-readiness-assessment',

  instanceId: 'instance-v2877310-proof',
  releaseIdentity: 'v287.73.10-proof-release',
  authorizationRecordId: 'authorization-v2877310-proof',
  processId: 424242,

  readinessEvidenceVerified: true,
  assessmentCompleted: true,
  readinessCriteriaSatisfied: true,

  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const granted = decideGovernedRuntimeReadiness(assessment)

assert.equal(granted.readinessAssessmentVerified, true)
assert.equal(granted.readinessDecisionMade, true)
assert.equal(granted.readinessGranted, true)

assert.equal(granted.livenessGranted, false)
assert.equal(granted.restartAuthorized, false)
assert.equal(granted.deploymentApplied, false)
assert.equal(granted.runtimeAuthorityGranted, false)
assert.equal(granted.networkAuthorityGranted, false)

const denied = decideGovernedRuntimeReadiness({
  ...assessment,
  readinessCriteriaSatisfied: false,
})

assert.equal(denied.readinessDecisionMade, true)
assert.equal(denied.readinessGranted, false)

console.log({
  architecture:
    'readiness-assessment -> governed-readiness-decision -> bounded-readiness-grant',
  readinessAssessmentVerified: granted.readinessAssessmentVerified,
  readinessDecisionMade: granted.readinessDecisionMade,
  readinessGranted: granted.readinessGranted,
  livenessGranted: granted.livenessGranted,
  restartAuthorized: granted.restartAuthorized,
  runtimeAuthorityGranted: granted.runtimeAuthorityGranted,
  networkAuthorityGranted: granted.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime readiness decision foundation proof passed.',
)
