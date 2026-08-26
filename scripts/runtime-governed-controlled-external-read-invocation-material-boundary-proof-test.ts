import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-invocation-material-boundary'

const handoff = {
  executionKey: 'execution-v28743',
  correlationId: 'correlation-v28743',
  traceId: 'trace-v28743',
  stepId: 'step-v28743',

  externalReadAuthorizationEvaluated: true as const,
  externalReadAuthorized: true,
  externalReadExecutionEligible: true,

  effectHandoffPrepared: true,
  effectHandoffStatus: 'prepared' as const,

  networkAccess: false as const,
  externalReadApplied: false as const,
  executionApplied: false as const,
  mutationApplied: false as const,
  providerInvocation: false as const,

  reason: 'prepared for proof',
}

const first =
  evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary({
    handoff,
    target: {
      protocol: 'https',
      host: ' Example.COM ',
      resource: '/technology',
    },
  })

assert.equal(first.materialPrepared, true)
assert.ok(first.preparationInput)

assert.equal(first.preparationInput.toolId, 'external.read')
assert.equal(first.preparationInput.executionKey, 'execution-v28743')
assert.equal(first.preparationInput.stepId, 'step-v28743')

assert.deepEqual(first.preparationInput.validatedInput, {
  target: {
    protocol: 'https',
    host: 'example.com',
    resource: '/technology',
  },
})

assert.deepEqual(first.preparationInput.policy, {
  category: 'execution',
  risk: 'high',
  timeoutMs: 3000,
  retries: 0,
  critical: true,
})

assert.match(
  first.preparationInput.idempotencyKey,
  /^external\.read:[a-f0-9]{64}$/,
)

const second =
  evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary({
    handoff,
    target: {
      protocol: 'https',
      host: ' Example.COM ',
      resource: '/technology',
    },
  })

assert.equal(
  second.preparationInput?.idempotencyKey,
  first.preparationInput.idempotencyKey,
)

const blocked =
  evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary({
    handoff: {
      ...handoff,
      effectHandoffPrepared: false,
      effectHandoffStatus: 'blocked',
    },
    target: {
      protocol: 'https',
      host: 'example.com',
      resource: '/technology',
    },
  })

assert.equal(blocked.materialPrepared, false)
assert.equal(blocked.preparationInput, null)

assert.equal(first.networkAccess, false)
assert.equal(first.externalReadApplied, false)
assert.equal(first.executionApplied, false)
assert.equal(first.mutationApplied, false)
assert.equal(first.providerInvocation, false)

console.log(
  'Runtime governed controlled external read invocation material boundary proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-invocation-material-boundary',
  materialPrepared: first.materialPrepared,
  toolId: first.preparationInput.toolId,
  targetNormalized: true,
  deterministicIdempotencyKey:
    second.preparationInput?.idempotencyKey ===
    first.preparationInput.idempotencyKey,
  blockedHandoffRejected: blocked.preparationInput === null,
  networkAccess: first.networkAccess,
  externalReadApplied: first.externalReadApplied,
  executionApplied: first.executionApplied,
  mutationApplied: first.mutationApplied,
  providerInvocation: first.providerInvocation,
})
