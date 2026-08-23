import type {
  RuntimeToolControlledExternalReadExecutionGateDecision,
} from '@/app/lib/orchestrator/runtime-tool-controlled-external-read-execution-gate'

export type RuntimeToolControlledExternalReadEffectHandoffDecision = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  externalReadAuthorizationEvaluated: true
  externalReadAuthorized: boolean
  externalReadExecutionEligible: boolean

  effectHandoffPrepared: boolean
  effectHandoffStatus: 'prepared' | 'blocked'

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

export function evaluateRuntimeToolControlledExternalReadEffectHandoffBoundary(
  executionGate: RuntimeToolControlledExternalReadExecutionGateDecision,
): RuntimeToolControlledExternalReadEffectHandoffDecision {
  const effectHandoffPrepared =
    executionGate.externalReadAuthorizationEvaluated === true &&
    executionGate.externalReadAuthorized === true &&
    executionGate.externalReadExecutionEligible === true &&
    executionGate.executionGateStatus === 'eligible' &&
    executionGate.networkAccess === false &&
    executionGate.externalReadApplied === false &&
    executionGate.executionApplied === false &&
    executionGate.mutationApplied === false &&
    executionGate.providerInvocation === false

  return {
    executionKey: executionGate.executionKey,
    correlationId: executionGate.correlationId,
    traceId: executionGate.traceId,
    stepId: executionGate.stepId,

    externalReadAuthorizationEvaluated: true,
    externalReadAuthorized: executionGate.externalReadAuthorized,
    externalReadExecutionEligible:
      executionGate.externalReadExecutionEligible,

    effectHandoffPrepared,
    effectHandoffStatus:
      effectHandoffPrepared ? 'prepared' : 'blocked',

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: effectHandoffPrepared
      ? 'Governed controlled external read effect handoff is prepared for a future invocation boundary without applying effects.'
      : 'Governed controlled external read effect handoff was blocked before effect invocation.',
  }
}
