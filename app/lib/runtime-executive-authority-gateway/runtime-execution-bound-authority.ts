export type RuntimeExecutionBoundAuthorityInput = {
  executionKey: string
  executiveAuthority: {
    executionAllowed: boolean
  }
}

export type RuntimeExecutionBoundAuthorityDecision = {
  executionKey: string

  authorityBindingEvaluated: true
  authorityBound: boolean
  executionAllowed: boolean

  networkAccess: false
  executionApplied: false
  mutationApplied: false
  externalMutation: false
  providerInvocation: false

  reason: string
}

export function evaluateRuntimeExecutionBoundAuthority(
  input: RuntimeExecutionBoundAuthorityInput,
): RuntimeExecutionBoundAuthorityDecision {
  const executionKey = input.executionKey.trim()
  const executionAllowed =
    input.executiveAuthority.executionAllowed === true

  const authorityBound =
    executionKey.length > 0 &&
    executionAllowed

  return {
    executionKey,

    authorityBindingEvaluated: true,
    authorityBound,
    executionAllowed,

    networkAccess: false,
    executionApplied: false,
    mutationApplied: false,
    externalMutation: false,
    providerInvocation: false,

    reason: authorityBound
      ? 'Executive authority was bound to the execution identity without authorizing tool execution.'
      : 'Executive authority was not bound to the execution identity.',
  }
}
