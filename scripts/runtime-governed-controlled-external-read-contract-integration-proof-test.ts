import {
  createRuntimeToolExecutionAttemptGovernor,
  evaluateRuntimeToolControlledExternalReadWithAttemptGovernance,
  type RuntimeToolControlledExternalReadContractEvaluator,
  type RuntimeToolExecutionAttemptExecutor,
} from '../app/lib/orchestrator/runtime-tool-execution-attempt-governance'

import type {
  RuntimeToolControlledExternalReadContractDecision,
  RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

function assert(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

let assertionCount = 0

function expect(
  condition: boolean,
  message: string,
): void {
  assertionCount += 1
  assert(condition, message)
}

const contractInput = Object.freeze({
  fixture: 'v287.10-contract-integration',
}) as unknown as RuntimeToolControlledExternalReadContractInput

const eligibleDecision = Object.freeze({
  fixture: 'eligible-contract-decision',
}) as unknown as RuntimeToolControlledExternalReadContractDecision

let eligibleEvaluatorInvocations = 0
let eligibleExecutorInvocations = 0

let observedInput:
  | RuntimeToolControlledExternalReadContractInput
  | null = null

const neverEligibleExecutor:
  RuntimeToolExecutionAttemptExecutor = () => {
    eligibleExecutorInvocations += 1

    throw new Error(
      'External-read contract assessment must not invoke executor.',
    )
  }

const eligibleEvaluator:
  RuntimeToolControlledExternalReadContractEvaluator = input => {
    eligibleEvaluatorInvocations += 1
    observedInput = input
    return eligibleDecision
  }

const eligibleGovernor =
  createRuntimeToolExecutionAttemptGovernor(
    neverEligibleExecutor,
    eligibleEvaluator,
  )

const eligible =
  eligibleGovernor.evaluateControlledExternalReadContract(
    contractInput,
  )

expect(
  eligible.contractEvaluated === true,
  'Contract must be evaluated.',
)

expect(
  eligible.contract === eligibleDecision,
  'Contract decision identity must be preserved.',
)

expect(
  eligibleEvaluatorInvocations === 1,
  'Contract evaluator must execute exactly once.',
)

expect(
  observedInput === contractInput,
  'Contract input identity must be preserved.',
)

expect(
  eligibleExecutorInvocations === 0,
  'Contract assessment must not invoke executor.',
)

expect(
  eligible.executorInvoked === false,
  'executorInvoked must remain false.',
)

expect(
  eligible.networkAccess === false,
  'networkAccess must remain false.',
)

expect(
  eligible.externalReadApplied === false,
  'externalReadApplied must remain false.',
)

expect(
  eligible.executionApplied === false,
  'executionApplied must remain false.',
)

expect(
  eligible.externalMutation === false,
  'externalMutation must remain false.',
)

expect(
  eligible.mutationApplied === false,
  'mutationApplied must remain false.',
)

expect(
  eligible.providerInvocation === false,
  'providerInvocation must remain false.',
)

const blockedDecision = Object.freeze({
  fixture: 'blocked-contract-decision',
}) as unknown as RuntimeToolControlledExternalReadContractDecision

let blockedEvaluatorInvocations = 0
let blockedExecutorInvocations = 0

const neverBlockedExecutor:
  RuntimeToolExecutionAttemptExecutor = () => {
    blockedExecutorInvocations += 1

    throw new Error(
      'Blocked external-read contract must not invoke executor.',
    )
  }

const blockedEvaluator:
  RuntimeToolControlledExternalReadContractEvaluator = () => {
    blockedEvaluatorInvocations += 1
    return blockedDecision
  }

const blockedGovernor =
  createRuntimeToolExecutionAttemptGovernor(
    neverBlockedExecutor,
    blockedEvaluator,
  )

const blocked =
  blockedGovernor.evaluateControlledExternalReadContract(
    contractInput,
  )

expect(
  blocked.contractEvaluated === true,
  'Blocked contract must still be evaluated.',
)

expect(
  blocked.contract === blockedDecision,
  'Blocked decision identity must be preserved.',
)

expect(
  blockedEvaluatorInvocations === 1,
  'Blocked evaluator must execute exactly once.',
)

expect(
  blockedExecutorInvocations === 0,
  'Blocked assessment must not invoke executor.',
)

expect(
  blocked.executorInvoked === false,
  'Blocked executorInvoked must remain false.',
)

expect(
  blocked.networkAccess === false,
  'Blocked networkAccess must remain false.',
)

expect(
  blocked.externalReadApplied === false,
  'Blocked externalReadApplied must remain false.',
)

expect(
  blocked.executionApplied === false,
  'Blocked executionApplied must remain false.',
)

expect(
  blocked.externalMutation === false,
  'Blocked externalMutation must remain false.',
)

expect(
  blocked.mutationApplied === false,
  'Blocked mutationApplied must remain false.',
)

expect(
  blocked.providerInvocation === false,
  'Blocked providerInvocation must remain false.',
)

expect(
  typeof evaluateRuntimeToolControlledExternalReadWithAttemptGovernance
    === 'function',
  'Default governed contract-integration entry must be exported.',
)

console.log(
  JSON.stringify(
    {
      version:
        'v287.10-governed-controlled-external-read-contract-integration-proof',

      positive: {
        contractEvaluated:
          eligible.contractEvaluated,
        evaluatorInvocations:
          eligibleEvaluatorInvocations,
        executorInvocations:
          eligibleExecutorInvocations,
        executorInvoked:
          eligible.executorInvoked,
        networkAccess:
          eligible.networkAccess,
        externalReadApplied:
          eligible.externalReadApplied,
        executionApplied:
          eligible.executionApplied,
        externalMutation:
          eligible.externalMutation,
        mutationApplied:
          eligible.mutationApplied,
        providerInvocation:
          eligible.providerInvocation,
      },

      negative: {
        contractEvaluated:
          blocked.contractEvaluated,
        evaluatorInvocations:
          blockedEvaluatorInvocations,
        executorInvocations:
          blockedExecutorInvocations,
        executorInvoked:
          blocked.executorInvoked,
        networkAccess:
          blocked.networkAccess,
        externalReadApplied:
          blocked.externalReadApplied,
        executionApplied:
          blocked.executionApplied,
        externalMutation:
          blocked.externalMutation,
        mutationApplied:
          blocked.mutationApplied,
        providerInvocation:
          blocked.providerInvocation,
      },

      invariants: {
        contractIntegrationIsNotExecution: true,
        assessmentOwnedByAttemptGovernance: true,
        executorNotInvokedByContractAssessment: true,
        networkAccessGranted: false,
        externalReadApplied: false,
        externalMutationApplied: false,
        providerInvocation: false,
      },

      assertionCount,
    },
    null,
    2,
  ),
)
