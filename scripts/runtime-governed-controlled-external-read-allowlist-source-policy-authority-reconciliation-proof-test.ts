import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadAllowlistSource,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-allowlist-source'

import {
  evaluateRuntimeToolControlledExternalReadPolicyAuthority,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-policy-authority'

const defaultSource =
  evaluateRuntimeToolControlledExternalReadAllowlistSource()

const defaultDecision =
  evaluateRuntimeToolControlledExternalReadPolicyAuthority(defaultSource)

assert.equal(defaultDecision.policyAuthorityEvaluated, true)
assert.equal(defaultDecision.policyAuthorized, false)
assert.deepEqual(defaultDecision.policy.allowedHosts, [])
assert.deepEqual(defaultDecision.policy.allowedResources, [])

const configuredSource =
  evaluateRuntimeToolControlledExternalReadAllowlistSource({
    sourceId: 'proof:v287.63',
    allowedHosts: ['EXAMPLE.COM', ' example.com '],
    allowedResources: ['/governed/read', ' /governed/read '],
  })

const configuredDecision =
  evaluateRuntimeToolControlledExternalReadPolicyAuthority(configuredSource)

assert.equal(configuredSource.configured, true)

assert.equal(configuredDecision.policyAuthorityEvaluated, true)
assert.equal(configuredDecision.policyAuthorized, true)

assert.deepEqual(
  configuredDecision.policy.allowedHosts,
  ['example.com'],
)

assert.deepEqual(
  configuredDecision.policy.allowedResources,
  ['/governed/read'],
)

assert.equal(configuredDecision.policy.readOnly, true)
assert.equal(configuredDecision.policy.externalCostAllowed, false)
assert.equal(configuredDecision.policy.secretsPermitted, false)
assert.equal(configuredDecision.policy.auditRequired, true)

assert.equal(configuredDecision.networkAccess, false)
assert.equal(configuredDecision.externalReadApplied, false)
assert.equal(configuredDecision.executionApplied, false)
assert.equal(configuredDecision.mutationApplied, false)
assert.equal(configuredDecision.externalMutation, false)
assert.equal(configuredDecision.providerInvocation, false)

const malformedSource = {
  ...configuredSource,
  configured: false,
} as const

const malformedDecision =
  evaluateRuntimeToolControlledExternalReadPolicyAuthority(malformedSource)

assert.equal(malformedDecision.policyAuthorized, false)
assert.deepEqual(malformedDecision.policy.allowedHosts, [])
assert.deepEqual(malformedDecision.policy.allowedResources, [])

console.log({
  architecture:
    'governed-controlled-external-read-allowlist-source-policy-authority-reconciliation',
  defaultSourceRejected:
    defaultDecision.policyAuthorized === false,
  configuredSourceAuthorized:
    configuredDecision.policyAuthorized === true,
  policyPreserved:
    configuredDecision.policy.allowedHosts[0] === 'example.com' &&
    configuredDecision.policy.allowedResources[0] === '/governed/read',
  malformedSourceRejected:
    malformedDecision.policyAuthorized === false,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  externalMutation: false,
  providerInvocation: false,
})

console.log(
  'Runtime governed controlled external.read allowlist source policy authority reconciliation proof passed.',
)
