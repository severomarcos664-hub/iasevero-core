export type RuntimeToolControlledExternalReadExecutionGateInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadAuthorizationEvaluated: boolean
  externalReadAuthorized: boolean

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false
}

export type RuntimeToolControlledExternalReadExecutionGateDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadAuthorizationEvaluated: true
  externalReadAuthorized: boolean
  externalReadExecutionEligible: boolean

  executionGateStatus: 'eligible' | 'blocked'

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

export function evaluateRuntimeToolControlledExternalReadExecutionGate(
  input: RuntimeToolControlledExternalReadExecutionGateInput,
): RuntimeToolControlledExternalReadExecutionGateDecision {
  const externalReadExecutionEligible =
    input.externalReadAuthorizationEvaluated === true &&
    input.externalReadAuthorized === true &&
    input.networkAccess === false &&
    input.externalReadApplied === false &&
    input.executionApplied === false &&
    input.mutationApplied === false &&
    input.providerInvocation === false

  return {
    executionKey: input.executionKey,
    correlationId: input.correlationId,
    traceId: input.traceId,
    stepId: input.stepId,

    externalReadAuthorizationEvaluated: true,
    externalReadAuthorized: input.externalReadAuthorized,
    externalReadExecutionEligible,

    executionGateStatus:
      externalReadExecutionEligible ? 'eligible' : 'blocked',

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: externalReadExecutionEligible
      ? 'Governed controlled external read is eligible to cross the execution gate without applying effects.'
      : 'Governed controlled external read was blocked before effect invocation.',
  }
}
