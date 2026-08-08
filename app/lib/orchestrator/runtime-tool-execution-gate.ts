import type {
  RuntimeToolDispatchApplication,
} from './runtime-tool-dispatch-application'

export type RuntimeToolExecutionGateDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  dispatchApplied: boolean
  executionEligible: boolean
  executionApplied: false
  mutationApplied: false
  reason: string
}

export function evaluateRuntimeToolExecutionGate(
  dispatch: RuntimeToolDispatchApplication,
): RuntimeToolExecutionGateDecision {
  const executionEligible =
    dispatch.dispatchApplied === true &&
    dispatch.handoffStatus === 'authorized' &&
    dispatch.executionApplied === false &&
    dispatch.mutationApplied === false

  return {
    executionKey: dispatch.executionKey,
    correlationId: dispatch.correlationId,
    traceId: dispatch.traceId,
    stepId: dispatch.stepId,
    dispatchApplied: dispatch.dispatchApplied,
    executionEligible,
    executionApplied: false,
    mutationApplied: false,
    reason: executionEligible
      ? 'Governed tool dispatch is eligible to cross the execution gate without executing effects.'
      : 'Governed tool execution gate denied progression.',
  }
}
