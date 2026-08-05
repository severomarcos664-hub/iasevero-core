import assert from 'node:assert/strict'

import {
  createRuntimeToolDispatchHandoff,
  dispatchRuntimeTool,
} from '../app/lib/orchestrator/runtime-tool-dispatcher'

const authorized = createRuntimeToolDispatchHandoff({
  executionKey: 'execution-v2860-authorized',
  correlationId: 'correlation-v2860-authorized',
  traceId: 'trace-v2860-authorized',
  stepId: 'step-v2860-authorized',
  finalAuthorization: true,
  governance: 'approved',
})

assert.deepEqual(
  authorized,
  {
    executionKey: 'execution-v2860-authorized',
    correlationId: 'correlation-v2860-authorized',
    traceId: 'trace-v2860-authorized',
    stepId: 'step-v2860-authorized',
    finalAuthorization: true,
    governance: 'approved',
    handoffStatus: 'authorized',
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    reason:
      'Governed dispatch handoff authorized without applying dispatch.',
  },
  'Authorized handoff must preserve identity while applying no dispatch or execution.',
)

const authorizationDenied =
  createRuntimeToolDispatchHandoff({
    executionKey: 'execution-v2860-denied',
    correlationId: 'correlation-v2860-denied',
    traceId: 'trace-v2860-denied',
    stepId: 'step-v2860-denied',
    finalAuthorization: false,
    governance: 'approved',
  })

assert.equal(
  authorizationDenied.handoffStatus,
  'blocked',
  'Missing final authorization must block the handoff.',
)

const governanceDenied =
  createRuntimeToolDispatchHandoff({
    executionKey: 'execution-v2860-governance-denied',
    correlationId: 'correlation-v2860-governance-denied',
    traceId: 'trace-v2860-governance-denied',
    stepId: 'step-v2860-governance-denied',
    finalAuthorization: true,
    governance: 'denied',
  })

assert.equal(
  governanceDenied.handoffStatus,
  'blocked',
  'Governance denial must override final authorization.',
)

for (const handoff of [
  authorized,
  authorizationDenied,
  governanceDenied,
]) {
  assert.equal(handoff.dispatchApplied, false)
  assert.equal(handoff.executionApplied, false)
  assert.equal(handoff.mutationApplied, false)
}

assert.throws(
  () =>
    createRuntimeToolDispatchHandoff({
      executionKey: '',
      correlationId: 'correlation-invalid',
      traceId: 'trace-invalid',
      stepId: 'step-invalid',
      finalAuthorization: true,
      governance: 'approved',
    }),
  /executionKey/,
  'Empty execution identity must be rejected.',
)

const existingDispatcherResult = dispatchRuntimeTool(
  'planning-step',
  'normal',
  'stable',
  true,
  'approved',
  1,
  'local',
)

assert.equal(
  typeof existingDispatcherResult.executor,
  'string',
  'The existing Dispatcher contract must remain operational.',
)

assert.equal(
  typeof existingDispatcherResult.reason,
  'string',
  'The existing Dispatcher return contract must remain preserved.',
)

const result = {
  owner:
    'app/lib/orchestrator/runtime-tool-dispatcher.ts',
  architecture:
    'governed-tool-dispatch-handoff-contract',
  existingDispatcherPreserved: true,
  executionIdentityPreserved: true,
  correlationIdentityPreserved: true,
  traceIdentityPreserved: true,
  stepIdentityPreserved: true,
  finalAuthorizationRequired: true,
  governanceApprovalRequired: true,
  governanceDenialOverridesAuthorization: true,
  emptyIdentityRejected: true,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed tool dispatch handoff contract proof passed.',
)

console.log(result)
