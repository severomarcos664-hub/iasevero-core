import {
  createRuntimeToolRegistry,
  type RuntimeTool,
} from '../runtime-core/runtime-tool-registry'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'

export type RuntimeToolControlledExecutorBoundaryDecision = {
  toolId: string

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  invocationPrepared: boolean

  toolRegistered: boolean
  toolAllowed: boolean
  policyMatched: boolean

  executorEligible: boolean
  executorBoundaryStatus: 'eligible' | 'blocked'

  executionApplied: false
  mutationApplied: false

  reason: string
}

function policyMatchesRegisteredTool(
  envelope: RuntimeToolExecutionInvocationEnvelope,
  tool: RuntimeTool,
): boolean {
  return (
    envelope.policy.category === tool.category &&
    envelope.policy.risk === tool.risk &&
    envelope.policy.timeoutMs === tool.timeoutMs &&
    envelope.policy.retries === tool.retries &&
    envelope.policy.critical === tool.critical
  )
}

export function evaluateRuntimeToolControlledExecutorBoundary(
  envelope: RuntimeToolExecutionInvocationEnvelope,
): RuntimeToolControlledExecutorBoundaryDecision {
  const registry = createRuntimeToolRegistry()

  const tool =
    registry.tools.find(
      (candidate) => candidate.id === envelope.toolId,
    ) ?? null

  const invocationPrepared =
    envelope.adapterAccepted === true &&
    envelope.invocationPrepared === true &&
    envelope.executionApplied === false &&
    envelope.mutationApplied === false &&
    envelope.executionKey.trim().length > 0 &&
    envelope.correlationId.trim().length > 0 &&
    envelope.traceId.trim().length > 0 &&
    envelope.stepId.trim().length > 0 &&
    envelope.toolId.trim().length > 0 &&
    envelope.idempotencyKey.trim().length > 0

  const toolRegistered = tool !== null
  const toolAllowed = tool?.allowed === true

  const policyMatched =
    tool !== null &&
    policyMatchesRegisteredTool(envelope, tool)

  const executorEligible =
    invocationPrepared &&
    toolRegistered &&
    toolAllowed &&
    policyMatched

  return {
    toolId: envelope.toolId,

    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    invocationPrepared,

    toolRegistered,
    toolAllowed,
    policyMatched,

    executorEligible,
    executorBoundaryStatus:
      executorEligible ? 'eligible' : 'blocked',

    executionApplied: false,
    mutationApplied: false,

    reason: executorEligible
      ? 'Governed invocation is eligible to cross the controlled executor boundary without executing tool effects.'
      : 'Governed invocation was blocked before executor access.',
  }
}
