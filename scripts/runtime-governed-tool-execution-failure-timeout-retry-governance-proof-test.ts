import assert from 'node:assert/strict'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'
import {
  createRuntimeToolExecutionAttemptGovernor,
} from '../app/lib/orchestrator/runtime-tool-execution-attempt-governance'
import type {
  RuntimeToolSafeLocalExecutionResult,
} from '../app/lib/orchestrator/runtime-tool-safe-local-executor'

function envelope(
  retries = 1,
): RuntimeToolExecutionInvocationEnvelope {
  return {
    toolId: 'runtime.validation',
    executionKey: 'v287.8-execution',
    correlationId: 'v287.8-correlation',
    traceId: 'v287.8-trace',
    stepId: 'v287.8-step',
    validatedInput: Object.freeze({}),
    idempotencyKey: 'v287.8-idempotency',
    policy: {
      category: 'validation',
      risk: 'medium',
      timeoutMs: 1500,
      retries,
      critical: true,
    },
    adapterAccepted: true,
    invocationPrepared: true,
    executionApplied: false,
    mutationApplied: false,
  }
}

function execution(
  input: RuntimeToolExecutionInvocationEnvelope,
  applied: boolean,
): RuntimeToolSafeLocalExecutionResult {
  return {
    toolId: input.toolId,
    executionKey: input.executionKey,
    correlationId: input.correlationId,
    traceId: input.traceId,
    stepId: input.stepId,

    executorEligible: true,
    executorSelected: true,

    executionAttempted: true,
    executionApplied: applied,
    mutationApplied: false,

    networkAccess: false,
    externalMutation: false,
    shellExecution: false,
    providerInvocation: false,

    executionStatus: applied ? 'executed' : 'blocked',
    result: null,
    reason: applied ? 'success' : 'blocked',
  }
}

const input = envelope()

let successCalls = 0
const success = createRuntimeToolExecutionAttemptGovernor(candidate => {
  successCalls += 1
  return execution(candidate, true)
}).execute(input)

assert.equal(successCalls, 1)
assert.equal(success.attemptCount, 1)
assert.equal(success.retriesUsed, 0)
assert.equal(success.failureCategory, 'none')
assert.equal(success.execution.executionApplied, true)
assert.equal(success.execution.mutationApplied, false)

let retryCalls = 0
const retry = createRuntimeToolExecutionAttemptGovernor(candidate => {
  retryCalls += 1

  if (retryCalls === 1) {
    throw new Error('synthetic executor failure')
  }

  return execution(candidate, true)
}).execute(input)

assert.equal(retryCalls, 2)
assert.equal(retry.attemptCount, 2)
assert.equal(retry.retriesUsed, 1)
assert.equal(retry.failureCategory, 'none')
assert.equal(retry.execution.executionApplied, true)

let blockedCalls = 0
const blocked = createRuntimeToolExecutionAttemptGovernor(candidate => {
  blockedCalls += 1
  return execution(candidate, false)
}).execute(input)

assert.equal(blockedCalls, 1)
assert.equal(blocked.attemptCount, 1)
assert.equal(blocked.retriesUsed, 0)
assert.equal(blocked.failureCategory, 'blocked')
assert.equal(blocked.execution.executionApplied, false)

let exhaustedCalls = 0
const exhausted = createRuntimeToolExecutionAttemptGovernor(() => {
  exhaustedCalls += 1
  throw new Error('persistent synthetic failure')
}).execute(input)

assert.equal(exhaustedCalls, 2)
assert.equal(exhausted.maxAttempts, 2)
assert.equal(exhausted.attemptCount, 2)
assert.equal(exhausted.retriesUsed, 1)
assert.equal(exhausted.failureCategory, 'executor-error')
assert.equal(exhausted.execution.executionApplied, false)
assert.equal(exhausted.execution.mutationApplied, false)

let zeroRetryCalls = 0
const zeroRetry = createRuntimeToolExecutionAttemptGovernor(() => {
  zeroRetryCalls += 1
  throw new Error('zero retry synthetic failure')
}).execute(envelope(0))

assert.equal(zeroRetryCalls, 1)
assert.equal(zeroRetry.maxAttempts, 1)
assert.equal(zeroRetry.retriesUsed, 0)

assert.equal(success.timeoutMs, 1500)
assert.equal(success.timeoutEnforced, false)
assert.equal(
  success.timeoutSemantics,
  'declared-budget-sync-nonpreemptive',
)

console.log(JSON.stringify({
  architecture:
    'governed-tool-execution-failure-timeout-retry-governance',

  success: {
    singleAttempt: successCalls === 1,
    executionApplied: success.execution.executionApplied,
  },

  retry: {
    executorErrorRetried: retryCalls === 2,
    executionApplied: retry.execution.executionApplied,
  },

  blocked: {
    notRetried: blockedCalls === 1,
    executionApplied: blocked.execution.executionApplied,
  },

  exhausted: {
    attemptLimitRespected:
      exhaustedCalls === exhausted.maxAttempts,
    failureCategory: exhausted.failureCategory,
    mutationApplied: exhausted.execution.mutationApplied,
  },

  timeout: {
    timeoutMs: success.timeoutMs,
    timeoutEnforced: success.timeoutEnforced,
    preemptiveTimeout: false,
  },
}, null, 2))
