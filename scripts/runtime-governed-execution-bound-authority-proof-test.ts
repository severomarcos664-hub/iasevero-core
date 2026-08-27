import assert from 'node:assert/strict'

import {
  evaluateRuntimeExecutionBoundAuthority,
} from '../app/lib/runtime-executive-authority-gateway/runtime-execution-bound-authority'

const allowed = evaluateRuntimeExecutionBoundAuthority({
  executionKey: 'execution-v287.45-allowed',
  executiveAuthority: {
    executionAllowed: true,
  },
})

assert.equal(allowed.authorityBindingEvaluated, true)
assert.equal(allowed.authorityBound, true)
assert.equal(allowed.executionKey, 'execution-v287.45-allowed')
assert.equal(allowed.executionAllowed, true)

assert.equal(allowed.networkAccess, false)
assert.equal(allowed.executionApplied, false)
assert.equal(allowed.mutationApplied, false)
assert.equal(allowed.externalMutation, false)
assert.equal(allowed.providerInvocation, false)

const denied = evaluateRuntimeExecutionBoundAuthority({
  executionKey: 'execution-v287.45-denied',
  executiveAuthority: {
    executionAllowed: false,
  },
})

assert.equal(denied.authorityBindingEvaluated, true)
assert.equal(denied.authorityBound, false)
assert.equal(denied.executionAllowed, false)

const missingExecutionKey = evaluateRuntimeExecutionBoundAuthority({
  executionKey: '',
  executiveAuthority: {
    executionAllowed: true,
  },
})

assert.equal(missingExecutionKey.authorityBindingEvaluated, true)
assert.equal(missingExecutionKey.authorityBound, false)

console.log('RUNTIME_GOVERNED_EXECUTION_BOUND_AUTHORITY_PROOF=PASS')
