export type RuntimeToolUntrustedExternalContentSemanticInstructionBoundaryInput = {
  body: string
}

export type RuntimeToolUntrustedExternalContentSemanticInstructionBoundaryDecision = {
  semanticBoundaryEvaluated: true
  externalContentUntrusted: true
  instructionLikeContentDetected: boolean
  indirectPromptInjectionDetected: boolean
  semanticInstructionBoundaryAccepted: boolean
  safeForCognitiveUse: false
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

const INDIRECT_PROMPT_INJECTION_PATTERNS: readonly RegExp[] = [
  /\bignore\s+(?:all\s+)?(?:previous|prior)\s+instructions?\b/i,
  /\bdisregard\s+(?:all\s+)?(?:previous|prior)\s+instructions?\b/i,
  /\boverride\s+(?:the\s+)?(?:system|developer)\s+(?:message|instructions?)\b/i,
  /\breveal\s+(?:the\s+)?(?:system|developer)\s+(?:prompt|message|instructions?)\b/i,
  /\b(?:system|developer)\s+prompt\b/i,
  /\bjailbreak\b/i,
]

export function evaluateRuntimeToolUntrustedExternalContentSemanticInstructionBoundary(
  input: RuntimeToolUntrustedExternalContentSemanticInstructionBoundaryInput,
): RuntimeToolUntrustedExternalContentSemanticInstructionBoundaryDecision {
  const body = typeof input.body === 'string' ? input.body : ''

  const indirectPromptInjectionDetected =
    INDIRECT_PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(body))

  const instructionLikeContentDetected =
    indirectPromptInjectionDetected ||
    /\b(?:instruction|directive|command|prompt)\b/i.test(body)

  const semanticInstructionBoundaryAccepted =
    body.length > 0 && !indirectPromptInjectionDetected

  return {
    semanticBoundaryEvaluated: true,
    externalContentUntrusted: true,
    instructionLikeContentDetected,
    indirectPromptInjectionDetected,
    semanticInstructionBoundaryAccepted,
    safeForCognitiveUse: false,
    trustEstablished: false,
    memoryEligible: false,
    learningEligible: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
    reason: indirectPromptInjectionDetected
      ? 'Untrusted external content contains instruction patterns that are not eligible for cognitive use.'
      : semanticInstructionBoundaryAccepted
        ? 'Untrusted external content passed the semantic instruction boundary without establishing trust or cognitive-use authority.'
        : 'Untrusted external content semantic instruction boundary requires non-empty content.',
  }
}
