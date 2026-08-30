import assert from 'node:assert/strict'

import {
  prepareRuntimeToolControlledExternalReadInvocation,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-invocation-preparation'

import {
  evaluateRuntimeExecutionBoundAuthority,
} from '../app/lib/runtime-executive-authority-gateway/runtime-execution-bound-authority'

import {
  evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contextual-admission-grant-boundary'

import {
  createRuntimeToolRegistry,
} from '../app/lib/runtime-core/runtime-tool-registry'

const preparation =
  prepareRuntimeToolControlledExternalReadInvocation({
    executionKey: 'exec-v287.53-proof',
    correlationId: 'corr-v287.53-proof',
    traceId: 'trace-v287.53-proof',
    stepId: 'step-v287.53-proof',
    toolId: 'external.read',
    validatedInput: {
      protocol: 'https',
      host: 'example.com',
      resource: '/',
    },
    idempotencyKey: 'external.read:v287.53-proof',
    policy: {
      category: 'execution',
      risk: 'high',
      timeoutMs: 3000,
      retries: 0,
      critical: true,
    },
  })

const authority =
  evaluateRuntimeExecutionBoundAuthority({
    executionKey: preparation.executionKey,
    executiveAuthority: {
      executionAllowed: true,
    },
  })

const admitted =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary({
    preparation,
    executionAuthority: authority,
  })

const deniedAuthority =
  evaluateRuntimeExecutionBoundAuthority({
    executionKey: preparation.executionKey,
    executiveAuthority: {
      executionAllowed: false,
    },
  })

const denied =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary({
    preparation,
    executionAuthority: deniedAuthority,
  })

const mismatchedAuthority =
  evaluateRuntimeExecutionBoundAuthority({
    executionKey: 'exec-v287.53-other',
    executiveAuthority: {
      executionAllowed: true,
    },
  })

const mismatched =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary({
    preparation,
    executionAuthority: mismatchedAuthority,
  })

const malformedPreparation = {
  ...preparation,
  correlationId: ' ',
}

const malformed =
  evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary({
    preparation: malformedPreparation,
    executionAuthority: authority,
  })

const registryBefore = createRuntimeToolRegistry()
const registryAfter = createRuntimeToolRegistry()

const externalReadBefore =
  registryBefore.tools.find((tool) => tool.id === 'external.read')

const externalReadAfter =
  registryAfter.tools.find((tool) => tool.id === 'external.read')

assert.equal(preparation.invocationPreparationValidated, true)
assert.equal(authority.authorityBound, true)

assert.equal(admitted.grantPrepared, true)
assert.deepEqual(admitted.contextualGrant, {
  toolId: 'external.read',
  executionKey: preparation.executionKey,
  admissionAllowed: true,
})

assert.equal(denied.grantPrepared, false)
assert.equal(denied.contextualGrant, null)

assert.equal(mismatched.grantPrepared, false)
assert.equal(mismatched.contextualGrant, null)

assert.equal(malformed.grantPrepared, false)
assert.equal(malformed.contextualGrant, null)

const decisions = [
  admitted,
  denied,
  mismatched,
  malformed,
]

for (const decision of decisions) {
  assert.equal(decision.networkAccess, false)
  assert.equal(decision.externalReadApplied, false)
  assert.equal(decision.executionApplied, false)
  assert.equal(decision.mutationApplied, false)
  assert.equal(decision.providerInvocation, false)
}

assert.equal(externalReadBefore?.allowed, false)
assert.equal(externalReadAfter?.allowed, false)

console.log({
  architecture:
    'governed-controlled-external-read-contextual-admission-grant-boundary',
  positiveGrantPrepared: admitted.grantPrepared,
  deniedAuthorityRejected: denied.contextualGrant === null,
  mismatchedAuthorityRejected: mismatched.contextualGrant === null,
  malformedPreparationRejected: malformed.contextualGrant === null,
  registryRemainsFailClosed:
    externalReadBefore?.allowed === false &&
    externalReadAfter?.allowed === false,
  networkAccess: admitted.networkAccess,
  externalReadApplied: admitted.externalReadApplied,
  executionApplied: admitted.executionApplied,
  mutationApplied: admitted.mutationApplied,
  providerInvocation: admitted.providerInvocation,
})

console.log(
  'Runtime governed controlled external read contextual admission grant boundary behavioral proof passed.',
)
