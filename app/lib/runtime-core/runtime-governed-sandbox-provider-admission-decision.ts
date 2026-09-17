import type {
  GovernedSandboxProviderContract,
} from './runtime-governed-sandbox-provider-contract'

export type GovernedSandboxProviderAdmissionDecisionInput = {
  contract: GovernedSandboxProviderContract
  admissionRecordId: string
  admissionAuthorizationGranted: boolean
}

export type GovernedSandboxProviderAdmissionDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-sandbox-provider-admission-decision'

  providerId: string
  admissionRecordId: string

  sandboxContractVerified: true
  sandboxContractEligible: boolean
  admissionAuthorizationGranted: boolean

  sandboxAdmissionEligible: boolean
  sandboxAdmissionAuthorized: boolean

  providerInvocation: false
  sandboxExecutionApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false

  reason: string
}

export function evaluateGovernedSandboxProviderAdmissionDecision(
  input: GovernedSandboxProviderAdmissionDecisionInput,
): GovernedSandboxProviderAdmissionDecision {
  const admissionRecordId = input.admissionRecordId.trim()

  if (admissionRecordId.length === 0) {
    throw new Error(
      'Governed sandbox provider admission decision requires admission record id.',
    )
  }

  if (
    input.contract.providerInvocation !== false ||
    input.contract.sandboxExecutionApplied !== false ||
    input.contract.networkAuthorityGranted !== false ||
    input.contract.productionMutationApplied !== false ||
    input.contract.selfPromotionApplied !== false
  ) {
    throw new Error(
      'Governed sandbox provider admission decision requires zero inherited operational authority.',
    )
  }

  const sandboxAdmissionEligible =
    input.contract.sandboxContractEligible === true

  const sandboxAdmissionAuthorized =
    sandboxAdmissionEligible &&
    input.admissionAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-sandbox-provider-admission-decision',

    providerId: input.contract.providerId,
    admissionRecordId,

    sandboxContractVerified: true,
    sandboxContractEligible:
      input.contract.sandboxContractEligible,
    admissionAuthorizationGranted:
      input.admissionAuthorizationGranted,

    sandboxAdmissionEligible,
    sandboxAdmissionAuthorized,

    providerInvocation: false,
    sandboxExecutionApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,

    reason: !sandboxAdmissionEligible
      ? 'Sandbox provider contract is not eligible for admission.'
      : sandboxAdmissionAuthorized
        ? 'Sandbox provider admission authorized without execution authority.'
        : 'Sandbox provider admission is eligible but explicit admission authorization was not granted.',
  }
}
