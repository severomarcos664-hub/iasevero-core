export type RuntimeToolControlledExternalReadAuthorizationInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadBoundaryEvaluated: boolean
  externalReadEligible: boolean

  finalAuthorization: boolean
}

export type RuntimeToolControlledExternalReadAuthorizationDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadAuthorizationEvaluated: true
  externalReadAuthorized: boolean

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  authorizationStatus: 'authorized' | 'denied'
  reason: string
}

export function evaluateRuntimeToolControlledExternalReadAuthorizationBoundary(
  input: RuntimeToolControlledExternalReadAuthorizationInput,
): RuntimeToolControlledExternalReadAuthorizationDecision {
  const identityValid =
    input.executionKey.trim().length > 0 &&
    input.correlationId.trim().length > 0 &&
    input.traceId.trim().length > 0 &&
    input.stepId.trim().length > 0

  const externalReadAuthorized =
    identityValid &&
    input.externalReadBoundaryEvaluated === true &&
    input.externalReadEligible === true &&
    input.finalAuthorization === true

  return {
    executionKey: input.executionKey,
    correlationId: input.correlationId,
    traceId: input.traceId,
    stepId: input.stepId,

    externalReadAuthorizationEvaluated: true,
    externalReadAuthorized,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    authorizationStatus:
      externalReadAuthorized ? 'authorized' : 'denied',

    reason: externalReadAuthorized
      ? 'Governed controlled external read is authorized to proceed to a future execution boundary without applying external effects.'
      : 'Governed controlled external read authorization was denied before external effect access.',
  }
}
