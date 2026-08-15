import assert from 'node:assert/strict'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

import {
  evaluateRuntimeToolControlledExternalReadContract,
  type RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import {
  executeRuntimeToolControlledExternalReadEffect,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect'

async function main(): Promise<void> {
const envelope: RuntimeToolExecutionInvocationEnvelope = {
  toolId: 'runtime.validation',
  executionKey: 'execution-v28716',
  correlationId: 'correlation-v28716',
  traceId: 'trace-v28716',
  stepId: 'step-v28716',

  validatedInput: {
    query: 'v287.16-real-external-read',
  },

  idempotencyKey: 'idempotency-v28716',

  policy: {
    category: 'validation',
    risk: 'low',
    timeoutMs: 1000,
    retries: 0,
    critical: false,
  },

  adapterAccepted: true,
  invocationPrepared: true,

  executionApplied: false,
  mutationApplied: false,
}

const boundary: RuntimeToolControlledExecutorBoundaryDecision = {
  toolId: envelope.toolId,

  executionKey: envelope.executionKey,
  correlationId: envelope.correlationId,
  traceId: envelope.traceId,
  stepId: envelope.stepId,

  invocationPrepared: true,

  toolRegistered: true,
  toolAllowed: true,
  policyMatched: true,

  executorEligible: true,
  executorBoundaryStatus: 'eligible',

  executionApplied: false,
  mutationApplied: false,

  reason:
    'Governed invocation is eligible to cross the controlled executor boundary.',
}

const allowedInput: RuntimeToolControlledExternalReadContractInput = {
  envelope,
  boundary,

  target: {
    protocol: 'https:',
    host: 'www.iana.org',
    resource: '/help/example-domains',
  },

  policy: {
    allowedHosts: ['www.iana.org'],
    allowedResources: ['/help/example-domains'],

    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  },
}

const allowedContract =
  evaluateRuntimeToolControlledExternalReadContract(allowedInput)

assert.equal(
  allowedContract.contractEligible,
  true,
  `Expected external-read contract to be eligible: ${allowedContract.reason}`,
)

const realResult =
  await executeRuntimeToolControlledExternalReadEffect(allowedInput)

assert.equal(realResult.networkAttempted, true)
assert.equal(realResult.networkCompleted, true)
assert.equal(realResult.networkAccess, true)

assert.equal(realResult.responseReceived, true)
assert.equal(realResult.httpStatus, 200)
assert.ok(
  realResult.responseBytes > 0,
  'Real external response must contain bytes.',
)

assert.equal(realResult.externalReadApplied, true)
assert.equal(realResult.executionApplied, true)

assert.equal(realResult.externalMutation, false)
assert.equal(realResult.mutationApplied, false)
assert.equal(realResult.providerInvocation, false)

const blockedInput: RuntimeToolControlledExternalReadContractInput = {
  ...allowedInput,

  target: {
    protocol: 'https:',
    host: 'blocked.invalid',
    resource: '/not-allowed',
  },
}

const blockedContract =
  evaluateRuntimeToolControlledExternalReadContract(blockedInput)

assert.equal(blockedContract.contractEligible, false)

const blockedResult =
  await executeRuntimeToolControlledExternalReadEffect(blockedInput)

assert.equal(blockedResult.networkAttempted, false)
assert.equal(blockedResult.networkCompleted, false)
assert.equal(blockedResult.networkAccess, false)
assert.equal(blockedResult.externalReadApplied, false)
assert.equal(blockedResult.executionApplied, false)

assert.equal(blockedResult.externalMutation, false)
assert.equal(blockedResult.mutationApplied, false)
assert.equal(blockedResult.providerInvocation, false)

console.log('Runtime governed REAL external read proof passed.')
console.log({
  architecture:
    'invocation-envelope -> controlled-executor-boundary -> external-read-contract -> external-read-effect -> HTTPS',

  allowed: {
    contractEligible: allowedContract.contractEligible,
    networkAttempted: realResult.networkAttempted,
    networkCompleted: realResult.networkCompleted,
    networkAccess: realResult.networkAccess,
    httpStatus: realResult.httpStatus,
    responseReceived: realResult.responseReceived,
    responseBytes: realResult.responseBytes,
    externalReadApplied: realResult.externalReadApplied,
    executionApplied: realResult.executionApplied,
    externalMutation: realResult.externalMutation,
    mutationApplied: realResult.mutationApplied,
    providerInvocation: realResult.providerInvocation,
  },

  blocked: {
    contractEligible: blockedContract.contractEligible,
    networkAttempted: blockedResult.networkAttempted,
    networkCompleted: blockedResult.networkCompleted,
    networkAccess: blockedResult.networkAccess,
    externalReadApplied: blockedResult.externalReadApplied,
    executionApplied: blockedResult.executionApplied,
    mutationApplied: blockedResult.mutationApplied,
  },
})

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
