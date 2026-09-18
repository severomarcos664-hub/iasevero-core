import assert from 'node:assert/strict'

import { evaluateRuntimeGovernedSandboxAdmissionAuthorization } from '@/app/lib/runtime-core/runtime-governed-sandbox-admission-authorization'

const decision = evaluateRuntimeGovernedSandboxAdmissionAuthorization({
  providerId: 'sandbox-provider-proof',
  admissionRecordId: 'sandbox-admission-proof',
  authorizationRecordId: 'sandbox-admission-authorization-proof',
  providerAuthorityEvaluated: true,
  providerExecutionAllowed: true,
  sandboxContractEligible: true,
  authorizationGranted: true,
})

assert.equal(decision.admissionAuthorizationEvaluated, true)
assert.equal(decision.admissionAuthorizationEligible, true)
assert.equal(decision.admissionAuthorizationGranted, true)
assert.equal(decision.providerInvocation, false)
assert.equal(decision.sandboxExecutionApplied, false)
assert.equal(decision.networkAuthorityGranted, false)
assert.equal(decision.productionMutationApplied, false)
assert.equal(decision.selfPromotionApplied, false)

console.log('Runtime governed sandbox admission authorization foundation proof passed.')

const denied = evaluateRuntimeGovernedSandboxAdmissionAuthorization({
  providerId: 'sandbox-provider-proof',
  admissionRecordId: 'sandbox-admission-proof',
  authorizationRecordId: 'sandbox-admission-authorization-denied-proof',
  providerAuthorityEvaluated: true,
  providerExecutionAllowed: true,
  sandboxContractEligible: true,
  authorizationGranted: false,
})

assert.equal(denied.admissionAuthorizationEvaluated, true)
assert.equal(denied.admissionAuthorizationEligible, true)
assert.equal(denied.admissionAuthorizationGranted, false)
assert.equal(denied.providerInvocation, false)
assert.equal(denied.sandboxExecutionApplied, false)
assert.equal(denied.networkAuthorityGranted, false)
assert.equal(denied.productionMutationApplied, false)
assert.equal(denied.selfPromotionApplied, false)

const ineligible = evaluateRuntimeGovernedSandboxAdmissionAuthorization({
  providerId: 'sandbox-provider-proof',
  admissionRecordId: 'sandbox-admission-proof',
  authorizationRecordId: 'sandbox-admission-authorization-ineligible-proof',
  providerAuthorityEvaluated: true,
  providerExecutionAllowed: false,
  sandboxContractEligible: true,
  authorizationGranted: true,
})

assert.equal(ineligible.admissionAuthorizationEligible, false)
assert.equal(ineligible.admissionAuthorizationGranted, false)
assert.equal(ineligible.providerInvocation, false)
assert.equal(ineligible.sandboxExecutionApplied, false)

assert.throws(
  () =>
    evaluateRuntimeGovernedSandboxAdmissionAuthorization({
      providerId: ' ',
      admissionRecordId: 'sandbox-admission-proof',
      authorizationRecordId: 'sandbox-admission-authorization-invalid-proof',
      providerAuthorityEvaluated: true,
      providerExecutionAllowed: true,
      sandboxContractEligible: true,
      authorizationGranted: true,
    }),
  /requires provider, admission, and authorization record identity/,
)
