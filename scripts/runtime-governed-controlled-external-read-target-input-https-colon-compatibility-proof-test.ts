import assert from 'node:assert/strict'
import {
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-target-input-boundary'

const result =
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary({
    target: {
      protocol: 'https:',
      host: 'www.iana.org',
      resource: '/help/example-domains',
    },
    origin: 'user-explicit',
  } as any)

assert.equal(
  result.targetInputEligible,
  true,
  'RED: canonical URL protocol https: must be accepted as governed HTTPS input.',
)

assert.equal(result.target?.protocol, 'https:')
assert.equal(result.networkAccess, false)
assert.equal(result.externalReadApplied, false)
assert.equal(result.executionApplied, false)
assert.equal(result.mutationApplied, false)
assert.equal(result.providerInvocation, false)

console.log({
  architecture:
    'request-target(https:) -> target-input-boundary -> governed-external-read-chain',
  targetInputEligible: result.targetInputEligible,
  canonicalProtocol: result.target?.protocol ?? null,
  networkAccess: result.networkAccess,
  executionApplied: result.executionApplied,
})

console.log(
  'Runtime governed external read HTTPS colon compatibility proof passed.',
)
