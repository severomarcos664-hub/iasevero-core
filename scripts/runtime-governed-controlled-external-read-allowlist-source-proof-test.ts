import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadAllowlistSource,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-allowlist-source'

const defaultDecision =
  evaluateRuntimeToolControlledExternalReadAllowlistSource()

assert.equal(defaultDecision.sourceEvaluated, true)
assert.equal(defaultDecision.configured, false)
assert.deepEqual(defaultDecision.policy.allowedHosts, [])
assert.deepEqual(defaultDecision.policy.allowedResources, [])
assert.equal(defaultDecision.policy.readOnly, true)
assert.equal(defaultDecision.policy.externalCostAllowed, false)
assert.equal(defaultDecision.policy.secretsPermitted, false)
assert.equal(defaultDecision.policy.auditRequired, true)

assert.equal(defaultDecision.networkAccess, false)
assert.equal(defaultDecision.externalReadApplied, false)
assert.equal(defaultDecision.executionApplied, false)
assert.equal(defaultDecision.mutationApplied, false)
assert.equal(defaultDecision.providerInvocation, false)

const configuredDecision =
  evaluateRuntimeToolControlledExternalReadAllowlistSource({
    sourceId: 'proof:v287.62',
    allowedHosts: ['EXAMPLE.COM', ' example.com '],
    allowedResources: ['/governed/read', ' /governed/read '],
  })

assert.equal(configuredDecision.sourceEvaluated, true)
assert.equal(configuredDecision.configured, true)
assert.equal(configuredDecision.sourceId, 'proof:v287.62')
assert.deepEqual(configuredDecision.policy.allowedHosts, ['example.com'])
assert.deepEqual(configuredDecision.policy.allowedResources, ['/governed/read'])

assert.equal(configuredDecision.networkAccess, false)
assert.equal(configuredDecision.externalReadApplied, false)
assert.equal(configuredDecision.executionApplied, false)
assert.equal(configuredDecision.mutationApplied, false)
assert.equal(configuredDecision.providerInvocation, false)

const missingSourceDecision =
  evaluateRuntimeToolControlledExternalReadAllowlistSource({
    sourceId: '   ',
    allowedHosts: ['example.com'],
    allowedResources: ['/governed/read'],
  })

assert.equal(missingSourceDecision.configured, false)
assert.deepEqual(missingSourceDecision.policy.allowedHosts, [])
assert.deepEqual(missingSourceDecision.policy.allowedResources, [])

const invalidResourceDecision =
  evaluateRuntimeToolControlledExternalReadAllowlistSource({
    sourceId: 'proof:v287.62:invalid-resource',
    allowedHosts: ['example.com'],
    allowedResources: ['not-an-absolute-resource'],
  })

assert.equal(invalidResourceDecision.configured, false)
assert.deepEqual(invalidResourceDecision.policy.allowedHosts, [])
assert.deepEqual(invalidResourceDecision.policy.allowedResources, [])

console.log({
  architecture:
    'governed-controlled-external-read-allowlist-source',
  defaultFailClosed: !defaultDecision.configured,
  configuredSourceValidated: configuredDecision.configured,
  hostsNormalized:
    configuredDecision.policy.allowedHosts.length === 1,
  resourcesNormalized:
    configuredDecision.policy.allowedResources.length === 1,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

console.log(
  'Runtime governed controlled external.read allowlist source proof passed.',
)
