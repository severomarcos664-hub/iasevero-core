import assert from 'node:assert/strict'

import type {
  GovernedPersistentRuntimeLaunchBoundary,
} from '../app/lib/runtime-execution-plane/runtime-persistent-launch-boundary'

import {
  recordGovernedRuntimeReadinessEvidence,
} from '../app/lib/runtime-execution-plane/runtime-readiness-evidence'

const boundary: GovernedPersistentRuntimeLaunchBoundary = {
  schemaVersion: 1,
  kind: 'iasevero-governed-persistent-runtime-launch-boundary',

  instanceId: 'instance-v287738-proof',
  releaseIdentity: 'v287.73.8-proof-release',
  authorizationRecordId: 'authorization-v287738-proof',
  processId: 424242,

  processIdentityVerified: true,
  persistentLaunchEligible: true,
  persistentLaunchPrepared: true,

  processSpawnedByBoundary: false,
  readinessGranted: false,
  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
}

const evidence = recordGovernedRuntimeReadinessEvidence({
  boundary,
  observedProcessId: 424242,
  observedHost: '127.0.0.1',
  observedPort: 3000,
  transportReachable: true,
  applicationResponsive: true,
})

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
    recordGovernedRuntimeReadinessEvidence({
      boundary,
      observedProcessId: 999999,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: true,
      applicationResponsive: true,
    }),
  /requires identity-bound endpoint observation/,
)

console.log({
  architecture:
    'persistent-launch-boundary -> identity-bound-readiness-evidence -> no-readiness-grant',
  probeEvidenceRecorded: evidence.probeEvidenceRecorded,
  transportReachable: evidence.transportReachable,
  applicationResponsive: evidence.applicationResponsive,
  readinessGranted: evidence.readinessGranted,
  runtimeAuthorityGranted: evidence.runtimeAuthorityGranted,
  networkAuthorityGranted: evidence.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime readiness evidence foundation proof passed.',
)
