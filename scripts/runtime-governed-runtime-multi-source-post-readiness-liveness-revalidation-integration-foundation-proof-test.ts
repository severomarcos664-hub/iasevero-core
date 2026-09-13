import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-rebind-readiness-revalidation-integration'

import {
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-readiness-liveness-revalidation-integration'

const readiness:
  GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-readiness-decision',

  instanceId: 'instance-v2877337-proof',
  releaseIdentity: 'v287.73.37-proof-release',
  authorizationRecordId:
    'restart-authorization-v2877337-proof',

  processId: 626262,

  readinessAssessmentVerified: true,
  readinessDecisionMade: true,
  readinessGranted: true,

  livenessGranted: false,
  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceProcessIdentityRebindingVerified: true,
  canonicalReadinessCandidateVerified: true,
  canonicalReadinessEvidenceVerified: true,
  canonicalReadinessAssessmentVerified: true,
  canonicalReadinessDecisionVerified: true,

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877337-proof',
}

const live =
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness({
    readiness,

    observation: {
      observedProcessId: 626262,
      observationSequence: 1,
      processResponsive: true,
      eventLoopResponsive: true,
    },
  })

assert.equal(
  live.multiSourceReadinessRevalidationVerified,
  true,
)

assert.equal(
  live.canonicalLivenessEvidenceVerified,
  true,
)

assert.equal(
  live.canonicalLivenessAssessmentVerified,
  true,
)

assert.equal(
  live.canonicalLivenessDecisionVerified,
  true,
)

assert.equal(live.processId, 626262)

assert.equal(
  live.livenessDecisionMade,
  true,
)

assert.equal(
  live.readinessGranted,
  true,
)

assert.equal(
  live.livenessGranted,
  true,
)

assert.equal(
  live.restartAuthorized,
  false,
)

assert.equal(
  live.deploymentApplied,
  false,
)

assert.equal(
  live.runtimeAuthorityGranted,
  false,
)

assert.equal(
  live.networkAuthorityGranted,
  false,
)

assert.equal(
  live.sourceLivenessAuthorizationRecordId,
  readiness.sourceLivenessAuthorizationRecordId,
)

const notLive =
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness({
    readiness,

    observation: {
      observedProcessId: 626262,
      observationSequence: 2,
      processResponsive: false,
      eventLoopResponsive: false,
    },
  })

assert.equal(
  notLive.livenessDecisionMade,
  true,
)

assert.equal(
  notLive.livenessGranted,
  false,
)

console.log({
  architecture:
    'multi-source-readiness-revalidation -> canonical-liveness-evidence -> assessment -> decision -> operational-health-restored',

  processId:
    live.processId,

  multiSourceReadinessRevalidationVerified:
    live.multiSourceReadinessRevalidationVerified,

  canonicalLivenessEvidenceVerified:
    live.canonicalLivenessEvidenceVerified,

  canonicalLivenessAssessmentVerified:
    live.canonicalLivenessAssessmentVerified,

  canonicalLivenessDecisionVerified:
    live.canonicalLivenessDecisionVerified,

  readinessGranted:
    live.readinessGranted,

  livenessGranted:
    live.livenessGranted,

  notLiveGranted:
    notLive.livenessGranted,

  provenancePreserved:
    live.sourceLivenessAuthorizationRecordId ===
    readiness.sourceLivenessAuthorizationRecordId,

  restartAuthorized:
    live.restartAuthorized,

  runtimeAuthorityGranted:
    live.runtimeAuthorityGranted,

  networkAuthorityGranted:
    live.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source post-readiness liveness revalidation integration foundation proof passed.',
)
