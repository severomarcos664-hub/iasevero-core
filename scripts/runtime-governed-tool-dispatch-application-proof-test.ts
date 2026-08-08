import assert from 'node:assert/strict'

import {
  createRuntimeToolDispatchHandoff,
} from '../app/lib/orchestrator/runtime-tool-dispatcher'

import {
  applyRuntimeToolDispatch,
} from '../app/lib/orchestrator/runtime-tool-dispatch-application'

const identity = {
  executionKey: 'v287.0-execution',
  correlationId: 'v287.0-correlation',
  traceId: 'v287.0-trace',
  stepId: 'v287.0-step',
}

const authorizedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  finalAuthorization: true,
  governance: 'approved',
})

assert.equal(authorizedHandoff.handoffStatus, 'authorized')
assert.equal(authorizedHandoff.dispatchApplied, false)
assert.equal(authorizedHandoff.executionApplied, false)
assert.equal(authorizedHandoff.mutationApplied, false)

const authorizedApplication =
  applyRuntimeToolDispatch(authorizedHandoff)

assert.equal(authorizedApplication.dispatchApplied, true)
assert.equal(authorizedApplication.executionApplied, false)
assert.equal(authorizedApplication.mutationApplied, false)

const blockedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  stepId: 'v287.0-blocked-step',
  finalAuthorization: false,
  governance: 'denied',
})

assert.equal(blockedHandoff.handoffStatus, 'blocked')

const blockedApplication =
  applyRuntimeToolDispatch(blockedHandoff)

assert.equal(blockedApplication.dispatchApplied, false)
assert.equal(blockedApplication.executionApplied, false)
assert.equal(blockedApplication.mutationApplied, false)

const governanceDeniedHandoff = createRuntimeToolDispatchHandoff({
  ...identity,
  stepId: 'v287.0-governance-denied-step',
  finalAuthorization: true,
  governance: 'denied',
})

const governanceDeniedApplication =
  applyRuntimeToolDispatch(governanceDeniedHandoff)

assert.equal(governanceDeniedApplication.dispatchApplied, false)
assert.equal(governanceDeniedApplication.executionApplied, false)
assert.equal(governanceDeniedApplication.mutationApplied, false)

console.log(
  'Runtime governed tool dispatch application proof passed.',
)

console.log({
  architecture: 'governed-tool-dispatch-application',
  authorizedDispatchApplied:
    authorizedApplication.dispatchApplied,
  blockedDispatchApplied:
    blockedApplication.dispatchApplied,
  governanceDeniedDispatchApplied:
    governanceDeniedApplication.dispatchApplied,
  executionApplied:
    authorizedApplication.executionApplied,
  mutationApplied:
    authorizedApplication.mutationApplied,
})
