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

import {
  recordGovernedRuntimeLivenessEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-evidence'

import {
  assessGovernedRuntimeLiveness,
} from '../app/lib/runtime-execution-plane/runtime-liveness-assessment'

import {
  decideGovernedRuntimeLiveness,
} from '../app/lib/runtime-execution-plane/runtime-liveness-decision'

const rebinding: GovernedRuntimeProcessIdentityRebinding = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-rebinding',

  instanceId: 'instance-v2877322-proof',
  releaseIdentity: 'v287.73.22-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877322-proof',

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

const readinessEvidence =
  recordGovernedRuntimeReadinessEvidenceFromCandidate({
    candidate,
    observedProcessId: 525252,
    observedHost: '127.0.0.1',
    observedPort: 3000,
    transportReachable: true,
    applicationResponsive: true,
  })

const readinessAssessment =
  assessGovernedRuntimeReadiness(readinessEvidence)

const readinessDecision =
  decideGovernedRuntimeReadiness(readinessAssessment)

assert.equal(readinessDecision.readinessGranted, true)
assert.equal(readinessDecision.livenessGranted, false)

const livenessEvidence =
  recordGovernedRuntimeLivenessEvidence({
    readinessDecision,
    observedProcessId: 525252,
    observationSequence: 1,
    processResponsive: true,
    eventLoopResponsive: true,
  })

const livenessAssessment =
  assessGovernedRuntimeLiveness(livenessEvidence)

const livenessDecision =
  decideGovernedRuntimeLiveness(livenessAssessment)

assert.equal(livenessEvidence.processId, 525252)
assert.equal(livenessEvidence.livenessEvidenceRecorded, true)
assert.equal(livenessEvidence.processResponsive, true)
assert.equal(livenessEvidence.eventLoopResponsive, true)

assert.equal(livenessAssessment.livenessEvidenceVerified, true)
assert.equal(livenessAssessment.assessmentCompleted, true)
assert.equal(livenessAssessment.livenessCriteriaSatisfied, true)

assert.equal(livenessDecision.livenessAssessmentVerified, true)
assert.equal(livenessDecision.livenessDecisionMade, true)
assert.equal(livenessDecision.readinessGranted, true)
assert.equal(livenessDecision.livenessGranted, true)

assert.equal(livenessDecision.restartAuthorized, false)
assert.equal(livenessDecision.deploymentApplied, false)
assert.equal(livenessDecision.runtimeAuthorityGranted, false)
assert.equal(livenessDecision.networkAuthorityGranted, false)

console.log({
  architecture:
    'restart-rebinding -> readiness-revalidation -> liveness-evidence -> assessment -> decision -> operational-health-restored',
  previousProcessId: rebinding.previousProcessId,
  replacementProcessId: livenessDecision.processId,
  processIdentityRebound: rebinding.processIdentityRebound,
  readinessGranted: readinessDecision.readinessGranted,
  livenessEvidenceRecorded:
    livenessEvidence.livenessEvidenceRecorded,
  livenessCriteriaSatisfied:
    livenessAssessment.livenessCriteriaSatisfied,
  livenessDecisionMade:
    livenessDecision.livenessDecisionMade,
  livenessGranted: livenessDecision.livenessGranted,
  restartAuthorized: livenessDecision.restartAuthorized,
  deploymentApplied: livenessDecision.deploymentApplied,
  runtimeAuthorityGranted:
    livenessDecision.runtimeAuthorityGranted,
  networkAuthorityGranted:
    livenessDecision.networkAuthorityGranted,
})

console.log(
  'Runtime governed post-restart liveness revalidation proof passed.',
)
