import type {
  RuntimeProviderAuthorityReport,
} from '../runtime-provider-authority/runtime-provider-authority'

export type GovernedSandboxIsolationClass =
  | 'process'
  | 'container'
  | 'wasm'
  | 'microvm'

export type GovernedSandboxNetworkPolicy =
  | 'deny-all'
  | 'governed-egress'

export type GovernedSandboxProviderContractInput = {
  providerId: string
  providerAuthority: RuntimeProviderAuthorityReport

  isolationClass: GovernedSandboxIsolationClass

  cpuBudgetMillis: number
  memoryBudgetBytes: number
  wallClockTimeoutMillis: number

  networkPolicy: GovernedSandboxNetworkPolicy

  generatedCodeUntrusted: true
}

export type GovernedSandboxProviderContract = {
  schemaVersion: 1
  kind: 'iasevero-governed-sandbox-provider-contract'

  providerId: string

  providerIdentityVerified: true
  providerAuthorityEvaluated: true
  providerExecutionAllowed: boolean

  isolationClass: GovernedSandboxIsolationClass
  isolationRequirementsVerified: true

  cpuBudgetMillis: number
  memoryBudgetBytes: number
  wallClockTimeoutMillis: number
  resourceBudgetVerified: true

  networkPolicy: GovernedSandboxNetworkPolicy
  networkRequirementVerified: true

  generatedCodeUntrusted: true

  sandboxContractEligible: boolean

  providerInvocation: false
  sandboxExecutionApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

function requirePositiveSafeInteger(
  value: number,
  name: string,
): void {
  if (
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    throw new Error(
      `Governed sandbox provider contract requires positive ${name}.`,
    )
  }
}

export function createGovernedSandboxProviderContract(
  input: GovernedSandboxProviderContractInput,
): GovernedSandboxProviderContract {
  const providerId = input.providerId.trim()

  if (providerId.length === 0) {
    throw new Error(
      'Governed sandbox provider contract requires provider identity.',
    )
  }

  requirePositiveSafeInteger(
    input.cpuBudgetMillis,
    'CPU budget',
  )

  requirePositiveSafeInteger(
    input.memoryBudgetBytes,
    'memory budget',
  )

  requirePositiveSafeInteger(
    input.wallClockTimeoutMillis,
    'wall clock timeout',
  )

  if (
    input.providerAuthority.provider !== providerId
  ) {
    throw new Error(
      'Governed sandbox provider contract requires matching canonical provider authority identity.',
    )
  }

  const sandboxContractEligible =
    input.providerAuthority.executionAllowed === true &&
    input.generatedCodeUntrusted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-sandbox-provider-contract',

    providerId,

    providerIdentityVerified: true,
    providerAuthorityEvaluated: true,
    providerExecutionAllowed:
      input.providerAuthority.executionAllowed,

    isolationClass: input.isolationClass,
    isolationRequirementsVerified: true,

    cpuBudgetMillis: input.cpuBudgetMillis,
    memoryBudgetBytes: input.memoryBudgetBytes,
    wallClockTimeoutMillis:
      input.wallClockTimeoutMillis,
    resourceBudgetVerified: true,

    networkPolicy: input.networkPolicy,
    networkRequirementVerified: true,

    generatedCodeUntrusted: true,

    sandboxContractEligible,

    providerInvocation: false,
    sandboxExecutionApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
