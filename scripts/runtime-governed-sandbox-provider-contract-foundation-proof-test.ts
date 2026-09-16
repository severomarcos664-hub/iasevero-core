import assert from 'node:assert/strict'

import {
  evaluateRuntimeProviderAuthority,
} from '../app/lib/runtime-provider-authority/runtime-provider-authority'

import {
  createGovernedSandboxProviderContract,
} from '../app/lib/runtime-core/runtime-governed-sandbox-provider-contract'

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

assert.equal(contract.schemaVersion, 1)

assert.equal(
  contract.kind,
  'iasevero-governed-sandbox-provider-contract',
)

assert.equal(
  contract.providerIdentityVerified,
  true,
)

assert.equal(
  contract.providerAuthorityEvaluated,
  true,
)

assert.equal(
  contract.isolationRequirementsVerified,
  true,
)

assert.equal(
  contract.resourceBudgetVerified,
  true,
)

assert.equal(
  contract.networkRequirementVerified,
  true,
)

assert.equal(
  contract.generatedCodeUntrusted,
  true,
)

assert.equal(
  contract.providerInvocation,
  false,
)

assert.equal(
  contract.sandboxExecutionApplied,
  false,
)

assert.equal(
  contract.networkAuthorityGranted,
  false,
)

assert.equal(
  contract.productionMutationApplied,
  false,
)

assert.equal(
  contract.selfPromotionApplied,
  false,
)

assert.throws(
  () =>
    createGovernedSandboxProviderContract({
      providerId: 'different-provider',
      providerAuthority: authority,
      isolationClass: 'wasm',
      cpuBudgetMillis: 1000,
      memoryBudgetBytes: 64 * 1024 * 1024,
      wallClockTimeoutMillis: 5000,
      networkPolicy: 'deny-all',
      generatedCodeUntrusted: true,
    }),
  /matching canonical provider authority identity/,
)

console.log({
  architecture:
    'canonical-provider-authority -> sandbox-provider-contract -> isolation-requirements -> resource-budget -> network-requirements -> eligibility-only -> zero-execution',
  providerId:
    contract.providerId,
  providerAuthorityEvaluated:
    contract.providerAuthorityEvaluated,
  isolationClass:
    contract.isolationClass,
  isolationRequirementsVerified:
    contract.isolationRequirementsVerified,
  resourceBudgetVerified:
    contract.resourceBudgetVerified,
  networkRequirementVerified:
    contract.networkRequirementVerified,
  generatedCodeUntrusted:
    contract.generatedCodeUntrusted,
  sandboxContractEligible:
    contract.sandboxContractEligible,
  providerInvocation:
    contract.providerInvocation,
  sandboxExecutionApplied:
    contract.sandboxExecutionApplied,
  networkAuthorityGranted:
    contract.networkAuthorityGranted,
  productionMutationApplied:
    contract.productionMutationApplied,
  selfPromotionApplied:
    contract.selfPromotionApplied,
})

console.log(
  'Runtime governed sandbox provider contract foundation proof passed.',
)
