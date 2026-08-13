import {
  evaluateRuntimeToolControlledExternalReadContract,
  type RuntimeToolControlledExternalReadContractDecision,
  type RuntimeToolControlledExternalReadContractInput,
} from './runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'
import {
  executeRuntimeToolSafeLocal,
  type RuntimeToolSafeLocalExecutionResult,
} from './runtime-tool-safe-local-executor'

export type RuntimeToolExecutionFailureCategory =
  | 'none'
  | 'blocked'
  | 'executor-error'

export type RuntimeToolExecutionAttemptGovernanceResult = {
  timeoutMs: number
  timeoutEnforced: false
  timeoutSemantics: 'declared-budget-sync-nonpreemptive'

  retryBudget: number
  maxAttempts: number
  attemptCount: number
  retriesUsed: number

  failureCategory: RuntimeToolExecutionFailureCategory

  execution: RuntimeToolSafeLocalExecutionResult
}

export type RuntimeToolExecutionAttemptExecutor = (
  envelope: RuntimeToolExecutionInvocationEnvelope,
) => RuntimeToolSafeLocalExecutionResult

export type RuntimeToolControlledExternalReadContractEvaluator = (
  input: RuntimeToolControlledExternalReadContractInput,
) => RuntimeToolControlledExternalReadContractDecision


export type RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult = {
  timeoutMs: number
  timeoutPolicyValid: boolean
  timeoutPolicyReconciled: boolean

  contractEvaluated: true
  contract: RuntimeToolControlledExternalReadContractDecision

  executorInvoked: false
  networkAccess: false
  externalReadApplied: false
  executionApplied: false

  externalMutation: false
  mutationApplied: false
  providerInvocation: false
}

export type RuntimeToolControlledExternalReadAttemptGovernanceResult = {
  contractEvaluated: true
  contract: RuntimeToolControlledExternalReadContractDecision
  executorInvoked: false
  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  externalMutation: false
  mutationApplied: false
  providerInvocation: false
}

export type RuntimeToolExecutionAttemptGovernor = {
  evaluateControlledExternalReadContract(
    input: RuntimeToolControlledExternalReadContractInput,
  ): RuntimeToolControlledExternalReadAttemptGovernanceResult

  reconcileControlledExternalReadTimeoutPolicy(
    input: RuntimeToolControlledExternalReadContractInput,
    envelope: RuntimeToolExecutionInvocationEnvelope,
  ): RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult

  execute(
    envelope: RuntimeToolExecutionInvocationEnvelope,
  ): RuntimeToolExecutionAttemptGovernanceResult
}

function createExecutorErrorExecution(
  envelope: RuntimeToolExecutionInvocationEnvelope,
  reason: string,
): RuntimeToolSafeLocalExecutionResult {
  return {
    toolId: envelope.toolId,

    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    executorEligible: true,
    executorSelected: true,

    executionAttempted: true,
    executionApplied: false,
    mutationApplied: false,

    networkAccess: false,
    externalMutation: false,
    shellExecution: false,
    providerInvocation: false,

    executionStatus: 'blocked',

    result: null,

    reason,
  }
}

export function createRuntimeToolExecutionAttemptGovernor(
  executor: RuntimeToolExecutionAttemptExecutor =
    executeRuntimeToolSafeLocal,
  controlledExternalReadContractEvaluator:
    RuntimeToolControlledExternalReadContractEvaluator =
      evaluateRuntimeToolControlledExternalReadContract,
): RuntimeToolExecutionAttemptGovernor {
  return {
    evaluateControlledExternalReadContract(
      input: RuntimeToolControlledExternalReadContractInput,
    ): RuntimeToolControlledExternalReadAttemptGovernanceResult {
      const contract =
        controlledExternalReadContractEvaluator(input)

      return {
        contractEvaluated: true,
        contract,
        executorInvoked: false,
        networkAccess: false,
        externalReadApplied: false,
        executionApplied: false,
        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
      }
    },

    reconcileControlledExternalReadTimeoutPolicy(
      input: RuntimeToolControlledExternalReadContractInput,
      envelope: RuntimeToolExecutionInvocationEnvelope,
    ): RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult {
      const contract =
        controlledExternalReadContractEvaluator(input)

      const timeoutMs = envelope.policy.timeoutMs

      const timeoutPolicyValid =
        Number.isFinite(timeoutMs) &&
        timeoutMs > 0

      const timeoutPolicyReconciled =
        contract.contractEligible === true &&
        timeoutPolicyValid

      return {
        timeoutMs,
        timeoutPolicyValid,
        timeoutPolicyReconciled,

        contractEvaluated: true,
        contract,

        executorInvoked: false,
        networkAccess: false,
        externalReadApplied: false,
        executionApplied: false,

        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
      }
    },

    execute(
      envelope: RuntimeToolExecutionInvocationEnvelope,
    ): RuntimeToolExecutionAttemptGovernanceResult {
      const retryBudget = envelope.policy.retries
      const maxAttempts = retryBudget + 1

      let attemptCount = 0
      let lastErrorReason =
        'Governed local execution failed without a classified executor result.'

      while (attemptCount < maxAttempts) {
        attemptCount += 1

        try {
          const execution = executor(envelope)

          if (execution.executionApplied) {
            return {
              timeoutMs: envelope.policy.timeoutMs,
              timeoutEnforced: false,
              timeoutSemantics: 'declared-budget-sync-nonpreemptive',

              retryBudget,
              maxAttempts,
              attemptCount,
              retriesUsed: attemptCount - 1,

              failureCategory: 'none',

              execution,
            }
          }

          return {
            timeoutMs: envelope.policy.timeoutMs,
            timeoutEnforced: false,
            timeoutSemantics: 'declared-budget-sync-nonpreemptive',

            retryBudget,
            maxAttempts,
            attemptCount,
            retriesUsed: attemptCount - 1,

            failureCategory: 'blocked',

            execution,
          }
        } catch (error) {
          lastErrorReason =
            error instanceof Error
              ? error.message
              : 'Unknown governed local executor error.'
        }
      }

      return {
        timeoutMs: envelope.policy.timeoutMs,
        timeoutEnforced: false,
        timeoutSemantics: 'declared-budget-sync-nonpreemptive',

        retryBudget,
        maxAttempts,
        attemptCount,
        retriesUsed: Math.max(0, attemptCount - 1),

        failureCategory: 'executor-error',

        execution: createExecutorErrorExecution(
          envelope,
          `Safe local executor failed after ${attemptCount} governed attempt(s): ${lastErrorReason}`,
        ),
      }
    },
  }
}

const defaultRuntimeToolExecutionAttemptGovernor =
  createRuntimeToolExecutionAttemptGovernor()

export function evaluateRuntimeToolControlledExternalReadWithAttemptGovernance(
  input: RuntimeToolControlledExternalReadContractInput,
): RuntimeToolControlledExternalReadAttemptGovernanceResult {
  return defaultRuntimeToolExecutionAttemptGovernor
    .evaluateControlledExternalReadContract(input)
}

export function reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
  input: RuntimeToolControlledExternalReadContractInput,
  envelope: RuntimeToolExecutionInvocationEnvelope,
): RuntimeToolControlledExternalReadTimeoutPolicyReconciliationResult {
  return defaultRuntimeToolExecutionAttemptGovernor
    .reconcileControlledExternalReadTimeoutPolicy(input, envelope)
}

export function executeRuntimeToolWithAttemptGovernance(
  envelope: RuntimeToolExecutionInvocationEnvelope,
): RuntimeToolExecutionAttemptGovernanceResult {
  return defaultRuntimeToolExecutionAttemptGovernor.execute(envelope)
}
