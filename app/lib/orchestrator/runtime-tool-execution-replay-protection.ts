import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'
import type {
  RuntimeToolSafeLocalExecutionResult,
} from './runtime-tool-safe-local-executor'
import {
  executeRuntimeToolWithAttemptGovernance,
} from './runtime-tool-execution-attempt-governance'

export type RuntimeToolExecutionReplayProtectedResult = {
  replayKey: string
  replayDetected: boolean
  replayBlocked: boolean

  execution: RuntimeToolSafeLocalExecutionResult
}

export type RuntimeToolExecutionReplayProtector = {
  execute(
    envelope: RuntimeToolExecutionInvocationEnvelope,
  ): RuntimeToolExecutionReplayProtectedResult

  registeredExecutions(): number
}

function createReplayKey(
  envelope: RuntimeToolExecutionInvocationEnvelope,
): string {
  return JSON.stringify([
    envelope.executionKey,
    envelope.stepId,
    envelope.idempotencyKey,
  ])
}

function createReplayBlockedExecution(
  envelope: RuntimeToolExecutionInvocationEnvelope,
): RuntimeToolSafeLocalExecutionResult {
  return {
    toolId: envelope.toolId,

    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    executorEligible: true,
    executorSelected: false,

    executionAttempted: false,
    executionApplied: false,
    mutationApplied: false,

    networkAccess: false,
    externalMutation: false,
    shellExecution: false,
    providerInvocation: false,

    executionStatus: 'blocked',

    result: null,

    reason:
      'Safe local execution blocked because the execution identity was already applied.',
  }
}

export function createRuntimeToolExecutionReplayProtector():
  RuntimeToolExecutionReplayProtector {
  const appliedExecutions = new Set<string>()

  return {
    execute(
      envelope: RuntimeToolExecutionInvocationEnvelope,
    ): RuntimeToolExecutionReplayProtectedResult {
      const replayKey = createReplayKey(envelope)

      if (appliedExecutions.has(replayKey)) {
        return {
          replayKey,
          replayDetected: true,
          replayBlocked: true,
          execution: createReplayBlockedExecution(envelope),
        }
      }

      const governedAttempt =
        executeRuntimeToolWithAttemptGovernance(envelope)
      const execution = governedAttempt.execution

      if (execution.executionApplied) {
        appliedExecutions.add(replayKey)
      }

      return {
        replayKey,
        replayDetected: false,
        replayBlocked: false,
        execution,
      }
    },

    registeredExecutions(): number {
      return appliedExecutions.size
    },
  }
}
