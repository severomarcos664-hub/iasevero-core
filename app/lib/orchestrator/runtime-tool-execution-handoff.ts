import type {
  RuntimeToolExecutionGateDecision,
} from './runtime-tool-execution-gate'

export type RuntimeToolExecutionHandoff = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  dispatchApplied: boolean
  executionEligible: boolean

  handoffStatus: 'ready' | 'blocked'
  executionApplied: false
  mutationApplied: false

  reason: string
}

export function createRuntimeToolExecutionHandoff(
  decision: RuntimeToolExecutionGateDecision,
): RuntimeToolExecutionHandoff {
  const ready =
    decision.dispatchApplied === true &&
    decision.executionEligible === true &&
    decision.executionApplied === false &&
    decision.mutationApplied === false

  return {
    executionKey: decision.executionKey,
    correlationId: decision.correlationId,
    traceId: decision.traceId,
    stepId: decision.stepId,

    dispatchApplied: decision.dispatchApplied,
    executionEligible: decision.executionEligible,

    handoffStatus: ready ? 'ready' : 'blocked',

    executionApplied: false,
    mutationApplied: false,

    reason: ready
      ? 'Governed tool execution handoff is ready without applying execution.'
      : 'Governed tool execution handoff blocked before execution.',
  }
}
