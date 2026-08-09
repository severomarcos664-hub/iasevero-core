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

import {
  createRuntimeToolExecutionAdapterRequest,
  evaluateRuntimeToolExecutionAdapter,
} from '../app/lib/orchestrator/runtime-tool-execution-adapter'

const identity = {
  executionKey: 'v287.3-execution',
  correlationId: 'v287.3-correlation',
  traceId: 'v287.3-trace',
  stepId: 'v287.3-step',
}

const dispatchHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  finalAuthorization: true,
  governance: 'approved',
})

const dispatch = applyRuntimeToolDispatch(dispatchHandoff)
const gate = evaluateRuntimeToolExecutionGate(dispatch)
const handoff = createRuntimeToolExecutionHandoff(gate)

const request = createRuntimeToolExecutionAdapterRequest(handoff)
const decision = evaluateRuntimeToolExecutionAdapter(request)

assert.ok(request)
assert.equal(request.executionApplied, false)
assert.equal(request.mutationApplied, false)

assert.equal(decision.adapterAccepted, true)
assert.equal(decision.adapterStatus, 'accepted')
assert.equal(decision.executionApplied, false)
assert.equal(decision.mutationApplied, false)

const blockedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  stepId: 'v287.3-blocked-step',
  finalAuthorization: false,
  governance: 'denied',
})

const blockedDispatch = applyRuntimeToolDispatch(blockedHandoff)
const blockedGate = evaluateRuntimeToolExecutionGate(blockedDispatch)
const blockedExecutionHandoff =
  createRuntimeToolExecutionHandoff(blockedGate)

const blockedRequest =
  createRuntimeToolExecutionAdapterRequest(blockedExecutionHandoff)

const blockedDecision =
  evaluateRuntimeToolExecutionAdapter(blockedRequest)

assert.equal(blockedRequest, null)
assert.equal(blockedDecision.adapterAccepted, false)
assert.equal(blockedDecision.adapterStatus, 'rejected')
assert.equal(blockedDecision.executionApplied, false)
assert.equal(blockedDecision.mutationApplied, false)

console.log(
  'Runtime governed tool execution adapter contract proof passed.',
)

console.log({
  architecture: 'governed-tool-execution-adapter-contract',
  dispatchApplied: dispatch.dispatchApplied,
  executionEligible: gate.executionEligible,
  executionHandoffStatus: handoff.handoffStatus,
  adapterAccepted: decision.adapterAccepted,
  adapterStatus: decision.adapterStatus,
  blockedAdapterAccepted: blockedDecision.adapterAccepted,
  executionApplied: decision.executionApplied,
  mutationApplied: decision.mutationApplied,
})
