import assert from 'node:assert/strict'

import {
  createRuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolExecutionAdapterDecision,
} from '../app/lib/orchestrator/runtime-tool-execution-adapter'

const acceptedDecision: RuntimeToolExecutionAdapterDecision = {
  executionKey: 'v287.4-execution',
  correlationId: 'v287.4-correlation',
  traceId: 'v287.4-trace',
  stepId: 'v287.4-step',

  adapterAccepted: true,
  executionApplied: false,
  mutationApplied: false,

  adapterStatus: 'accepted',
  reason:
    'Governed tool execution adapter contract accepted the handoff without applying execution.',
}

const envelope = createRuntimeToolExecutionInvocationEnvelope(
  acceptedDecision,
  {
    toolId: 'memory.search',

    validatedInput: {
      query: 'governed-memory',
      limit: 5,
    },

    idempotencyKey:
      'v287.4-execution:v287.4-step:memory.search',

    policy: {
      category: 'memory',
      risk: 'low',
      timeoutMs: 2000,
      retries: 1,
      critical: false,
    },
  },
)

assert.ok(envelope)

assert.equal(envelope.toolId, 'memory.search')

assert.equal(
  envelope.executionKey,
  acceptedDecision.executionKey,
)

assert.equal(
  envelope.correlationId,
  acceptedDecision.correlationId,
)

assert.equal(
  envelope.traceId,
  acceptedDecision.traceId,
)

assert.equal(
  envelope.stepId,
  acceptedDecision.stepId,
)

assert.equal(envelope.adapterAccepted, true)
assert.equal(envelope.invocationPrepared, true)

assert.equal(envelope.executionApplied, false)
assert.equal(envelope.mutationApplied, false)

assert.equal(
  envelope.idempotencyKey,
  'v287.4-execution:v287.4-step:memory.search',
)

assert.equal(envelope.policy.category, 'memory')
assert.equal(envelope.policy.risk, 'low')
assert.equal(envelope.policy.timeoutMs, 2000)
assert.equal(envelope.policy.retries, 1)
assert.equal(envelope.policy.critical, false)

assert.deepEqual(envelope.validatedInput, {
  query: 'governed-memory',
  limit: 5,
})

assert.equal(
  Object.isFrozen(envelope.validatedInput),
  true,
)

const rejectedDecision: RuntimeToolExecutionAdapterDecision = {
  ...acceptedDecision,
  adapterAccepted: false,
  adapterStatus: 'rejected',
  reason: 'Governed adapter rejected the request.',
}

const rejectedEnvelope =
  createRuntimeToolExecutionInvocationEnvelope(
    rejectedDecision,
    {
      toolId: 'memory.search',
      validatedInput: {},
      idempotencyKey: 'rejected-key',
      policy: {
        category: 'memory',
        risk: 'low',
        timeoutMs: 2000,
        retries: 1,
        critical: false,
      },
    },
  )

assert.equal(rejectedEnvelope, null)

const invalidToolEnvelope =
  createRuntimeToolExecutionInvocationEnvelope(
    acceptedDecision,
    {
      toolId: '',
      validatedInput: {},
      idempotencyKey: 'invalid-tool-key',
      policy: {
        category: 'memory',
        risk: 'low',
        timeoutMs: 2000,
        retries: 1,
        critical: false,
      },
    },
  )

assert.equal(invalidToolEnvelope, null)

const invalidIdempotencyEnvelope =
  createRuntimeToolExecutionInvocationEnvelope(
    acceptedDecision,
    {
      toolId: 'memory.search',
      validatedInput: {},
      idempotencyKey: '',
      policy: {
        category: 'memory',
        risk: 'low',
        timeoutMs: 2000,
        retries: 1,
        critical: false,
      },
    },
  )

assert.equal(invalidIdempotencyEnvelope, null)

const invalidTimeoutEnvelope =
  createRuntimeToolExecutionInvocationEnvelope(
    acceptedDecision,
    {
      toolId: 'memory.search',
      validatedInput: {},
      idempotencyKey: 'invalid-timeout-key',
      policy: {
        category: 'memory',
        risk: 'low',
        timeoutMs: 0,
        retries: 1,
        critical: false,
      },
    },
  )

assert.equal(invalidTimeoutEnvelope, null)

console.log(
  'Runtime governed tool execution invocation envelope proof passed.',
)

console.log({
  architecture:
    'governed-tool-execution-invocation-envelope',

  toolId: envelope.toolId,
  adapterAccepted: envelope.adapterAccepted,
  invocationPrepared: envelope.invocationPrepared,

  executionApplied: envelope.executionApplied,
  mutationApplied: envelope.mutationApplied,

  idempotencyKey: envelope.idempotencyKey,

  rejectedAdapterBlocked:
    rejectedEnvelope === null,

  invalidToolBlocked:
    invalidToolEnvelope === null,

  invalidIdempotencyBlocked:
    invalidIdempotencyEnvelope === null,

  invalidTimeoutBlocked:
    invalidTimeoutEnvelope === null,
})
