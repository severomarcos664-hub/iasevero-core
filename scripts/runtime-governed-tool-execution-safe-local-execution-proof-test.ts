import assert from 'node:assert/strict'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'
import {
  executeRuntimeToolSafeLocal,
} from '../app/lib/orchestrator/runtime-tool-safe-local-executor'

function createEnvelope(
  overrides: Partial<RuntimeToolExecutionInvocationEnvelope> = {},
): RuntimeToolExecutionInvocationEnvelope {
  return {
    toolId: 'runtime.validation',

    executionKey: 'v287.6-execution',
    correlationId: 'v287.6-correlation',
    traceId: 'v287.6-trace',
    stepId: 'v287.6-step',

    validatedInput: Object.freeze({
      nodes: [
        {
          module: 'runtime-a',
          dependencies: ['runtime-b'],
        },
        {
          module: 'runtime-b',
          dependencies: [],
        },
      ],
      totalNodes: 2,
      totalEdges: 1,
    }),

    idempotencyKey: 'v287.6-idempotency',

    policy: {
      category: 'validation',
      risk: 'medium',
      timeoutMs: 1500,
      retries: 1,
      critical: true,
    },

    adapterAccepted: true,
    invocationPrepared: true,

    executionApplied: false,
    mutationApplied: false,

    ...overrides,
  }
}

const positive = executeRuntimeToolSafeLocal(
  createEnvelope(),
)

assert.equal(positive.executorEligible, true)
assert.equal(positive.executorSelected, true)
assert.equal(positive.executionAttempted, true)
assert.equal(positive.executionApplied, true)
assert.equal(positive.mutationApplied, false)

assert.equal(positive.networkAccess, false)
assert.equal(positive.externalMutation, false)
assert.equal(positive.shellExecution, false)
assert.equal(positive.providerInvocation, false)

assert.equal(positive.executionStatus, 'executed')
assert.notEqual(positive.result, null)
assert.equal(positive.result?.valid, true)
assert.equal(positive.result?.totalNodes, 2)
assert.equal(positive.result?.totalEdges, 1)

const repeated = executeRuntimeToolSafeLocal(
  createEnvelope(),
)

assert.deepEqual(repeated.result, positive.result)

const nonAllowlisted = executeRuntimeToolSafeLocal(
  createEnvelope({
    toolId: 'memory.search',
    policy: {
      category: 'memory',
      risk: 'low',
      timeoutMs: 2000,
      retries: 2,
      critical: false,
    },
  }),
)

assert.equal(nonAllowlisted.executorEligible, true)
assert.equal(nonAllowlisted.executorSelected, false)
assert.equal(nonAllowlisted.executionAttempted, false)
assert.equal(nonAllowlisted.executionApplied, false)
assert.equal(nonAllowlisted.mutationApplied, false)
assert.equal(nonAllowlisted.executionStatus, 'blocked')
assert.equal(nonAllowlisted.result, null)

const invalidInput = executeRuntimeToolSafeLocal(
  createEnvelope({
    validatedInput: Object.freeze({
      nodes: [
        {
          module: 'runtime-a',
          dependencies: ['runtime-b'],
        },
      ],
      totalNodes: 999,
      totalEdges: 1,
    }),
  }),
)

assert.equal(invalidInput.executorEligible, true)
assert.equal(invalidInput.executorSelected, true)
assert.equal(invalidInput.executionAttempted, false)
assert.equal(invalidInput.executionApplied, false)
assert.equal(invalidInput.mutationApplied, false)
assert.equal(invalidInput.executionStatus, 'blocked')
assert.equal(invalidInput.result, null)

const policyMismatch = executeRuntimeToolSafeLocal(
  createEnvelope({
    policy: {
      category: 'validation',
      risk: 'low',
      timeoutMs: 100,
      retries: 0,
      critical: false,
    },
  }),
)

assert.equal(policyMismatch.executorEligible, false)
assert.equal(policyMismatch.executorSelected, false)
assert.equal(policyMismatch.executionAttempted, false)
assert.equal(policyMismatch.executionApplied, false)
assert.equal(policyMismatch.mutationApplied, false)
assert.equal(policyMismatch.executionStatus, 'blocked')
assert.equal(policyMismatch.result, null)

const proof = {
  architecture:
    'governed-tool-execution-safe-local-execution',

  positive: {
    executorEligible: positive.executorEligible,
    executorSelected: positive.executorSelected,
    executionAttempted: positive.executionAttempted,
    executionApplied: positive.executionApplied,
    mutationApplied: positive.mutationApplied,
    networkAccess: positive.networkAccess,
    externalMutation: positive.externalMutation,
    shellExecution: positive.shellExecution,
    providerInvocation: positive.providerInvocation,
    deterministicResult:
      JSON.stringify(repeated.result) ===
      JSON.stringify(positive.result),
  },

  negative: {
    nonAllowlistedToolBlocked:
      nonAllowlisted.executionApplied === false,
    invalidInputBlocked:
      invalidInput.executionApplied === false,
    policyMismatchBlocked:
      policyMismatch.executionApplied === false,
  },
}

console.log(JSON.stringify(proof, null, 2))
