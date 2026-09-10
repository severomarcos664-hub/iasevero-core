import assert from 'node:assert/strict'

import type {
  GovernedRuntimeLivenessEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-evidence'

import {
  assessGovernedRuntimeLiveness,
} from '../app/lib/runtime-execution-plane/runtime-liveness-assessment'

const liveEvidence: GovernedRuntimeLivenessEvidence = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-liveness-evidence',

  instanceId: 'instance-v2877312-proof',
  releaseIdentity: 'v287.73.12-proof-release',
  authorizationRecordId: 'authorization-v2877312-proof',
  processId: 424242,

  readinessDecisionVerified: true,
  processIdentityVerified: true,
  livenessEvidenceRecorded: true,

  observationSequence: 1,
  processResponsive: true,
  eventLoopResponsive: true,

  readinessGranted: true,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const liveAssessment = assessGovernedRuntimeLiveness(liveEvidence)

assert.equal(liveAssessment.livenessEvidenceVerified, true)
assert.equal(liveAssessment.assessmentCompleted, true)
assert.equal(liveAssessment.livenessCriteriaSatisfied, true)

assert.equal(liveAssessment.readinessGranted, true)
assert.equal(liveAssessment.livenessGranted, false)
assert.equal(liveAssessment.restartAuthorized, false)
assert.equal(liveAssessment.runtimeAuthorityGranted, false)
assert.equal(liveAssessment.networkAuthorityGranted, false)

const failedAssessment = assessGovernedRuntimeLiveness({
  ...liveEvidence,
  eventLoopResponsive: false,
})

assert.equal(failedAssessment.assessmentCompleted, true)
assert.equal(failedAssessment.livenessCriteriaSatisfied, false)
assert.equal(failedAssessment.livenessGranted, false)
assert.equal(failedAssessment.restartAuthorized, false)

console.log({
  architecture:
    'liveness-evidence -> liveness-assessment -> no-liveness-decision',
  livenessEvidenceVerified: liveAssessment.livenessEvidenceVerified,
  assessmentCompleted: liveAssessment.assessmentCompleted,
  livenessCriteriaSatisfied: liveAssessment.livenessCriteriaSatisfied,
  readinessGranted: liveAssessment.readinessGranted,
  livenessGranted: liveAssessment.livenessGranted,
  restartAuthorized: liveAssessment.restartAuthorized,
  runtimeAuthorityGranted: liveAssessment.runtimeAuthorityGranted,
  networkAuthorityGranted: liveAssessment.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime liveness assessment foundation proof passed.',
)
