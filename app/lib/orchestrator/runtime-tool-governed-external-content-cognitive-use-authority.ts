export type RuntimeToolGovernedExternalContentCognitiveUseAuthorityInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  purpose: 'research'
  explicitAuthorization: boolean
}

export type RuntimeToolGovernedExternalContentCognitiveUseAuthorityDecision = {
  authorityEvaluated: true
  identityBound: boolean
  purposeAuthorized: boolean
  cognitiveUseAuthorizationGranted: boolean
  trustEstablished: false
  memoryAuthorityGranted: false
  learningAuthorityGranted: false
  executionAuthorityGranted: false
  mutationAuthorityGranted: false
  providerAuthorityGranted: false
  productionMutationAuthorityGranted: false
  selfPromotionAuthorityGranted: false
  reason: string
}

export function evaluateRuntimeToolGovernedExternalContentCognitiveUseAuthority(
  input: RuntimeToolGovernedExternalContentCognitiveUseAuthorityInput,
): RuntimeToolGovernedExternalContentCognitiveUseAuthorityDecision {
  const identityBound =
    input.executionKey.trim().length > 0 &&
    input.correlationId.trim().length > 0 &&
    input.traceId.trim().length > 0 &&
    input.stepId.trim().length > 0

  const purposeAuthorized = input.purpose === 'research'

  const cognitiveUseAuthorizationGranted =
    identityBound &&
    purposeAuthorized &&
    input.explicitAuthorization === true

  let reason: string

  if (!identityBound) {
    reason = 'Cognitive-use authority requires bound execution identity.'
  } else if (!purposeAuthorized) {
    reason = 'Cognitive-use authority denied for unsupported purpose.'
  } else if (!input.explicitAuthorization) {
    reason = 'Cognitive-use authority requires explicit authorization.'
  } else {
    reason =
      'Cognitive use authorized for research without granting trust, memory, learning, execution, mutation, provider, production mutation, or self-promotion authority.'
  }

  return {
    authorityEvaluated: true,
    identityBound,
    purposeAuthorized,
    cognitiveUseAuthorizationGranted,
    trustEstablished: false,
    memoryAuthorityGranted: false,
    learningAuthorityGranted: false,
    executionAuthorityGranted: false,
    mutationAuthorityGranted: false,
    providerAuthorityGranted: false,
    productionMutationAuthorityGranted: false,
    selfPromotionAuthorityGranted: false,
    reason,
  }
}
