import assert from 'node:assert/strict'
import { evaluateRuntimeGovernedSandboxFinalAuthorizationBinding } from '../app/lib/runtime-core/runtime-governed-sandbox-final-authorization-binding'

const base = {
  sandboxExecutionAuthorized: true,
  toolId: 'sandbox.execution',
  toolRegistered: true,
  toolAllowed: true,
  governanceApproved: true,
  finalAuthorizationGranted: true,
}

const eligible = evaluateRuntimeGovernedSandboxFinalAuthorizationBinding(base)

assert.equal(eligible.bindingEvaluated, true)
assert.equal(eligible.bindingEligible, true)
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
]) {
  const blocked = evaluateRuntimeGovernedSandboxFinalAuthorizationBinding({ ...base, ...override })
  assert.equal(blocked.bindingEligible, false)
  assert.equal(blocked.dispatchApplied, false)
  assert.equal(blocked.executionApplied, false)
  assert.equal(blocked.mutationApplied, false)
}

console.log('Runtime governed sandbox final authorization binding foundation proof passed.')
