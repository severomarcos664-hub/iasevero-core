import assert from 'node:assert/strict'

import type {
  GovernedRuntimeReadinessEvidence,
} from '../app/lib/runtime-execution-plane/runtime-readiness-evidence'

import {
  assessGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-readiness-assessment'

const readyEvidence: GovernedRuntimeReadinessEvidence = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-readiness-evidence',

  instanceId: 'instance-v287739-proof',
  releaseIdentity: 'v287.73.9-proof-release',
  authorizationRecordId: 'authorization-v287739-proof',
  processId: 424242,

  processIdentityVerified: true,
  endpointSpecificationVerified: true,
  probeEvidenceRecorded: true,

  transportReachable: true,
  applicationResponsive: true,

  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const readyAssessment = assessGovernedRuntimeReadiness(readyEvidence)

assert.equal(readyAssessment.readinessEvidenceVerified, true)
assert.equal(readyAssessment.assessmentCompleted, true)
assert.equal(readyAssessment.readinessCriteriaSatisfied, true)

assert.equal(readyAssessment.readinessGranted, false)
assert.equal(readyAssessment.livenessGranted, false)
assert.equal(readyAssessment.restartAuthorized, false)
assert.equal(readyAssessment.runtimeAuthorityGranted, false)
assert.equal(readyAssessment.networkAuthorityGranted, false)

const notReadyAssessment = assessGovernedRuntimeReadiness({
  ...readyEvidence,
  applicationResponsive: false,
})

assert.equal(notReadyAssessment.assessmentCompleted, true)
assert.equal(notReadyAssessment.readinessCriteriaSatisfied, false)
assert.equal(notReadyAssessment.readinessGranted, false)

console.log({
  architecture:
    'readiness-evidence -> readiness-assessment -> no-readiness-decision',
  readinessEvidenceVerified: readyAssessment.readinessEvidenceVerified,
  assessmentCompleted: readyAssessment.assessmentCompleted,
  readinessCriteriaSatisfied: readyAssessment.readinessCriteriaSatisfied,
  readinessGranted: readyAssessment.readinessGranted,
  runtimeAuthorityGranted: readyAssessment.runtimeAuthorityGranted,
  networkAuthorityGranted: readyAssessment.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime readiness assessment foundation proof passed.',
)
