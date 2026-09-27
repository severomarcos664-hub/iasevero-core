export type RuntimeToolGovernedExternalContentCognitiveAdmissionInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  evidenceVerified: boolean
  inboundContentAccepted: boolean
  cognitiveUseAuthorizationGranted: boolean
}

export type RuntimeToolGovernedExternalContentCognitiveAdmissionDecision = {
  admissionEvaluated: true
  identityBound: boolean
  evidenceVerified: boolean
  inboundContentAccepted: boolean
  cognitiveUseAuthorizationGranted: boolean
  cognitiveUseEligible: boolean
  safeForCognitiveUse: boolean
  trustEstablished: false
  memoryEligible: false
  learningEligible: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false
  productionMutationApplied: false
  selfPromotionApplied: false
  reason: string
}

export function evaluateRuntimeToolGovernedExternalContentCognitiveAdmission(
  input: RuntimeToolGovernedExternalContentCognitiveAdmissionInput,
): RuntimeToolGovernedExternalContentCognitiveAdmissionDecision {
  const identityBound =
    input.executionKey.trim().length > 0 &&
    input.correlationId.trim().length > 0 &&
    input.traceId.trim().length > 0 &&
    input.stepId.trim().length > 0

  const cognitiveUseEligible =
    identityBound &&
    input.evidenceVerified === true &&
    input.inboundContentAccepted === true &&
    input.cognitiveUseAuthorizationGranted === true

  let reason: string

  if (!identityBound) {
    reason = 'External content cognitive admission requires bound identity.'
  } else if (!input.evidenceVerified) {
    reason = 'External content cognitive admission requires verified evidence.'
  } else if (!input.inboundContentAccepted) {
    reason =
      'External content cognitive admission requires accepted inbound content.'
  } else if (!input.cognitiveUseAuthorizationGranted) {
    reason =
      'External content cognitive use requires explicit authorization.'
  } else {
    reason =
      'External content admitted for cognitive use without establishing trust, memory, learning, execution, or mutation authority.'
  }

  return {
    admissionEvaluated: true,
    identityBound,
    evidenceVerified: input.evidenceVerified,
    inboundContentAccepted: input.inboundContentAccepted,
    cognitiveUseAuthorizationGranted:
      input.cognitiveUseAuthorizationGranted,
    cognitiveUseEligible,
    safeForCognitiveUse: cognitiveUseEligible,
    trustEstablished: false,
    memoryEligible: false,
    learningEligible: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
    reason,
  }
}
