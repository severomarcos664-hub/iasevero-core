import assert from 'node:assert/strict'

import type {
  GovernedRuntimeReadinessCandidate,
} from '../app/lib/runtime-execution-plane/runtime-readiness-candidate'

import {
  recordGovernedRuntimeReadinessEvidenceFromCandidate,
} from '../app/lib/runtime-execution-plane/runtime-readiness-evidence'

const candidate: GovernedRuntimeReadinessCandidate = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-readiness-candidate',

  source: 'post-restart-rebinding',

  instanceId: 'instance-v2877320-proof',
  releaseIdentity: 'v287.73.20-proof-release',
  authorityRecordId: 'restart-authorization-v2877320-proof',
  processId: 525252,

  processIdentityVerified: true,
  readinessEvaluationEligible: true,

  readinessGranted: false,
  livenessGranted: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const evidence =
  recordGovernedRuntimeReadinessEvidenceFromCandidate({
    candidate,
    observedProcessId: 525252,
    observedHost: '127.0.0.1',
    observedPort: 3000,
    transportReachable: true,
    applicationResponsive: true,
  })

assert.equal(evidence.processId, 525252)
assert.equal(evidence.processIdentityVerified, true)
assert.equal(evidence.endpointSpecificationVerified, true)
assert.equal(evidence.probeEvidenceRecorded, true)

assert.equal(evidence.transportReachable, true)
assert.equal(evidence.applicationResponsive, true)

assert.equal(evidence.readinessGranted, false)
assert.equal(evidence.livenessGranted, false)
assert.equal(evidence.restartAuthorized, false)
assert.equal(evidence.runtimeAuthorityGranted, false)
assert.equal(evidence.networkAuthorityGranted, false)

assert.throws(
  () =>
    recordGovernedRuntimeReadinessEvidenceFromCandidate({
      candidate,
      observedProcessId: 424242,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: true,
      applicationResponsive: true,
    }),
  /requires identity-bound candidate observation/,
)

console.log({
  architecture:
    'readiness-candidate -> canonical-readiness-evidence -> existing-assessment-chain',
  source: candidate.source,
  processId: evidence.processId,
  probeEvidenceRecorded: evidence.probeEvidenceRecorded,
  transportReachable: evidence.transportReachable,
  applicationResponsive: evidence.applicationResponsive,
  readinessGranted: evidence.readinessGranted,
  livenessGranted: evidence.livenessGranted,
  runtimeAuthorityGranted: evidence.runtimeAuthorityGranted,
  networkAuthorityGranted: evidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime readiness candidate integration foundation proof passed.',
)
