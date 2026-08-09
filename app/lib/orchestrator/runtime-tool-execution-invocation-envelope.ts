import type {
  RuntimeToolCategory,
  RuntimeToolRisk,
} from '../runtime-core/runtime-tool-registry'

import type {
  RuntimeToolExecutionAdapterDecision,
} from './runtime-tool-execution-adapter'

export type RuntimeToolExecutionInvocationPolicy = {
  category: RuntimeToolCategory
  risk: RuntimeToolRisk
  timeoutMs: number
  retries: number
  critical: boolean
}

export type RuntimeToolExecutionInvocationPreparation = {
  toolId: string
  validatedInput: Readonly<Record<string, unknown>>
  idempotencyKey: string
  policy: RuntimeToolExecutionInvocationPolicy
}

export type RuntimeToolExecutionInvocationEnvelope = {
  toolId: string

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  validatedInput: Readonly<Record<string, unknown>>
  idempotencyKey: string
  policy: RuntimeToolExecutionInvocationPolicy

  adapterAccepted: true
  invocationPrepared: true

  executionApplied: false
  mutationApplied: false
}

export function createRuntimeToolExecutionInvocationEnvelope(
  decision: RuntimeToolExecutionAdapterDecision,
  preparation: RuntimeToolExecutionInvocationPreparation,
): RuntimeToolExecutionInvocationEnvelope | null {
  const accepted =
    decision.adapterAccepted === true &&
    decision.adapterStatus === 'accepted' &&
    decision.executionApplied === false &&
    decision.mutationApplied === false

  const validPreparation =
    preparation.toolId.trim().length > 0 &&
    preparation.idempotencyKey.trim().length > 0 &&
    preparation.policy.timeoutMs > 0 &&
    preparation.policy.retries >= 0

  if (!accepted || !validPreparation) {
    return null
  }

  return {
    toolId: preparation.toolId,

    executionKey: decision.executionKey,
    correlationId: decision.correlationId,
    traceId: decision.traceId,
    stepId: decision.stepId,

    validatedInput: Object.freeze({ ...preparation.validatedInput }),
    idempotencyKey: preparation.idempotencyKey,

    policy: {
      ...preparation.policy,
    },

    adapterAccepted: true,
    invocationPrepared: true,

    executionApplied: false,
    mutationApplied: false,
  }
}
