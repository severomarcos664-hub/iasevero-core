import assert from 'node:assert/strict'

import type {
  GovernedRuntimeProcessIdentityRebinding,
} from '../app/lib/runtime-execution-plane/runtime-process-identity-binding'

import {
  createPostRestartRuntimeReadinessCandidate,
} from '../app/lib/runtime-execution-plane/runtime-readiness-candidate'

const rebinding: GovernedRuntimeProcessIdentityRebinding = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-process-identity-rebinding',

  instanceId: 'instance-v2877319-proof',
  releaseIdentity: 'v287.73.19-proof-release',
  restartAuthorizationRecordId:
    'restart-authorization-v2877319-proof',

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

assert.equal(candidate.source, 'post-restart-rebinding')
assert.equal(candidate.processId, 525252)
assert.equal(candidate.processIdentityVerified, true)
assert.equal(candidate.readinessEvaluationEligible, true)

assert.equal(candidate.readinessGranted, false)
assert.equal(candidate.livenessGranted, false)
assert.equal(candidate.deploymentApplied, false)
assert.equal(candidate.runtimeAuthorityGranted, false)
assert.equal(candidate.networkAuthorityGranted, false)

console.log({
  architecture:
    'process-identity-rebinding -> canonical-readiness-candidate -> readiness-revalidation-eligible',
  source: candidate.source,
  processId: candidate.processId,
  processIdentityVerified: candidate.processIdentityVerified,
  readinessEvaluationEligible:
    candidate.readinessEvaluationEligible,
  readinessGranted: candidate.readinessGranted,
  livenessGranted: candidate.livenessGranted,
  runtimeAuthorityGranted: candidate.runtimeAuthorityGranted,
  networkAuthorityGranted: candidate.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime readiness candidate foundation proof passed.',
)
