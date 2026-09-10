import assert from 'node:assert/strict'

import type {
  GovernedRuntimeReadinessDecision,
} from '../app/lib/runtime-execution-plane/runtime-readiness-decision'

import {
  recordGovernedRuntimeLivenessEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-evidence'

const readinessDecision: GovernedRuntimeReadinessDecision = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-readiness-decision',

  instanceId: 'instance-v2877311-proof',
  releaseIdentity: 'v287.73.11-proof-release',
  authorizationRecordId: 'authorization-v2877311-proof',
  processId: 424242,

  readinessAssessmentVerified: true,
  readinessDecisionMade: true,
  readinessGranted: true,

  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const evidence = recordGovernedRuntimeLivenessEvidence({
  readinessDecision,
  observedProcessId: 424242,
  observationSequence: 1,
  processResponsive: true,
  eventLoopResponsive: true,
})

assert.equal(evidence.readinessDecisionVerified, true)
assert.equal(evidence.processIdentityVerified, true)
assert.equal(evidence.livenessEvidenceRecorded, true)
assert.equal(evidence.observationSequence, 1)
assert.equal(evidence.processResponsive, true)
assert.equal(evidence.eventLoopResponsive, true)

assert.equal(evidence.readinessGranted, true)
assert.equal(evidence.livenessGranted, false)
assert.equal(evidence.restartAuthorized, false)
assert.equal(evidence.runtimeAuthorityGranted, false)
assert.equal(evidence.networkAuthorityGranted, false)

assert.throws(
  () =>
    recordGovernedRuntimeLivenessEvidence({
      readinessDecision,
      observedProcessId: 999999,
      observationSequence: 1,
      processResponsive: true,
      eventLoopResponsive: true,
    }),
  /requires identity-bound ordered observation/,
)

console.log({
  architecture:
    'readiness-decision -> identity-bound-liveness-evidence -> no-liveness-grant',
  readinessDecisionVerified: evidence.readinessDecisionVerified,
  livenessEvidenceRecorded: evidence.livenessEvidenceRecorded,
  observationSequence: evidence.observationSequence,
  processResponsive: evidence.processResponsive,
  eventLoopResponsive: evidence.eventLoopResponsive,
  readinessGranted: evidence.readinessGranted,
  livenessGranted: evidence.livenessGranted,
  restartAuthorized: evidence.restartAuthorized,
  runtimeAuthorityGranted: evidence.runtimeAuthorityGranted,
  networkAuthorityGranted: evidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime liveness evidence foundation proof passed.',
)
