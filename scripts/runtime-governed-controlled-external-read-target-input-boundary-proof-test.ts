import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-target-input-boundary'

const valid =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'https',
      host: ' Example.COM ',
      resource: ' /technology ',
    },
    origin: 'user-explicit',
  })

assert.equal(valid.targetInputEvaluated, true)
assert.equal(valid.targetInputEligible, true)

assert.deepEqual(valid.target, {
  protocol: 'https:',
  host: 'example.com',
  resource: '/technology',
})

assert.equal(valid.origin, 'user-explicit')
assert.equal(typeof valid.reason, 'string')
assert.ok(valid.reason.length > 0)

assert.equal(valid.networkAccess, false)
assert.equal(valid.externalReadApplied, false)
assert.equal(valid.executionApplied, false)
assert.equal(valid.mutationApplied, false)
assert.equal(valid.providerInvocation, false)

const malformedHost =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'https',
      host: '://github.com',
      resource: '/api',
    },
    origin: 'user-explicit',
  })

assert.equal(malformedHost.targetInputEvaluated, true)
assert.equal(malformedHost.targetInputEligible, false)
assert.equal(malformedHost.target, null)

const invalidProtocol =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'http',
      host: 'example.com',
      resource: '/technology',
    },
    origin: 'runtime-derived',
  })

assert.equal(invalidProtocol.targetInputEvaluated, true)
assert.equal(invalidProtocol.targetInputEligible, false)
assert.equal(invalidProtocol.target, null)

const invalidResource =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'https',
      host: 'example.com',
      resource: 'technology',
    },
    origin: 'runtime-derived',
  })

assert.equal(invalidResource.targetInputEvaluated, true)
assert.equal(invalidResource.targetInputEligible, false)
assert.equal(invalidResource.target, null)

const invalidOrigin =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'https',
      host: 'example.com',
      resource: '/technology',
    },
    origin: 'policy-enforced',
  })

assert.equal(invalidOrigin.targetInputEvaluated, true)
assert.equal(invalidOrigin.targetInputEligible, false)
assert.equal(invalidOrigin.target, null)

for (const decision of [
  malformedHost,
  invalidProtocol,
  invalidResource,
  invalidOrigin,
]) {
  assert.equal(decision.networkAccess, false)
  assert.equal(decision.externalReadApplied, false)
  assert.equal(decision.executionApplied, false)
  assert.equal(decision.mutationApplied, false)
  assert.equal(decision.providerInvocation, false)
}

console.log(
  'Runtime governed controlled external read target input boundary proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-target-input-boundary',
  targetInputEvaluated: valid.targetInputEvaluated,
  targetInputEligible: valid.targetInputEligible,
  targetNormalized:
    valid.target?.host === 'example.com' &&
    valid.target?.resource === '/technology',
  malformedHostRejected: malformedHost.targetInputEligible === false,
  invalidProtocolRejected: invalidProtocol.targetInputEligible === false,
  invalidResourceRejected: invalidResource.targetInputEligible === false,
  invalidOriginRejected: invalidOrigin.targetInputEligible === false,
  networkAccess: valid.networkAccess,
  externalReadApplied: valid.externalReadApplied,
  executionApplied: valid.executionApplied,
  mutationApplied: valid.mutationApplied,
  providerInvocation: valid.providerInvocation,
})
