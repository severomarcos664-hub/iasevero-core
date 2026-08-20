import type {
  RuntimeToolExecutionAdapterDecision,
} from './runtime-tool-execution-adapter'

export type RuntimeToolControlledExternalReadIntegrationBoundaryDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadBoundaryEvaluated: true
  externalReadEligible: boolean

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  boundaryStatus: 'eligible' | 'blocked'
  reason: string
}

export function evaluateRuntimeToolControlledExternalReadIntegrationBoundary(
  adapter: RuntimeToolExecutionAdapterDecision,
): RuntimeToolControlledExternalReadIntegrationBoundaryDecision {
  const externalReadEligible =
    adapter.adapterAccepted === true &&
    adapter.executionApplied === false &&
    adapter.mutationApplied === false &&
    adapter.executionKey.trim().length > 0 &&
    adapter.correlationId.trim().length > 0 &&
    adapter.traceId.trim().length > 0 &&
    adapter.stepId.trim().length > 0

  return {
    executionKey: adapter.executionKey,
    correlationId: adapter.correlationId,
    traceId: adapter.traceId,
    stepId: adapter.stepId,

    externalReadBoundaryEvaluated: true,
    externalReadEligible,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    boundaryStatus:
      externalReadEligible ? 'eligible' : 'blocked',

    reason:
      externalReadEligible
        ? 'Governed execution adapter decision is eligible to enter the controlled external-read domain without applying effects.'
        : 'Governed execution adapter decision was blocked before controlled external-read domain entry.',
  }
}
