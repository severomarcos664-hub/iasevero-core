import assert from 'node:assert/strict'
import { evaluateRuntimeToolControlledExternalReadPolicyAuthority } from '../app/lib/orchestrator/runtime-tool-controlled-external-read-policy-authority'

const decision = evaluateRuntimeToolControlledExternalReadPolicyAuthority()
assert.equal(decision.policyAuthorityEvaluated, true)
assert.equal(decision.policyAuthorized, false)
assert.deepEqual(decision.policy.allowedHosts, [])
assert.deepEqual(decision.policy.allowedResources, [])
assert.equal(decision.policy.readOnly, true)
assert.equal(decision.policy.externalCostAllowed, false)
assert.equal(decision.policy.secretsPermitted, false)
assert.equal(decision.policy.auditRequired, true)
assert.equal(decision.networkAccess, false)
assert.equal(decision.externalReadApplied, false)
assert.equal(decision.executionApplied, false)
assert.equal(decision.mutationApplied, false)
assert.equal(decision.externalMutation, false)
assert.equal(decision.providerInvocation, false)
console.log(decision)
