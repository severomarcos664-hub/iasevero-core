import assert from 'node:assert/strict'
import { evaluateRuntimeGovernedSandboxExecutionBoundAuthorization } from '../app/lib/runtime-core/runtime-governed-sandbox-execution-bound-authorization'

const base = {
  executionKey: 'sandbox.execution:v287.74.8-proof',
  sandboxExecutionAuthorized: true,
  toolRegistered: true,
  toolAllowed: true,
  governanceApproved: true,
  finalAuthorizationGranted: true,
} as const

const eligible = evaluateRuntimeGovernedSandboxExecutionBoundAuthorization(base)

assert.equal(eligible.authorizationEvaluated, true)
assert.equal(eligible.executionIdentityBound, true)
assert.equal(eligible.executionAuthorized, true)
assert.equal(eligible.dispatchApplied, false)
assert.equal(eligible.executionApplied, false)
assert.equal(eligible.mutationApplied, false)
assert.equal(eligible.networkAuthorityGranted, false)
assert.equal(eligible.providerInvocation, false)
assert.equal(eligible.productionMutationApplied, false)
assert.equal(eligible.selfPromotionApplied, false)

for (const override of [
  { sandboxExecutionAuthorized: false },
  { toolRegistered: false },
  { toolAllowed: false },
  { governanceApproved: false },
  { finalAuthorizationGranted: false },
] as const) {
  const blocked = evaluateRuntimeGovernedSandboxExecutionBoundAuthorization({ ...base, ...override })
  assert.equal(blocked.executionIdentityBound, false)
  assert.equal(blocked.executionAuthorized, false)
  assert.equal(blocked.dispatchApplied, false)
  assert.equal(blocked.executionApplied, false)
  assert.equal(blocked.mutationApplied, false)
}

console.log('Runtime governed sandbox execution bound authorization foundation proof passed.')
