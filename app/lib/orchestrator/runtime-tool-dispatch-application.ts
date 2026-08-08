import type {
  RuntimeToolDispatchHandoff,
} from './runtime-tool-dispatcher'

export type RuntimeToolDispatchApplication = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  handoffStatus: 'authorized' | 'blocked'
  dispatchApplied: boolean
  executionApplied: false
  mutationApplied: false
  reason: string
}

export function applyRuntimeToolDispatch(
  handoff: RuntimeToolDispatchHandoff,
): RuntimeToolDispatchApplication {
  const dispatchAllowed =
    handoff.handoffStatus === 'authorized' &&
    handoff.finalAuthorization === true &&
    handoff.governance === 'approved' &&
    handoff.dispatchApplied === false &&
    handoff.executionApplied === false &&
    handoff.mutationApplied === false

  return {
    executionKey: handoff.executionKey,
    correlationId: handoff.correlationId,
    traceId: handoff.traceId,
    stepId: handoff.stepId,
    handoffStatus: handoff.handoffStatus,
    dispatchApplied: dispatchAllowed,
    executionApplied: false,
    mutationApplied: false,
    reason: dispatchAllowed
      ? 'Governed tool dispatch applied without executing tool effects.'
      : 'Governed tool dispatch application denied.',
  }
}
