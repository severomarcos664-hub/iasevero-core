import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'
import type {
  RuntimeToolSafeLocalExecutionResult,
} from './runtime-tool-safe-local-executor'
import {
executeRuntimeToolWithAttemptGovernance,
  evaluateRuntimeToolControlledExternalReadWithAttemptGovernance,
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy,
  type RuntimeToolControlledExternalReadAttemptGovernanceResult,
  type RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult,
} from './runtime-tool-execution-attempt-governance'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from './runtime-tool-controlled-external-read-contract'

export type RuntimeToolExecutionReplayProtectedResult = {
  replayKey: string
  replayDetected: boolean
  replayBlocked: boolean

  execution: RuntimeToolSafeLocalExecutionResult
}

export type RuntimeToolControlledExternalReadReplayProtectionIntegrationResult = {
  replayKey: string
  replayDetected: boolean
  replayBlocked: boolean

  contract: RuntimeToolControlledExternalReadAttemptGovernanceResult
  timeout: RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  externalMutation: false
  mutationApplied: false
  providerInvocation: false
}

export type RuntimeToolExecutionReplayProtector = {
  execute(
    envelope: RuntimeToolExecutionInvocationEnvelope,
  ): RuntimeToolExecutionReplayProtectedResult

  evaluateControlledExternalRead(
    input: RuntimeToolControlledExternalReadContractInput,
    envelope: RuntimeToolExecutionInvocationEnvelope,
  ): RuntimeToolControlledExternalReadReplayProtectionIntegrationResult

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

    evaluateControlledExternalRead(input, envelope) {
      const replayKey = createReplayKey(envelope)
      const replayDetected = appliedExecutions.has(replayKey)

      if (replayDetected) {
        return {
          replayKey,
          replayDetected: true,
          replayBlocked: true,
          contract:
            evaluateRuntimeToolControlledExternalReadWithAttemptGovernance(input),
          timeout:
            reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
              input,
              envelope,
            ),
          networkAccess: false,
          externalReadApplied: false,
          executionApplied: false,
          externalMutation: false,
          mutationApplied: false,
          providerInvocation: false,
        }
      }

      const contract =
        evaluateRuntimeToolControlledExternalReadWithAttemptGovernance(input)

      const timeout =
        reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
          input,
          envelope,
        )

      return {
        replayKey,
        replayDetected: false,
        replayBlocked: false,
        contract,
        timeout,
        networkAccess: false,
        externalReadApplied: false,
        executionApplied: false,
        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
      }
    },

    registeredExecutions(): number {
      return appliedExecutions.size
    },
  }
}
