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

const identity = {
  executionKey: 'v287.1-execution',
  correlationId: 'v287.1-correlation',
  traceId: 'v287.1-trace',
  stepId: 'v287.1-step',
}

const authorizedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  finalAuthorization: true,
  governance: 'approved',
})

const authorizedDispatch = applyRuntimeToolDispatch(authorizedHandoff)
const eligible = evaluateRuntimeToolExecutionGate(authorizedDispatch)

assert.equal(authorizedDispatch.dispatchApplied, true)
assert.equal(eligible.dispatchApplied, true)
assert.equal(eligible.executionEligible, true)
assert.equal(eligible.executionApplied, false)
assert.equal(eligible.mutationApplied, false)

const blockedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  stepId: 'v287.1-blocked-step',
  finalAuthorization: false,
  governance: 'denied',
})

const blockedDispatch = applyRuntimeToolDispatch(blockedHandoff)
const denied = evaluateRuntimeToolExecutionGate(blockedDispatch)

assert.equal(blockedDispatch.dispatchApplied, false)
assert.equal(denied.executionEligible, false)
assert.equal(denied.executionApplied, false)
assert.equal(denied.mutationApplied, false)

console.log('Runtime governed tool execution gate proof passed.')

console.log({
  architecture: 'governed-tool-execution-gate',
  authorizedDispatchApplied: authorizedDispatch.dispatchApplied,
  eligibleForExecution: eligible.executionEligible,
  blockedDispatchApplied: blockedDispatch.dispatchApplied,
  blockedExecutionEligible: denied.executionEligible,
  executionApplied: eligible.executionApplied,
  mutationApplied: eligible.mutationApplied,
})
