import type {
  GovernedSandboxProviderAdmissionDecision,
} from './runtime-governed-sandbox-provider-admission-decision'

export type GovernedSandboxExecutionAuthorizationGateInput = {
  admissionDecision: GovernedSandboxProviderAdmissionDecision
  executionAuthorizationRecordId: string
  executionAuthorizationGranted: boolean
}

export type GovernedSandboxExecutionAuthorizationGateDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-sandbox-execution-authorization-gate-decision'

  providerId: string
  admissionRecordId: string
  executionAuthorizationRecordId: string

  sandboxAdmissionVerified: true
  sandboxAdmissionEligible: boolean
  sandboxAdmissionAuthorized: boolean

  sandboxExecutionEligible: boolean
  executionAuthorizationGranted: boolean
  sandboxExecutionAuthorized: boolean

  providerInvocation: false
  sandboxExecutionApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false

  reason: string
}

export function evaluateGovernedSandboxExecutionAuthorizationGate(
  input: GovernedSandboxExecutionAuthorizationGateInput,
): GovernedSandboxExecutionAuthorizationGateDecision {
  const executionAuthorizationRecordId =
    input.executionAuthorizationRecordId.trim()

  if (executionAuthorizationRecordId.length === 0) {
    throw new Error(
      'Governed sandbox execution authorization gate requires execution authorization record id.',
    )
  }

  const admission = input.admissionDecision

  if (
    admission.providerInvocation !== false ||
    admission.sandboxExecutionApplied !== false ||
    admission.networkAuthorityGranted !== false ||
    admission.productionMutationApplied !== false ||
    admission.selfPromotionApplied !== false
  ) {
    throw new Error(
      'Governed sandbox execution authorization gate requires zero inherited operational authority.',
    )
  }

  const sandboxExecutionEligible =
    admission.sandboxAdmissionEligible === true &&
    admission.sandboxAdmissionAuthorized === true

  const sandboxExecutionAuthorized =
    sandboxExecutionEligible &&
    input.executionAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind:
      'iasevero-governed-sandbox-execution-authorization-gate-decision',

    providerId: admission.providerId,
    admissionRecordId: admission.admissionRecordId,
    executionAuthorizationRecordId,

    sandboxAdmissionVerified: true,
    sandboxAdmissionEligible:
      admission.sandboxAdmissionEligible,
    sandboxAdmissionAuthorized:
      admission.sandboxAdmissionAuthorized,

    sandboxExecutionEligible,
    executionAuthorizationGranted:
      input.executionAuthorizationGranted,
    sandboxExecutionAuthorized,

    providerInvocation: false,
    sandboxExecutionApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,

    reason: !sandboxExecutionEligible
      ? 'Sandbox execution is not eligible because governed admission is not authorized.'
      : sandboxExecutionAuthorized
        ? 'Sandbox execution authorization granted without applying execution.'
        : 'Sandbox execution is eligible but explicit execution authorization was not granted.',
  }
}
