import assert from 'node:assert/strict'

import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  assessAppliedIntelligenceCapabilityAuthorization,
} from '../app/runtime/capabilities/runtime-capability-registry'

const eligibleCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    (capability) =>
      capability.status === 'proved' &&
      capability.implementationClaim === true &&
      capability.evidenceIds.length > 0 &&
      capability.localFirst === true &&
      capability.externalProviderRequired === false
  )

assert.ok(eligibleCapability)

const eligibleAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(eligibleCapability.id)

assert.equal(eligibleAssessment.decision, 'eligible')
assert.equal(eligibleAssessment.capabilityFound, true)
assert.equal(eligibleAssessment.eligibilityResolved, true)
assert.equal(eligibleAssessment.decisionResolved, true)
assert.equal(eligibleAssessment.authorizationAssessed, true)
assert.equal(eligibleAssessment.executionAuthorized, false)
assert.equal(eligibleAssessment.dispatchApplied, false)
assert.equal(eligibleAssessment.executionApplied, false)
assert.equal(eligibleAssessment.mutationApplied, false)

const ineligibleCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    (capability) =>
      !(
        capability.status === 'proved' &&
        capability.implementationClaim === true &&
        capability.evidenceIds.length > 0 &&
        capability.localFirst === true &&
        capability.externalProviderRequired === false
      )
  )

assert.ok(ineligibleCapability)

const ineligibleAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(ineligibleCapability.id)

assert.equal(ineligibleAssessment.decision, 'ineligible')
assert.equal(ineligibleAssessment.capabilityFound, true)
assert.equal(ineligibleAssessment.authorizationAssessed, true)
assert.equal(ineligibleAssessment.executionAuthorized, false)
assert.equal(ineligibleAssessment.dispatchApplied, false)
assert.equal(ineligibleAssessment.executionApplied, false)
assert.equal(ineligibleAssessment.mutationApplied, false)

const unknownAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(
    'non-existent-capability-v28611-proof'
  )

assert.equal(unknownAssessment.decision, 'unknown')
assert.equal(unknownAssessment.capabilityFound, false)
assert.equal(unknownAssessment.authorizationAssessed, true)
assert.equal(unknownAssessment.executionAuthorized, false)
assert.equal(unknownAssessment.dispatchApplied, false)
assert.equal(unknownAssessment.executionApplied, false)
assert.equal(unknownAssessment.mutationApplied, false)

console.log('Runtime governed capability authorization assessment proof passed.')
console.log({
  architecture: 'governed-capability-authorization-assessment',
  eligibleDecision: eligibleAssessment.decision,
  ineligibleDecision: ineligibleAssessment.decision,
  unknownDecision: unknownAssessment.decision,
  authorizationAssessed: true,
  eligibleExecutionAuthorized: eligibleAssessment.executionAuthorized,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
})
