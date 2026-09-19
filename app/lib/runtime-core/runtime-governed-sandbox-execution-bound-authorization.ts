export type RuntimeGovernedSandboxExecutionBoundAuthorizationInput = {
  executionKey: string
  sandboxExecutionAuthorized: boolean
  toolRegistered: boolean
  toolAllowed: boolean
  governanceApproved: boolean
  finalAuthorizationGranted: boolean
}

export type RuntimeGovernedSandboxExecutionBoundAuthorizationDecision = {
  authorizationEvaluated: true
  executionIdentityBound: boolean
  executionAuthorized: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  providerInvocation: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export function evaluateRuntimeGovernedSandboxExecutionBoundAuthorization(
  input: RuntimeGovernedSandboxExecutionBoundAuthorizationInput,
): RuntimeGovernedSandboxExecutionBoundAuthorizationDecision {
  const executionKey = input.executionKey.trim()

  const executionIdentityBound =
    executionKey.length > 0 &&
    input.sandboxExecutionAuthorized === true &&
    input.toolRegistered === true &&
    input.toolAllowed === true &&
    input.governanceApproved === true &&
    input.finalAuthorizationGranted === true

  return {
    authorizationEvaluated: true,
    executionIdentityBound,
    executionAuthorized: executionIdentityBound,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    providerInvocation: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
