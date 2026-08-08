import assert from 'node:assert/strict'

import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  decideAppliedIntelligenceCapability,
} from '../app/runtime/capabilities/runtime-capability-registry'

const eligibleCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    capability =>
      capability.status === 'proved' &&
      capability.implementationClaim === true &&
      capability.evidenceIds.length > 0 &&
      capability.localFirst === true &&
      capability.externalProviderRequired === false,
  )

assert.ok(eligibleCapability)

const eligibleDecision =
  decideAppliedIntelligenceCapability(eligibleCapability.id)

assert.equal(eligibleDecision.decision, 'eligible')
assert.equal(eligibleDecision.capabilityFound, true)
assert.equal(eligibleDecision.eligibilityResolved, true)
assert.equal(eligibleDecision.decisionDerivedFromEligibility, true)
assert.equal(eligibleDecision.executionAuthorized, false)
assert.equal(eligibleDecision.dispatchApplied, false)
assert.equal(eligibleDecision.executionApplied, false)
assert.equal(eligibleDecision.mutationApplied, false)

const ineligibleCapability =
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
    capability =>
      !(
        capability.status === 'proved' &&
        capability.implementationClaim === true &&
        capability.evidenceIds.length > 0 &&
        capability.localFirst === true &&
        capability.externalProviderRequired === false
      ),
  )

assert.ok(ineligibleCapability)

const ineligibleDecision =
  decideAppliedIntelligenceCapability(ineligibleCapability.id)

assert.equal(ineligibleDecision.decision, 'ineligible')
assert.equal(ineligibleDecision.capabilityFound, true)
assert.equal(ineligibleDecision.eligibilityResolved, true)
assert.equal(ineligibleDecision.executionAuthorized, false)
assert.equal(ineligibleDecision.dispatchApplied, false)
assert.equal(ineligibleDecision.executionApplied, false)
assert.equal(ineligibleDecision.mutationApplied, false)

const unknownDecision =
  decideAppliedIntelligenceCapability(
    'non-existent-capability-v28610-proof',
  )

assert.equal(unknownDecision.decision, 'unknown')
assert.equal(unknownDecision.capabilityFound, false)
assert.equal(unknownDecision.eligibilityResolved, true)
assert.equal(unknownDecision.executionAuthorized, false)
assert.equal(unknownDecision.dispatchApplied, false)
assert.equal(unknownDecision.executionApplied, false)
assert.equal(unknownDecision.mutationApplied, false)

console.log('Runtime governed capability decision proof passed.')

console.log({
  architecture: 'governed-capability-decision',
  eligibleDecision: eligibleDecision.decision,
  ineligibleDecision: ineligibleDecision.decision,
  unknownDecision: unknownDecision.decision,
  decisionDerivedFromEligibility: true,
  authorizationSeparatedFromDecision: true,
  executionAuthorized: false,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
})
