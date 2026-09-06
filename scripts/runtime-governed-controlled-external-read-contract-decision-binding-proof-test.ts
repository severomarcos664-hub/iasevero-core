import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadContract,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

const input = {
  envelope: {
    toolId: 'runtime.validation',
    executionKey: 'execution-v2879',
    correlationId: 'correlation-v2879',
    traceId: 'trace-v2879',
    stepId: 'step-v2879',

    validatedInput: {
      query: 'read-only-demo',
    },

    idempotencyKey: 'idempotency-v2879',

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
  },

  boundary: {
    toolId: 'runtime.validation',

    executionKey: 'execution-v2879',
    correlationId: 'correlation-v2879',
    traceId: 'trace-v2879',
    stepId: 'step-v2879',

    invocationPrepared: true,

    toolRegistered: true,
    toolAllowed: true,
    policyMatched: true,

    executorEligible: true,
    executorBoundaryStatus: 'eligible',

    executionApplied: false,
    mutationApplied: false,

    reason:
      'Governed invocation is eligible to cross the controlled executor boundary without executing tool effects.',
  },

  target: {
    protocol: 'https:',
    host: 'example.invalid',
    resource: '/governed/read',
  },

  policy: {
    allowedHosts: ['example.invalid'],
    allowedResources: ['/governed/read'],
    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  },
} satisfies RuntimeToolControlledExternalReadContractInput

const decision = evaluateRuntimeToolControlledExternalReadContract(input)

const runtimeDecision = decision as unknown as {
  contractEligible: boolean
  contractStatus: 'eligible' | 'blocked'
  contractBinding?: {
    target: {
      protocol: string
      host: string
      resource: string
    }
    policy: {
      allowedHosts: readonly string[]
      allowedResources: readonly string[]
      readOnly: boolean
      externalCostAllowed: boolean
      secretsPermitted: boolean
      auditRequired: boolean
    }
  } | null
}

assert.equal(decision.contractEligible, true)
assert.equal(decision.contractStatus, 'eligible')

assert.ok(
  runtimeDecision.contractBinding !== undefined,
  'eligible controlled external-read contract must expose contractBinding',
)

assert.notEqual(
  runtimeDecision.contractBinding,
  null,
  'eligible controlled external-read contract must bind validated target and policy',
)

assert.deepEqual(runtimeDecision.contractBinding?.target, {
  protocol: 'https:',
  host: 'example.invalid',
  resource: '/governed/read',
})

assert.deepEqual(runtimeDecision.contractBinding?.policy, {
  allowedHosts: ['example.invalid'],
  allowedResources: ['/governed/read'],
  readOnly: true,
  externalCostAllowed: false,
  secretsPermitted: false,
  auditRequired: true,
})

assert.equal(
  Object.isFrozen(runtimeDecision.contractBinding),
  true,
  'eligible contract binding must be frozen',
)

assert.equal(
  Object.isFrozen(runtimeDecision.contractBinding?.target),
  true,
  'bound target snapshot must be frozen',
)

assert.equal(
  Object.isFrozen(runtimeDecision.contractBinding?.policy),
  true,
  'bound policy snapshot must be frozen',
)

assert.equal(
  Object.isFrozen(runtimeDecision.contractBinding?.policy.allowedHosts),
  true,
  'bound allowedHosts snapshot must be frozen',
)

assert.equal(
  Object.isFrozen(runtimeDecision.contractBinding?.policy.allowedResources),
  true,
  'bound allowedResources snapshot must be frozen',
)

assert.notEqual(
  runtimeDecision.contractBinding?.policy.allowedHosts,
  input.policy.allowedHosts,
  'bound allowedHosts must not alias input policy',
)

assert.notEqual(
  runtimeDecision.contractBinding?.policy.allowedResources,
  input.policy.allowedResources,
  'bound allowedResources must not alias input policy',
)

const blockedDecision =
  evaluateRuntimeToolControlledExternalReadContract({
    ...input,
    target: {
      ...input.target,
      host: 'blocked.invalid',
    },
  })

assert.equal(blockedDecision.contractEligible, false)
assert.equal(blockedDecision.contractStatus, 'blocked')
assert.equal(
  blockedDecision.contractBinding,
  null,
  'blocked controlled external-read contract must not expose contract binding',
)

assert.equal(blockedDecision.networkAccess, false)
assert.equal(blockedDecision.externalReadApplied, false)
assert.equal(blockedDecision.executionApplied, false)
assert.equal(blockedDecision.mutationApplied, false)
assert.equal(blockedDecision.providerInvocation, false)

assert.equal(decision.networkAccess, false)
assert.equal(decision.externalReadApplied, false)
assert.equal(decision.executionApplied, false)
assert.equal(decision.mutationApplied, false)
assert.equal(decision.providerInvocation, false)

console.log({
  architecture:
    'governed-controlled-external-read-contract-decision-binding',
  contractEligible: decision.contractEligible,
  contractStatus: decision.contractStatus,
  contractBindingPresent: runtimeDecision.contractBinding != null,
  networkAccess: decision.networkAccess,
  externalReadApplied: decision.externalReadApplied,
  executionApplied: decision.executionApplied,
  mutationApplied: decision.mutationApplied,
  providerInvocation: decision.providerInvocation,
})

console.log(
  'Runtime governed controlled external read contract decision binding proof passed.',
)
