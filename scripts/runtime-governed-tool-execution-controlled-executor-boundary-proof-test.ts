import assert from 'node:assert/strict'

import {
  createRuntimeToolExecutionInvocationEnvelope,
  type RuntimeToolExecutionInvocationPreparation,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolExecutionAdapterDecision,
} from '../app/lib/orchestrator/runtime-tool-execution-adapter'

import {
  evaluateRuntimeToolControlledExecutorBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

const acceptedDecision: RuntimeToolExecutionAdapterDecision = {
  executionKey: 'v287.5-execution',
  correlationId: 'v287.5-correlation',
  traceId: 'v287.5-trace',
  stepId: 'v287.5-step',

  adapterAccepted: true,
  executionApplied: false,
  mutationApplied: false,

  adapterStatus: 'accepted',
  reason: 'Governed adapter accepted the request.',
}

const preparation: RuntimeToolExecutionInvocationPreparation = {
  toolId: 'memory.search',

  validatedInput: {
    query: 'governed-memory',
    limit: 5,
  },

  idempotencyKey:
    'v287.5-execution:v287.5-step:memory.search',

  policy: {
    category: 'memory',
    risk: 'low',
    timeoutMs: 2000,
    retries: 2,
    critical: false,
  },
}

const envelope =
  createRuntimeToolExecutionInvocationEnvelope(
    acceptedDecision,
    preparation,
  )

assert.ok(envelope)

const eligible =
  evaluateRuntimeToolControlledExecutorBoundary(envelope)

assert.equal(eligible.invocationPrepared, true)
assert.equal(eligible.toolRegistered, true)
assert.equal(eligible.toolAllowed, true)
assert.equal(eligible.policyMatched, true)

assert.equal(eligible.executorEligible, true)
assert.equal(eligible.executorBoundaryStatus, 'eligible')

assert.equal(eligible.executionApplied, false)
assert.equal(eligible.mutationApplied, false)

assert.equal(
  eligible.executionKey,
  acceptedDecision.executionKey,
)

assert.equal(
  eligible.correlationId,
  acceptedDecision.correlationId,
)

assert.equal(
  eligible.traceId,
  acceptedDecision.traceId,
)

assert.equal(
  eligible.stepId,
  acceptedDecision.stepId,
)

const policyMismatch = {
  ...envelope,
  policy: {
    ...envelope.policy,
    timeoutMs: 1,
  },
}

const policyMismatchDecision =
  evaluateRuntimeToolControlledExecutorBoundary(
    policyMismatch,
  )

assert.equal(policyMismatchDecision.toolRegistered, true)
assert.equal(policyMismatchDecision.toolAllowed, true)
assert.equal(policyMismatchDecision.policyMatched, false)
assert.equal(policyMismatchDecision.executorEligible, false)
assert.equal(
  policyMismatchDecision.executorBoundaryStatus,
  'blocked',
)
assert.equal(policyMismatchDecision.executionApplied, false)
assert.equal(policyMismatchDecision.mutationApplied, false)

const unknownTool = {
  ...envelope,
  toolId: 'unknown.tool',
}

const unknownToolDecision =
  evaluateRuntimeToolControlledExecutorBoundary(
    unknownTool,
  )

assert.equal(unknownToolDecision.toolRegistered, false)
assert.equal(unknownToolDecision.toolAllowed, false)
assert.equal(unknownToolDecision.policyMatched, false)
assert.equal(unknownToolDecision.executorEligible, false)
assert.equal(
  unknownToolDecision.executorBoundaryStatus,
  'blocked',
)
assert.equal(unknownToolDecision.executionApplied, false)
assert.equal(unknownToolDecision.mutationApplied, false)

const invalidInvocation = {
  ...envelope,
  idempotencyKey: '',
}

const invalidInvocationDecision =
  evaluateRuntimeToolControlledExecutorBoundary(
    invalidInvocation,
  )

assert.equal(
  invalidInvocationDecision.invocationPrepared,
  false,
)
assert.equal(
  invalidInvocationDecision.executorEligible,
  false,
)
assert.equal(
  invalidInvocationDecision.executorBoundaryStatus,
  'blocked',
)
assert.equal(
  invalidInvocationDecision.executionApplied,
  false,
)
assert.equal(
  invalidInvocationDecision.mutationApplied,
  false,
)

console.log(
  'Runtime governed tool execution controlled executor boundary proof passed.',
)

console.log({
  architecture:
    'governed-tool-execution-controlled-executor-boundary',

  toolId: eligible.toolId,

  invocationPrepared:
    eligible.invocationPrepared,

  toolRegistered:
    eligible.toolRegistered,

  toolAllowed:
    eligible.toolAllowed,

  policyMatched:
    eligible.policyMatched,

  executorEligible:
    eligible.executorEligible,

  executionApplied:
    eligible.executionApplied,

  mutationApplied:
    eligible.mutationApplied,

  policyMismatchBlocked:
    !policyMismatchDecision.executorEligible,

  unknownToolBlocked:
    !unknownToolDecision.executorEligible,

  invalidInvocationBlocked:
    !invalidInvocationDecision.executorEligible,
})
