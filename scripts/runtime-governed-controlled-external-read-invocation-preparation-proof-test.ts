import assert from 'node:assert/strict'

import {
  createRuntimeToolRegistry,
} from '../app/lib/runtime-core/runtime-tool-registry'

import {
  prepareRuntimeToolControlledExternalReadInvocation,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-invocation-preparation'

const registry = createRuntimeToolRegistry()

const externalReadTool = registry.tools.find(
  (tool) => tool.id === 'external.read',
)

assert.ok(
  externalReadTool,
  'Controlled external read must be registered before invocation preparation.',
)

assert.equal(
  externalReadTool.allowed,
  false,
  'Invocation preparation must not imply tool authorization.',
)

const prepared = prepareRuntimeToolControlledExternalReadInvocation({
  executionKey: 'execution-v28742',
  correlationId: 'correlation-v28742',
  traceId: 'trace-v28742',
  stepId: 'step-v28742',
  toolId: externalReadTool.id,

  validatedInput: {
    target: {
      protocol: 'https',
      host: 'example.com',
      resource: '/technology',
    },
  },

  idempotencyKey: 'external.read:execution-v28742:step-v28742',

  policy: {
    category: externalReadTool.category,
    risk: externalReadTool.risk,
    timeoutMs: externalReadTool.timeoutMs,
    retries: externalReadTool.retries,
    critical: externalReadTool.critical,
  },
})

assert.ok(prepared)

assert.equal(prepared.toolId, 'external.read')
assert.equal(prepared.executionKey, 'execution-v28742')
assert.equal(prepared.correlationId, 'correlation-v28742')
assert.equal(prepared.traceId, 'trace-v28742')
assert.equal(prepared.stepId, 'step-v28742')

assert.equal(
  prepared.idempotencyKey,
  'external.read:execution-v28742:step-v28742',
)

assert.equal(prepared.invocationPreparationValidated, true)

assert.equal(prepared.networkAccess, false)
assert.equal(prepared.externalReadApplied, false)
assert.equal(prepared.executionApplied, false)
assert.equal(prepared.mutationApplied, false)
assert.equal(prepared.providerInvocation, false)

console.log(
  'Runtime governed controlled external read invocation preparation proof passed.',
)

console.log({
  architecture: 'governed-controlled-external-read-invocation-preparation',
  toolId: prepared.toolId,
  invocationPreparationValidated: prepared.invocationPreparationValidated,
  networkAccess: prepared.networkAccess,
  externalReadApplied: prepared.externalReadApplied,
  executionApplied: prepared.executionApplied,
  mutationApplied: prepared.mutationApplied,
  providerInvocation: prepared.providerInvocation,
})

assert.throws(
  () =>
    prepareRuntimeToolControlledExternalReadInvocation({
      executionKey: '',
      correlationId: 'correlation-v28742',
      traceId: 'trace-v28742',
      stepId: 'step-v28742',
      toolId: 'external.read',
      validatedInput: {},
      idempotencyKey: 'idempotency-v28742',
      policy: {
        category: 'execution',
        risk: 'high',
        timeoutMs: 3000,
        retries: 0,
        critical: true,
      },
    }),
  /executionKey/,
)

assert.throws(
  () =>
    prepareRuntimeToolControlledExternalReadInvocation({
      executionKey: 'execution-v28742',
      correlationId: 'correlation-v28742',
      traceId: 'trace-v28742',
      stepId: 'step-v28742',
      toolId: 'runtime.validation',
      validatedInput: {},
      idempotencyKey: 'idempotency-v28742',
      policy: {
        category: 'execution',
        risk: 'high',
        timeoutMs: 3000,
        retries: 0,
        critical: true,
      },
    }),
  /external\.read/,
)

assert.throws(
  () =>
    prepareRuntimeToolControlledExternalReadInvocation({
      executionKey: 'execution-v28742',
      correlationId: 'correlation-v28742',
      traceId: 'trace-v28742',
      stepId: 'step-v28742',
      toolId: 'external.read',
      validatedInput: {},
      idempotencyKey: 'idempotency-v28742',
      policy: {
        category: 'execution',
        risk: 'high',
        timeoutMs: 0,
        retries: 0,
        critical: true,
      },
    }),
  /timeoutMs/,
)

assert.throws(
  () =>
    prepareRuntimeToolControlledExternalReadInvocation({
      executionKey: 'execution-v28742',
      correlationId: 'correlation-v28742',
      traceId: 'trace-v28742',
      stepId: 'step-v28742',
      toolId: 'external.read',
      validatedInput: {},
      idempotencyKey: 'idempotency-v28742',
      policy: {
        category: 'execution',
        risk: 'high',
        timeoutMs: 3000,
        retries: -1,
        critical: true,
      },
    }),
  /retries/,
)

console.log('NEGATIVE_PATHS_PASSED=1')
