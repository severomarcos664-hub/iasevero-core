import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-executor-admission-boundary'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

import type {
  RuntimeToolControlledExternalReadContextualAdmissionDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contextual-admission-authority'

import {
  createRuntimeToolRegistry,
} from '../app/lib/runtime-core/runtime-tool-registry'

const ownerPath =
  'app/lib/orchestrator/runtime-tool-controlled-external-read-executor-admission-boundary.ts'


const ownerSource = readFileSync(ownerPath, 'utf8')

const registry = createRuntimeToolRegistry()

const externalRead = registry.tools.find(
  (tool) => tool.id === 'external.read',
)

assert.ok(externalRead)
assert.equal(externalRead.allowed, false)

const executorBoundary: RuntimeToolControlledExecutorBoundaryDecision = {
  toolId: 'external.read',

  executionKey: 'v287.58-execution',
  correlationId: 'v287.58-correlation',
  traceId: 'v287.58-trace',
  stepId: 'v287.58-step',

  invocationPrepared: true,

  toolRegistered: true,
  toolAllowed: false,
  policyMatched: true,

  executorEligible: false,
  executorBoundaryStatus: 'blocked',

  executionApplied: false,
  mutationApplied: false,

  reason:
    'Generic executor remains fail-closed because external.read is globally denied.',
}

const contextualAdmissionAuthority:
  RuntimeToolControlledExternalReadContextualAdmissionDecision = {
    toolId: 'external.read',

    executionKey: 'v287.58-execution',
    correlationId: 'v287.58-correlation',
    traceId: 'v287.58-trace',
    stepId: 'v287.58-step',

    invocationPrepared: true,
    executionAuthorityMatched: true,
    contextualAuthorityMatched: true,
    contextualAdmission: true,

    registryMutationApplied: false,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason:
      'Governed execution-scoped contextual admission granted without tool execution.',
  }

const eligible =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary,
    contextualAdmissionAuthority,
  })

assert.equal(eligible.identityMatched, true)
assert.equal(eligible.invocationPrepared, true)
assert.equal(eligible.toolRegistered, true)
assert.equal(eligible.registryDefaultDenied, true)
assert.equal(eligible.policyMatched, true)
assert.equal(eligible.contextualAdmissionMatched, true)
assert.equal(eligible.executorEligible, true)

assert.equal(eligible.registryMutationApplied, false)
assert.equal(eligible.networkAccess, false)
assert.equal(eligible.externalReadApplied, false)
assert.equal(eligible.executionApplied, false)
assert.equal(eligible.mutationApplied, false)
assert.equal(eligible.providerInvocation, false)

/*
 * Negative 1:
 * contextual authority from another execution must not cross the boundary.
 */
const identityMismatch =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary,
    contextualAdmissionAuthority: {
      ...contextualAdmissionAuthority,
      executionKey: 'different-execution',
    },
  })

assert.equal(identityMismatch.identityMatched, false)
assert.equal(identityMismatch.executorEligible, false)

/*
 * Negative 2:
 * explicit contextual denial must remain denied.
 */
const contextualAdmissionDenied =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary,
    contextualAdmissionAuthority: {
      ...contextualAdmissionAuthority,
      contextualAdmission: false,
    },
  })

assert.equal(
  contextualAdmissionDenied.contextualAdmissionMatched,
  false,
)
assert.equal(contextualAdmissionDenied.executorEligible, false)

/*
 * Negative 3:
 * policy mismatch cannot be repaired by contextual admission.
 */
const policyMismatch =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary: {
      ...executorBoundary,
      policyMatched: false,
    },
    contextualAdmissionAuthority,
  })

assert.equal(policyMismatch.policyMatched, false)
assert.equal(policyMismatch.executorEligible, false)

/*
 * Negative 4:
 * this boundary is NOT a mechanism for globally opening the Registry.
 * external.read must remain default-denied.
 */
const globalRegistryOpeningRejected =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary: {
      ...executorBoundary,
      toolAllowed: true,
    },
    contextualAdmissionAuthority,
  })

assert.equal(
  globalRegistryOpeningRejected.registryDefaultDenied,
  false,
)
assert.equal(
  globalRegistryOpeningRejected.executorEligible,
  false,
)

/*
 * Negative 5:
 * the generic executor must still be safely blocked before this
 * external.read-specific admission boundary can reconcile authority.
 */
const alreadyEligibleGenericExecutor =
  evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary({
    executorBoundary: {
      ...executorBoundary,
      executorEligible: true,
      executorBoundaryStatus: 'eligible',
    },
    contextualAdmissionAuthority,
  })

assert.equal(
  alreadyEligibleGenericExecutor.executorEligible,
  false,
)

/*
 * Permanent owner invariants:
 * production-path integration is version-scoped and proved separately.
 * This owner itself must never perform network I/O or execute the effect.
 */

assert.equal(ownerSource.includes('fetch('), false)

assert.equal(
  ownerSource.includes(
    'executeRuntimeToolControlledExternalReadEffect(',
  ),
  false,
)

console.log({
  architecture:
    'governed-controlled-external-read-executor-admission-boundary',

  registryExternalReadRegistered: true,
  registryExternalReadAllowed: externalRead.allowed,

  identityMatched: eligible.identityMatched,
  invocationPrepared: eligible.invocationPrepared,
  registryDefaultDenied: eligible.registryDefaultDenied,
  policyMatched: eligible.policyMatched,
  contextualAdmissionMatched: eligible.contextualAdmissionMatched,

  executorEligible: eligible.executorEligible,

  identityMismatchRejected:
    identityMismatch.executorEligible === false,

  contextualAdmissionDeniedRejected:
    contextualAdmissionDenied.executorEligible === false,

  policyMismatchRejected:
    policyMismatch.executorEligible === false,

  globalRegistryOpeningRejected:
    globalRegistryOpeningRejected.executorEligible === false,

  alreadyEligibleGenericExecutorRejected:
    alreadyEligibleGenericExecutor.executorEligible === false,

  productionIntegrated: false,

  registryMutationApplied: eligible.registryMutationApplied,
  networkAccess: eligible.networkAccess,
  externalReadApplied: eligible.externalReadApplied,
  executionApplied: eligible.executionApplied,
  mutationApplied: eligible.mutationApplied,
  providerInvocation: eligible.providerInvocation,
})
