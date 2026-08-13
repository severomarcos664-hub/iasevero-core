import assert from 'node:assert/strict'

import {
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy,
} from '../app/lib/orchestrator/runtime-tool-execution-attempt-governance'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

const baseEnvelope: RuntimeToolExecutionInvocationEnvelope = {
  toolId: 'runtime.validation',
  executionKey: 'execution-v287.12',
  correlationId: 'correlation-v287.12',
  traceId: 'trace-v287.12',
  stepId: 'step-v287.12',
  validatedInput: Object.freeze({}),
  idempotencyKey: 'idempotency-v287.12',
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


const baseInput: RuntimeToolControlledExternalReadContractInput = {
  envelope: baseEnvelope,
  boundary: {
    toolId: baseEnvelope.toolId,
    executionKey: baseEnvelope.executionKey,
    correlationId: baseEnvelope.correlationId,
    traceId: baseEnvelope.traceId,
    stepId: baseEnvelope.stepId,

    invocationPrepared: true,

    toolRegistered: true,
    toolAllowed: true,
    policyMatched: true,

    executorEligible: true,
    executorBoundaryStatus: 'eligible',

    executionApplied: false,
    mutationApplied: false,

    reason:
      'Controlled executor boundary is eligible for governed external-read contract proof.',
  },
  target: {
    protocol: 'https:',
    host: 'example.invalid',
    resource: '/governed/read',
  },
  policy: {
    allowedHosts: [
      'example.invalid',
    ],
    allowedResources: [
      '/governed/read',
    ],
    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  },
}

const eligible =
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
    baseInput,
    baseEnvelope,
  )

assert.equal(
  eligible.contract.contractEligible,
  true,
  'eligible external-read contract must remain eligible',
)

assert.equal(
  eligible.timeoutMs,
  1000,
  'timeout budget must come from invocation envelope policy',
)

assert.equal(
  eligible.timeoutPolicyValid,
  true,
  'positive finite timeout must be valid',
)

assert.equal(
  eligible.timeoutPolicyReconciled,
  true,
  'eligible contract plus valid timeout must reconcile',
)

const zeroTimeout =
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
    baseInput,
    {
      ...baseEnvelope,
      policy: {
        ...baseEnvelope.policy,
        timeoutMs: 0,
      },
    },
  )

assert.equal(
  zeroTimeout.timeoutPolicyValid,
  false,
  'zero timeout must fail closed',
)

assert.equal(
  zeroTimeout.timeoutPolicyReconciled,
  false,
  'zero timeout must not reconcile',
)

const negativeTimeout =
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
    baseInput,
    {
      ...baseEnvelope,
      policy: {
        ...baseEnvelope.policy,
        timeoutMs: -1,
      },
    },
  )

assert.equal(
  negativeTimeout.timeoutPolicyValid,
  false,
  'negative timeout must fail closed',
)

assert.equal(
  negativeTimeout.timeoutPolicyReconciled,
  false,
  'negative timeout must not reconcile',
)

const ineligibleContract =
  reconcileRuntimeToolControlledExternalReadTimeoutPolicy(
    {
      ...baseInput,
      target: {
        ...baseInput.target,
        host: 'blocked.invalid',
      },
    },
    baseEnvelope,
  )

assert.equal(
  ineligibleContract.contract.contractEligible,
  false,
  'non-allowlisted host must make contract ineligible',
)

assert.equal(
  ineligibleContract.timeoutPolicyValid,
  true,
  'valid timeout remains valid independently of contract eligibility',
)

assert.equal(
  ineligibleContract.timeoutPolicyReconciled,
  false,
  'timeout policy must not reconcile with an ineligible contract',
)

for (const result of [
  eligible,
  zeroTimeout,
  negativeTimeout,
  ineligibleContract,
]) {
  assert.equal(result.executorInvoked, false)
  assert.equal(result.networkAccess, false)
  assert.equal(result.externalReadApplied, false)
  assert.equal(result.executionApplied, false)
  assert.equal(result.externalMutation, false)
  assert.equal(result.mutationApplied, false)
  assert.equal(result.providerInvocation, false)
}

console.log(
  JSON.stringify(
    {
      version:
        'v287.12-governed-controlled-external-read-timeout-policy-reconciliation-proof',

      positive: {
        contractEligible:
          eligible.contract.contractEligible,
        timeoutMs:
          eligible.timeoutMs,
        timeoutPolicyValid:
          eligible.timeoutPolicyValid,
        timeoutPolicyReconciled:
          eligible.timeoutPolicyReconciled,
      },

      negative: {
        zeroTimeoutBlocked:
          zeroTimeout.timeoutPolicyReconciled === false,
        negativeTimeoutBlocked:
          negativeTimeout.timeoutPolicyReconciled === false,
        ineligibleContractBlocked:
          ineligibleContract.timeoutPolicyReconciled === false,
      },

      invariants: {
        executorInvoked: false,
        networkAccess: false,
        externalReadApplied: false,
        executionApplied: false,
        externalMutation: false,
        mutationApplied: false,
        providerInvocation: false,
      },

      assertionCount: 25,
    },
    null,
    2,
  ),
)
