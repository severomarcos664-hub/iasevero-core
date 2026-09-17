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

import {
  evaluateGovernedSandboxExecutionAuthorizationGate,
} from '../app/lib/runtime-core/runtime-governed-sandbox-execution-authorization-gate'

const providerAuthority =
  evaluateRuntimeProviderAuthority(
    'sandbox execution request',
    'general',
  )

const contract =
  createGovernedSandboxProviderContract({
    providerId: providerAuthority.provider,
    providerAuthority,
    isolationClass: 'wasm',
    cpuBudgetMillis: 1000,
    memoryBudgetBytes: 64 * 1024 * 1024,
    wallClockTimeoutMillis: 5000,
    networkPolicy: 'deny-all',
    generatedCodeUntrusted: true,
  })

assert.equal(
  contract.sandboxContractEligible,
  true,
  'proof requires canonical provider authority to make sandbox contract eligible',
)

const admission =
  evaluateGovernedSandboxProviderAdmissionDecision({
    contract,
    admissionRecordId:
      'sandbox-admission-v287743-authorized',
    admissionAuthorizationGranted: true,
  })

assert.equal(admission.sandboxAdmissionEligible, true)
assert.equal(admission.sandboxAdmissionAuthorized, true)

const denied =
  evaluateGovernedSandboxExecutionAuthorizationGate({
    admissionDecision: admission,
    executionAuthorizationRecordId:
      'sandbox-execution-auth-v287743-denied',
    executionAuthorizationGranted: false,
  })

assert.equal(denied.sandboxExecutionEligible, true)
assert.equal(denied.sandboxExecutionAuthorized, false)
assert.equal(denied.providerInvocation, false)
assert.equal(denied.sandboxExecutionApplied, false)

const authorized =
  evaluateGovernedSandboxExecutionAuthorizationGate({
    admissionDecision: admission,
    executionAuthorizationRecordId:
      'sandbox-execution-auth-v287743-authorized',
    executionAuthorizationGranted: true,
  })

assert.equal(authorized.schemaVersion, 1)
assert.equal(
  authorized.kind,
  'iasevero-governed-sandbox-execution-authorization-gate-decision',
)
assert.equal(authorized.sandboxAdmissionVerified, true)
assert.equal(authorized.sandboxAdmissionEligible, true)
assert.equal(authorized.sandboxAdmissionAuthorized, true)
assert.equal(authorized.sandboxExecutionEligible, true)
assert.equal(authorized.executionAuthorizationGranted, true)
assert.equal(authorized.sandboxExecutionAuthorized, true)

assert.equal(authorized.providerInvocation, false)
assert.equal(authorized.sandboxExecutionApplied, false)
assert.equal(authorized.networkAuthorityGranted, false)
assert.equal(authorized.productionMutationApplied, false)
assert.equal(authorized.selfPromotionApplied, false)

assert.throws(
  () =>
    evaluateGovernedSandboxExecutionAuthorizationGate({
      admissionDecision: admission,
      executionAuthorizationRecordId: '   ',
      executionAuthorizationGranted: true,
    }),
  /requires execution authorization record id/,
)

const authorityInjectedAdmission = {
  ...admission,
  sandboxExecutionApplied: true,
} as unknown as typeof admission

assert.throws(
  () =>
    evaluateGovernedSandboxExecutionAuthorizationGate({
      admissionDecision: authorityInjectedAdmission,
      executionAuthorizationRecordId:
        'sandbox-execution-auth-v287743-injected',
      executionAuthorizationGranted: true,
    }),
  /requires zero inherited operational authority/,
)

console.log({
  architecture:
    'provider-authority -> sandbox-contract -> admission-decision -> execution-authorization-gate -> authorization-only -> zero-effect',
  providerId: authorized.providerId,
  sandboxAdmissionVerified:
    authorized.sandboxAdmissionVerified,
  sandboxAdmissionEligible:
    authorized.sandboxAdmissionEligible,
  sandboxAdmissionAuthorized:
    authorized.sandboxAdmissionAuthorized,
  sandboxExecutionEligible:
    authorized.sandboxExecutionEligible,
  executionAuthorizationGranted:
    authorized.executionAuthorizationGranted,
  sandboxExecutionAuthorized:
    authorized.sandboxExecutionAuthorized,
  providerInvocation:
    authorized.providerInvocation,
  sandboxExecutionApplied:
    authorized.sandboxExecutionApplied,
  networkAuthorityGranted:
    authorized.networkAuthorityGranted,
  productionMutationApplied:
    authorized.productionMutationApplied,
  selfPromotionApplied:
    authorized.selfPromotionApplied,
})

console.log(
  'Runtime governed sandbox execution authorization gate foundation proof passed.',
)
