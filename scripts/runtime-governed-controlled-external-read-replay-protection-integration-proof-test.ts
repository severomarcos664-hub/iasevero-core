import {
  createRuntimeToolExecutionReplayProtector,
} from '../app/lib/orchestrator/runtime-tool-execution-replay-protection'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

let assertionCount = 0

function assert(condition: unknown, message: string): asserts condition {
  assertionCount += 1
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

const envelope: RuntimeToolExecutionInvocationEnvelope = {
  toolId: 'runtime.validation',
  executionKey: 'execution-v287.13',
  correlationId: 'correlation-v287.13',
  traceId: 'trace-v287.13',
  stepId: 'step-v287.13',
  validatedInput: Object.freeze({}),
  idempotencyKey: 'idempotency-v287.13',
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

const input: RuntimeToolControlledExternalReadContractInput = {
  envelope,
  boundary: {
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
    reason: 'Eligible controlled executor boundary for v287.13 replay integration proof.',
    executionApplied: false,
    mutationApplied: false,
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
}

const protector = createRuntimeToolExecutionReplayProtector()

const first = protector.evaluateControlledExternalRead(input, envelope)

assert(first.contract.contract.contractEligible === true, 'contract eligible')
assert(first.timeout.timeoutPolicyValid === true, 'timeout valid')
assert(first.timeout.timeoutPolicyReconciled === true, 'timeout reconciled')
assert(first.replayKey.length > 0, 'replay key derived')
assert(first.replayDetected === false, 'no false replay detection')
assert(first.replayBlocked === false, 'no false replay block')
assert(protector.registeredExecutions() === 0, 'no applied execution registered')

assert(first.networkAccess === false, 'network remains disabled')
assert(first.externalReadApplied === false, 'external read remains unapplied')
assert(first.executionApplied === false, 'execution remains unapplied')
assert(first.externalMutation === false, 'external mutation remains disabled')
assert(first.mutationApplied === false, 'mutation remains unapplied')
assert(first.providerInvocation === false, 'provider remains uninvolved')

const second = protector.evaluateControlledExternalRead(input, envelope)

assert(second.replayKey === first.replayKey, 'stable replay identity')
assert(second.replayDetected === false, 'second evaluation is not false replay')
assert(protector.registeredExecutions() === 0, 'registry remains clean')

console.log(JSON.stringify({
  version:
    'v287.13-governed-controlled-external-read-replay-protection-integration-proof',
  contractEligible: first.contract.contract.contractEligible,
  timeoutPolicyValid: first.timeout.timeoutPolicyValid,
  timeoutPolicyReconciled: first.timeout.timeoutPolicyReconciled,
  replayKeyDerived: first.replayKey.length > 0,
  replayDetected: second.replayDetected,
  replayBlocked: second.replayBlocked,
  registeredExecutions: protector.registeredExecutions(),
  networkAccess: first.networkAccess,
  externalReadApplied: first.externalReadApplied,
  executionApplied: first.executionApplied,
  externalMutation: first.externalMutation,
  mutationApplied: first.mutationApplied,
  providerInvocation: first.providerInvocation,
  assertionCount,
}, null, 2))
