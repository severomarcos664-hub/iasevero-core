import assert from 'node:assert/strict'

import type {
  GovernedRuntimeProcessIdentityRebinding,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

import {
  createPostRestartRuntimeReadinessCandidate,
} from '../app/lib/runtime-execution-plane/runtime-readiness-candidate'

import {
  recordGovernedRuntimeReadinessEvidenceFromCandidate,
} from '../app/lib/runtime-execution-plane/runtime-readiness-evidence'

import {
  assessGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-readiness-assessment'

import {
  decideGovernedRuntimeReadiness,
} from '../app/lib/runtime-execution-plane/runtime-readiness-decision'

const rebinding: GovernedRuntimeProcessIdentityRebinding = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-rebinding',

  instanceId: 'instance-v2877321-proof',
  releaseIdentity: 'v287.73.21-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877321-proof',

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

const candidate =
  createPostRestartRuntimeReadinessCandidate(rebinding)

const evidence =
  recordGovernedRuntimeReadinessEvidenceFromCandidate({
    candidate,
    observedProcessId: 525252,
    observedHost: '127.0.0.1',
    observedPort: 3000,
    transportReachable: true,
    applicationResponsive: true,
  })

const assessment =
  assessGovernedRuntimeReadiness(evidence)

const decision =
  decideGovernedRuntimeReadiness(assessment)

assert.equal(candidate.source, 'post-restart-rebinding')
assert.equal(candidate.processId, 525252)

assert.equal(evidence.processIdentityVerified, true)
assert.equal(evidence.probeEvidenceRecorded, true)
assert.equal(evidence.transportReachable, true)
assert.equal(evidence.applicationResponsive, true)

assert.equal(assessment.readinessEvidenceVerified, true)
assert.equal(assessment.assessmentCompleted, true)
assert.equal(assessment.readinessCriteriaSatisfied, true)

assert.equal(decision.readinessAssessmentVerified, true)
assert.equal(decision.readinessDecisionMade, true)
assert.equal(decision.readinessGranted, true)

assert.equal(decision.livenessGranted, false)
assert.equal(decision.restartAuthorized, false)
assert.equal(decision.deploymentApplied, false)
assert.equal(decision.runtimeAuthorityGranted, false)
assert.equal(decision.networkAuthorityGranted, false)

console.log({
  architecture:
    'restart-rebinding -> readiness-candidate -> canonical-evidence -> assessment -> decision -> readiness-restored',
  previousProcessId: rebinding.previousProcessId,
  replacementProcessId: decision.processId,
  processIdentityRebound: rebinding.processIdentityRebound,
  probeEvidenceRecorded: evidence.probeEvidenceRecorded,
  readinessCriteriaSatisfied:
    assessment.readinessCriteriaSatisfied,
  readinessDecisionMade: decision.readinessDecisionMade,
  readinessGranted: decision.readinessGranted,
  livenessGranted: decision.livenessGranted,
  restartAuthorized: decision.restartAuthorized,
  runtimeAuthorityGranted:
    decision.runtimeAuthorityGranted,
  networkAuthorityGranted:
    decision.networkAuthorityGranted,
})

console.log(
  'Runtime governed post-restart readiness revalidation proof passed.',
)
