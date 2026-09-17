import assert from 'node:assert/strict'

import {
  evaluateRuntimeProviderAuthority,
} from '../app/lib/runtime-provider-authority/runtime-provider-authority'

import {
  createGovernedSandboxProviderContract,
} from '../app/lib/runtime-core/runtime-governed-sandbox-provider-contract'

import {
  evaluateGovernedSandboxProviderAdmissionDecision,
} from '../app/lib/runtime-core/runtime-governed-sandbox-provider-admission-decision'

const authority =
  evaluateRuntimeProviderAuthority(
    'sandbox execution request',
    'general',
  )

const contract =
  createGovernedSandboxProviderContract({
    providerId: authority.provider,
    providerAuthority: authority,
    isolationClass: 'wasm',
    cpuBudgetMillis: 1000,
    memoryBudgetBytes: 64 * 1024 * 1024,
    wallClockTimeoutMillis: 5000,
    networkPolicy: 'deny-all',
    generatedCodeUntrusted: true,
  })

const denied =
  evaluateGovernedSandboxProviderAdmissionDecision({
    contract,
    admissionRecordId:
      'sandbox-admission-v287741-blocked',
    admissionAuthorizationGranted: false,
  })

assert.equal(denied.schemaVersion, 1)
assert.equal(
  denied.kind,
  'iasevero-governed-sandbox-provider-admission-decision',
)

assert.equal(denied.sandboxContractVerified, true)
assert.equal(
  denied.sandboxContractEligible,
  contract.sandboxContractEligible,
)

assert.equal(
  denied.sandboxAdmissionAuthorized,
  false,
)

assert.equal(denied.providerInvocation, false)
assert.equal(denied.sandboxExecutionApplied, false)
assert.equal(denied.networkAuthorityGranted, false)
assert.equal(denied.productionMutationApplied, false)
assert.equal(denied.selfPromotionApplied, false)

assert.throws(
  () =>
    evaluateGovernedSandboxProviderAdmissionDecision({
      contract,
      admissionRecordId: '   ',
      admissionAuthorizationGranted: true,
    }),
  /requires admission record id/,
)

const authorityInjectedContract = {
  ...contract,
  networkAuthorityGranted: true,
} as unknown as typeof contract

assert.throws(
  () =>
    evaluateGovernedSandboxProviderAdmissionDecision({
      contract: authorityInjectedContract,
      admissionRecordId:
        'sandbox-admission-v287742-authority-injected',
      admissionAuthorizationGranted: true,
    }),
  /requires zero inherited operational authority/,
)

console.log({
  architecture:
    'sandbox-provider-contract -> admission-decision -> explicit-admission-authorization -> zero-execution',
  providerId: denied.providerId,
  sandboxContractVerified:
    denied.sandboxContractVerified,
  sandboxContractEligible:
    denied.sandboxContractEligible,
  admissionAuthorizationGranted:
    denied.admissionAuthorizationGranted,
  sandboxAdmissionEligible:
    denied.sandboxAdmissionEligible,
  sandboxAdmissionAuthorized:
    denied.sandboxAdmissionAuthorized,
  providerInvocation:
    denied.providerInvocation,
  sandboxExecutionApplied:
    denied.sandboxExecutionApplied,
  networkAuthorityGranted:
    denied.networkAuthorityGranted,
  productionMutationApplied:
    denied.productionMutationApplied,
  selfPromotionApplied:
    denied.selfPromotionApplied,
})

console.log(
  'Runtime governed sandbox provider admission decision foundation proof passed.',
)
