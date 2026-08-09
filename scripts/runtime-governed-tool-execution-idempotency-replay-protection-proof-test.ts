import assert from 'node:assert/strict'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'
import {
  createRuntimeToolExecutionReplayProtector,
} from '../app/lib/orchestrator/runtime-tool-execution-replay-protection'

function createEnvelope(
  overrides: Partial<RuntimeToolExecutionInvocationEnvelope> = {},
): RuntimeToolExecutionInvocationEnvelope {
  return {
    toolId: 'runtime.validation',

    executionKey: 'v287.7-execution',
    correlationId: 'v287.7-correlation',
    traceId: 'v287.7-trace',
    stepId: 'v287.7-step',

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

    idempotencyKey: 'v287.7-idempotency',

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

const protector =
  createRuntimeToolExecutionReplayProtector()

const first = protector.execute(
  createEnvelope(),
)

assert.equal(first.replayDetected, false)
assert.equal(first.replayBlocked, false)
assert.equal(first.execution.executionAttempted, true)
assert.equal(first.execution.executionApplied, true)
assert.equal(first.execution.mutationApplied, false)
assert.equal(protector.registeredExecutions(), 1)

const replay = protector.execute(
  createEnvelope(),
)

assert.equal(replay.replayKey, first.replayKey)
assert.equal(replay.replayDetected, true)
assert.equal(replay.replayBlocked, true)
assert.equal(replay.execution.executionAttempted, false)
assert.equal(replay.execution.executionApplied, false)
assert.equal(replay.execution.mutationApplied, false)
assert.equal(protector.registeredExecutions(), 1)

const differentIdempotencyKey = protector.execute(
  createEnvelope({
    idempotencyKey: 'v287.7-idempotency-2',
  }),
)

assert.notEqual(
  differentIdempotencyKey.replayKey,
  first.replayKey,
)
assert.equal(
  differentIdempotencyKey.replayDetected,
  false,
)
assert.equal(
  differentIdempotencyKey.replayBlocked,
  false,
)
assert.equal(
  differentIdempotencyKey.execution.executionApplied,
  true,
)
assert.equal(protector.registeredExecutions(), 2)

const blockedProtector =
  createRuntimeToolExecutionReplayProtector()

const blockedFirst = blockedProtector.execute(
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

assert.equal(blockedFirst.replayDetected, false)
assert.equal(blockedFirst.replayBlocked, false)
assert.equal(
  blockedFirst.execution.executionAttempted,
  false,
)
assert.equal(
  blockedFirst.execution.executionApplied,
  false,
)
assert.equal(
  blockedProtector.registeredExecutions(),
  0,
)

const allowedAfterBlocked =
  blockedProtector.execute(
    createEnvelope(),
  )

assert.equal(
  allowedAfterBlocked.replayDetected,
  false,
)
assert.equal(
  allowedAfterBlocked.replayBlocked,
  false,
)
assert.equal(
  allowedAfterBlocked.execution.executionAttempted,
  true,
)
assert.equal(
  allowedAfterBlocked.execution.executionApplied,
  true,
)
assert.equal(
  blockedProtector.registeredExecutions(),
  1,
)

const differentStep = protector.execute(
  createEnvelope({
    stepId: 'v287.7-step-2',
  }),
)

assert.notEqual(
  differentStep.replayKey,
  first.replayKey,
)
assert.equal(differentStep.replayDetected, false)
assert.equal(differentStep.replayBlocked, false)
assert.equal(
  differentStep.execution.executionApplied,
  true,
)

const proof = {
  architecture:
    'governed-tool-execution-idempotency-replay-protection',

  firstExecution: {
    replayDetected: first.replayDetected,
    replayBlocked: first.replayBlocked,
    executionAttempted:
      first.execution.executionAttempted,
    executionApplied:
      first.execution.executionApplied,
    mutationApplied:
      first.execution.mutationApplied,
  },

  replay: {
    replayDetected: replay.replayDetected,
    replayBlocked: replay.replayBlocked,
    executionAttempted:
      replay.execution.executionAttempted,
    executionApplied:
      replay.execution.executionApplied,
    mutationApplied:
      replay.execution.mutationApplied,
  },

  identitySemantics: {
    differentIdempotencyKeyAllowed:
      differentIdempotencyKey.execution
        .executionApplied === true,

    differentStepAllowed:
      differentStep.execution.executionApplied ===
      true,
  },

  registrationSemantics: {
    successfulExecutionRegistered: true,
    blockedExecutionNotRegistered:
      blockedFirst.execution.executionApplied ===
        false &&
      allowedAfterBlocked.execution
        .executionApplied === true,
  },

  scope: {
    processLocal: true,
    persistentAcrossProcesses: false,
    distributedReplayProtection: false,
    resultReuse: false,
  },
}

console.log(JSON.stringify(proof, null, 2))
