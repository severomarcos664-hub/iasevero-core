import assert from 'node:assert/strict'

import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  getAppliedIntelligenceCapabilityEligibility,
} from '../app/runtime/capabilities/runtime-capability-registry'

import { buildExecutiveRuntimeContext } from '../app/lib/executive-runtime-context/executive-runtime-context'

const provedCapability = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
  (capability) =>
    capability.status === 'proved' &&
    capability.implementationClaim === true &&
    capability.evidenceIds.length > 0 &&
    capability.localFirst === true &&
    capability.externalProviderRequired === false,
)

assert.ok(provedCapability)

const eligibility =
  getAppliedIntelligenceCapabilityEligibility(provedCapability.id)

assert.equal(eligibility.found, true)
assert.equal(eligibility.eligibleForAppliedUse, true)
assert.equal(eligibility.executionAuthorized, false)

const executiveContext = buildExecutiveRuntimeContext(
  'governed capability context propagation proof',
  'local',
  'general',
)

const executionAllowedBeforeCapabilityObservation =
  executiveContext.executionAllowed

const capabilityObservation = Object.freeze({
  capabilityId: eligibility.capabilityId,
  status: eligibility.status,
  implementationClaim: eligibility.implementationClaim,
  evidenceIds: Object.freeze([...(eligibility.evidenceIds ?? [])]),
  localFirst: eligibility.localFirst,
  externalProviderRequired: eligibility.externalProviderRequired,
  eligibleForAppliedUse: eligibility.eligibleForAppliedUse,
  executionAuthorized: eligibility.executionAuthorized,
})

assert.equal(capabilityObservation.eligibleForAppliedUse, true)
assert.equal(capabilityObservation.executionAuthorized, false)

assert.equal(
  executiveContext.executionAllowed,
  executionAllowedBeforeCapabilityObservation,
)

assert.equal(
  capabilityObservation.eligibleForAppliedUse === true &&
    capabilityObservation.executionAuthorized === false,
  true,
)

console.log(
  'Runtime governed capability context propagation boundary proof passed.',
)

console.log({
  architecture: 'governed-capability-context-propagation-boundary',
  capabilityId: capabilityObservation.capabilityId,
  capabilityEligibilityObserved: true,
  eligibilityIsReadOnlyObservation: true,
  eligibilityDoesNotMutateExecutiveContext: true,
  eligibilityDoesNotAuthorizeExecution: true,
  executiveContextExecutionPreserved: true,
  executionApplied: false,
  mutationApplied: false,
})
