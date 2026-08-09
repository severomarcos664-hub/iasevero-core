import type {
  RuntimeToolExecutionHandoff,
} from './runtime-tool-execution-handoff'

export type RuntimeToolExecutionAdapterRequest = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  dispatchApplied: true
  executionEligible: true
  handoffStatus: 'ready'

  executionApplied: false
  mutationApplied: false
}

export type RuntimeToolExecutionAdapterDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  adapterAccepted: boolean
  executionApplied: false
  mutationApplied: false

  adapterStatus: 'accepted' | 'rejected'
  reason: string
}

export function createRuntimeToolExecutionAdapterRequest(
  handoff: RuntimeToolExecutionHandoff,
): RuntimeToolExecutionAdapterRequest | null {
  const accepted =
    handoff.dispatchApplied === true &&
    handoff.executionEligible === true &&
    handoff.handoffStatus === 'ready' &&
    handoff.executionApplied === false &&
    handoff.mutationApplied === false

  if (!accepted) {
    return null
  }

  return {
    executionKey: handoff.executionKey,
    correlationId: handoff.correlationId,
    traceId: handoff.traceId,
    stepId: handoff.stepId,

    dispatchApplied: true,
    executionEligible: true,
    handoffStatus: 'ready',

    executionApplied: false,
    mutationApplied: false,
  }
}

export function evaluateRuntimeToolExecutionAdapter(
  request: RuntimeToolExecutionAdapterRequest | null,
): RuntimeToolExecutionAdapterDecision {
  if (!request) {
    return {
      executionKey: '',
      correlationId: '',
      traceId: '',
      stepId: '',

      adapterAccepted: false,
      executionApplied: false,
      mutationApplied: false,

      adapterStatus: 'rejected',
      reason: 'Governed tool execution adapter rejected an invalid execution handoff.',
    }
  }

  return {
    executionKey: request.executionKey,
    correlationId: request.correlationId,
    traceId: request.traceId,
    stepId: request.stepId,

    adapterAccepted: true,
    executionApplied: false,
    mutationApplied: false,

    adapterStatus: 'accepted',
    reason:
      'Governed tool execution adapter contract accepted the handoff without applying execution.',
  }
}
