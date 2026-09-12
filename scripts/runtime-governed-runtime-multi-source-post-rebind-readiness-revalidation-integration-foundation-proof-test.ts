import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-process-identity-rebinding-integration'

import {
  revalidateGovernedRuntimeMultiSourcePostRebindReadiness,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-rebind-readiness-revalidation-integration'

const rebinding:
  GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-rebinding',

  instanceId: 'instance-v2877336-proof',
  releaseIdentity: 'v287.73.36-proof-release',

  restartAuthorizationRecordId:
    'restart-authorization-v2877336-proof',

  previousProcessId: 525252,
  processId: 626262,

  restartExecutionVerified: true,
  previousProcessIdVerified: true,
  replacementProcessIdVerified: true,
  processIdentityRebound: true,

  readinessGranted: false,
  livenessGranted: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceRestartExecutionVerified: true,
  multiSourceAuthorizationVerified: true,
  authorizationAdapterVerified: true,

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877336-proof',
}

const ready =
  revalidateGovernedRuntimeMultiSourcePostRebindReadiness({
    rebinding,

    probe: {
      observedProcessId: 626262,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: true,
      applicationResponsive: true,
    },
  })

assert.equal(
  ready.multiSourceProcessIdentityRebindingVerified,
  true,
)

assert.equal(
  ready.canonicalReadinessCandidateVerified,
  true,
)

assert.equal(
  ready.canonicalReadinessEvidenceVerified,
  true,
)

assert.equal(
  ready.canonicalReadinessAssessmentVerified,
  true,
)

assert.equal(
  ready.canonicalReadinessDecisionVerified,
  true,
)

assert.equal(ready.processId, 626262)
assert.equal(ready.readinessDecisionMade, true)
assert.equal(ready.readinessGranted, true)

assert.equal(ready.livenessGranted, false)
assert.equal(ready.restartAuthorized, false)
assert.equal(ready.deploymentApplied, false)
assert.equal(ready.runtimeAuthorityGranted, false)
assert.equal(ready.networkAuthorityGranted, false)

assert.equal(
  ready.sourceLivenessAuthorizationRecordId,
  rebinding.sourceLivenessAuthorizationRecordId,
)

const notReady =
  revalidateGovernedRuntimeMultiSourcePostRebindReadiness({
    rebinding,

    probe: {
      observedProcessId: 626262,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: false,
      applicationResponsive: false,
    },
  })

assert.equal(notReady.readinessDecisionMade, true)
assert.equal(notReady.readinessGranted, false)
assert.equal(notReady.livenessGranted, false)

console.log({
  architecture:
    'multi-source-process-identity-rebinding -> canonical-readiness-candidate -> evidence -> assessment -> decision -> readiness-only',

  processId:
    ready.processId,

  multiSourceProcessIdentityRebindingVerified:
    ready.multiSourceProcessIdentityRebindingVerified,

  canonicalReadinessCandidateVerified:
    ready.canonicalReadinessCandidateVerified,

  canonicalReadinessEvidenceVerified:
    ready.canonicalReadinessEvidenceVerified,

  canonicalReadinessAssessmentVerified:
    ready.canonicalReadinessAssessmentVerified,

  canonicalReadinessDecisionVerified:
    ready.canonicalReadinessDecisionVerified,

  readinessGranted:
    ready.readinessGranted,

  notReadyGranted:
    notReady.readinessGranted,

  provenancePreserved:
    ready.sourceLivenessAuthorizationRecordId ===
    rebinding.sourceLivenessAuthorizationRecordId,

  livenessGranted:
    ready.livenessGranted,

  restartAuthorized:
    ready.restartAuthorized,

  runtimeAuthorityGranted:
    ready.runtimeAuthorityGranted,

  networkAuthorityGranted:
    ready.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source post-rebind readiness revalidation integration foundation proof passed.',
)
