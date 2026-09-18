export type RuntimeGovernedSandboxAdmissionAuthorizationInput = {
  providerId: string
  admissionRecordId: string
  authorizationRecordId: string
  providerAuthorityEvaluated: boolean
  providerExecutionAllowed: boolean
  sandboxContractEligible: boolean
  authorizationGranted: boolean
}

export type RuntimeGovernedSandboxAdmissionAuthorizationDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-sandbox-admission-authorization'
  providerId: string
  admissionRecordId: string
  authorizationRecordId: string
  admissionAuthorizationEvaluated: true
  admissionAuthorizationEligible: boolean
  admissionAuthorizationGranted: boolean
  providerInvocation: false
  sandboxExecutionApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
  reason: string
}

export function evaluateRuntimeGovernedSandboxAdmissionAuthorization(
  input: RuntimeGovernedSandboxAdmissionAuthorizationInput,
): RuntimeGovernedSandboxAdmissionAuthorizationDecision {
  const providerId = input.providerId.trim()
  const admissionRecordId = input.admissionRecordId.trim()
  const authorizationRecordId = input.authorizationRecordId.trim()

  if (providerId.length === 0 || admissionRecordId.length === 0 || authorizationRecordId.length === 0) {
    throw new Error('Governed sandbox admission authorization requires provider, admission, and authorization record identity.')
  }

  const admissionAuthorizationEligible =
    input.providerAuthorityEvaluated === true &&
    input.providerExecutionAllowed === true &&
    input.sandboxContractEligible === true

  const admissionAuthorizationGranted =
    admissionAuthorizationEligible && input.authorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-sandbox-admission-authorization',
    providerId,
    admissionRecordId,
    authorizationRecordId,
    admissionAuthorizationEvaluated: true,
    admissionAuthorizationEligible,
    admissionAuthorizationGranted,
    providerInvocation: false,
    sandboxExecutionApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
    reason: admissionAuthorizationGranted
      ? 'Sandbox admission authorization granted without applying execution.'
      : admissionAuthorizationEligible
        ? 'Sandbox admission is eligible but explicit authorization was not granted.'
        : 'Sandbox admission is not eligible for authorization.',
  }
}
