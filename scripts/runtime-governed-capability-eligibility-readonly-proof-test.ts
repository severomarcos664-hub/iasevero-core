import assert from 'node:assert/strict'
import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  getAppliedIntelligenceCapabilityEligibility,
} from '../app/runtime/capabilities/runtime-capability-registry'

const provedCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    (capability) =>
      capability.status === 'proved' &&
      capability.implementationClaim &&
      capability.evidenceIds.length > 0 &&
      capability.localFirst &&
      !capability.externalProviderRequired,
  )

assert.ok(
  provedCapability,
  'The governed capability matrix must contain at least one proved applied capability.',
)

const provedReport =
  getAppliedIntelligenceCapabilityEligibility(provedCapability.id)

assert.equal(provedReport.found, true)
assert.equal(provedReport.capabilityId, provedCapability.id)
assert.equal(provedReport.status, 'proved')
assert.equal(provedReport.implementationClaim, true)
assert.ok(provedReport.evidenceIds.length > 0)
assert.equal(provedReport.localFirst, true)
assert.equal(provedReport.externalProviderRequired, false)
assert.equal(provedReport.eligibleForAppliedUse, true)

assert.equal(
  provedReport.executionAuthorized,
  false,
  'Capability eligibility must never imply execution authorization.',
)

assert.notEqual(
  provedReport.evidenceIds,
  provedCapability.evidenceIds,
  'Eligibility report must expose a defensive evidenceIds copy.',
)

const nonProvedCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    (capability) => capability.status !== 'proved',
  )

assert.ok(
  nonProvedCapability,
  'The matrix must expose at least one governed non-proved capability for negative proof.',
)

const nonProvedReport =
  getAppliedIntelligenceCapabilityEligibility(nonProvedCapability.id)

assert.equal(nonProvedReport.found, true)
assert.equal(nonProvedReport.eligibleForAppliedUse, false)
assert.equal(nonProvedReport.executionAuthorized, false)

const missingId = '__missing-governed-capability__'

const missingReport =
  getAppliedIntelligenceCapabilityEligibility(missingId)

assert.deepEqual(missingReport, {
  found: false,
  capabilityId: missingId,
  status: null,
  implementationClaim: false,
  evidenceIds: [],
  localFirst: false,
  externalProviderRequired: false,
  eligibleForAppliedUse: false,
  executionAuthorized: false,
  reason: 'Capability not found in the governed capability matrix.',
})

const result = {
  owner:
    'app/runtime/capabilities/runtime-capability-registry.ts',
  architecture: 'governed-capability-eligibility-readonly',
  canonicalRegistryReused: true,
  provedCapabilityResolved: true,
  nonProvedCapabilityRejectedForAppliedUse: true,
  missingCapabilityRejected: true,
  defensiveEvidenceCopy: true,
  eligibilityIsNotExecutionAuthorization: true,
  apiIntegrationApplied: false,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed capability eligibility read-only proof passed.',
)

console.log(result)
