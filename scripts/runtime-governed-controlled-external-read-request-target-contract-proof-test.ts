import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadRequestTargetContract,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-request-target-contract'

const valid =
  evaluateRuntimeToolControlledExternalReadRequestTargetContract({
    externalReadTarget: {
      protocol: 'https',
      host: ' Example.COM ',
      resource: '/technology',
    },
  })

assert.equal(valid.requestTargetEvaluated, true)
assert.equal(valid.requestTargetEligible, true)
assert.deepEqual(valid.targetInput, {
  target: {
    protocol: 'https',
    host: 'Example.COM',
    resource: '/technology',
  },
  origin: 'user-explicit',
})

assert.equal(valid.networkAccess, false)
assert.equal(valid.externalReadApplied, false)
assert.equal(valid.executionApplied, false)
assert.equal(valid.mutationApplied, false)
assert.equal(valid.providerInvocation, false)

const absent =
  evaluateRuntimeToolControlledExternalReadRequestTargetContract({})

assert.equal(absent.requestTargetEvaluated, true)
assert.equal(absent.requestTargetEligible, false)
assert.equal(absent.targetInput, null)

const malformed =
  evaluateRuntimeToolControlledExternalReadRequestTargetContract({
    externalReadTarget: 'https://example.com/technology',
})

assert.equal(malformed.requestTargetEvaluated, true)
assert.equal(malformed.requestTargetEligible, false)
assert.equal(malformed.targetInput, null)

const incomplete =
  evaluateRuntimeToolControlledExternalReadRequestTargetContract({
    externalReadTarget: {
      protocol: 'https',
      host: 'example.com',
    },
  })

assert.equal(incomplete.requestTargetEvaluated, true)
assert.equal(incomplete.requestTargetEligible, false)
assert.equal(incomplete.targetInput, null)

for (const decision of [absent, malformed, incomplete]) {
  assert.equal(decision.networkAccess, false)
  assert.equal(decision.externalReadApplied, false)
  assert.equal(decision.executionApplied, false)
  assert.equal(decision.mutationApplied, false)
  assert.equal(decision.providerInvocation, false)
}

console.log(
  'Runtime governed controlled external read request target contract proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-request-target-contract',
  requestTargetEvaluated: valid.requestTargetEvaluated,
  requestTargetEligible: valid.requestTargetEligible,
  origin: valid.targetInput?.origin,
  structuredTargetRequired:
    malformed.requestTargetEligible === false,
  absentTargetRejected:
    absent.requestTargetEligible === false,
  incompleteTargetRejected:
    incomplete.requestTargetEligible === false,
  networkAccess: valid.networkAccess,
  externalReadApplied: valid.externalReadApplied,
  executionApplied: valid.executionApplied,
  mutationApplied: valid.mutationApplied,
  providerInvocation: valid.providerInvocation,
})
