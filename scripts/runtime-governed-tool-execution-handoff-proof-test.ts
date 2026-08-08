import assert from 'node:assert/strict'

import {
  createRuntimeToolDispatchHandoff,
} from '../app/lib/orchestrator/runtime-tool-dispatcher'

import {
  applyRuntimeToolDispatch,
} from '../app/lib/orchestrator/runtime-tool-dispatch-application'

import {
  evaluateRuntimeToolExecutionGate,
} from '../app/lib/orchestrator/runtime-tool-execution-gate'

import {
  createRuntimeToolExecutionHandoff,
} from '../app/lib/orchestrator/runtime-tool-execution-handoff'

const identity = {
  executionKey: 'v287.2-execution',
  correlationId: 'v287.2-correlation',
  traceId: 'v287.2-trace',
  stepId: 'v287.2-step',
}

const authorizedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  finalAuthorization: true,
  governance: 'approved',
})

const appliedDispatch =
  applyRuntimeToolDispatch(authorizedHandoff)

const eligibleDecision =
  evaluateRuntimeToolExecutionGate(appliedDispatch)

const readyHandoff =
  createRuntimeToolExecutionHandoff(eligibleDecision)

assert.equal(appliedDispatch.dispatchApplied, true)
assert.equal(eligibleDecision.executionEligible, true)
assert.equal(readyHandoff.handoffStatus, 'ready')
assert.equal(readyHandoff.executionApplied, false)
assert.equal(readyHandoff.mutationApplied, false)

const blockedDispatchHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  stepId: 'v287.2-blocked-step',
  finalAuthorization: false,
  governance: 'denied',
})

const blockedDispatch =
  applyRuntimeToolDispatch(blockedDispatchHandoff)

const blockedDecision =
  evaluateRuntimeToolExecutionGate(blockedDispatch)

const blockedHandoff =
  createRuntimeToolExecutionHandoff(blockedDecision)

assert.equal(blockedDispatch.dispatchApplied, false)
assert.equal(blockedDecision.executionEligible, false)
assert.equal(blockedHandoff.handoffStatus, 'blocked')
assert.equal(blockedHandoff.executionApplied, false)
assert.equal(blockedHandoff.mutationApplied, false)

console.log(
  'Runtime governed tool execution handoff proof passed.',
)

console.log({
  architecture: 'governed-tool-execution-handoff',

  dispatchApplied:
    appliedDispatch.dispatchApplied,

  executionEligible:
    eligibleDecision.executionEligible,

  executionHandoffStatus:
    readyHandoff.handoffStatus,

  blockedExecutionHandoffStatus:
    blockedHandoff.handoffStatus,

  executionApplied:
    readyHandoff.executionApplied,

  mutationApplied:
    readyHandoff.mutationApplied,
})
