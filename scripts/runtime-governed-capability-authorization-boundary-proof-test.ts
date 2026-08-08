import assert from 'node:assert/strict';

import {
  APPLIED_INTELLIGENCE_CAPABILITY_MATRIX,
  getAppliedIntelligenceCapabilityEligibility,
} from '../app/runtime/capabilities/runtime-capability-registry';

const provedCapability = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
  (capability) =>
    capability.status === 'proved' &&
    capability.implementationClaim === true &&
    capability.evidenceIds.length > 0 &&
    capability.localFirst === true &&
    capability.externalProviderRequired === false,
);

assert.ok(provedCapability);

const eligible = getAppliedIntelligenceCapabilityEligibility(provedCapability.id);

assert.equal(eligible.found, true);
assert.equal(eligible.eligibleForAppliedUse, true);
assert.equal(eligible.executionAuthorized, false);

const nonEligibleCapability = APPLIED_INTELLIGENCE_CAPABILITY_MATRIX.find(
  (capability) => {
    const eligibility =
      getAppliedIntelligenceCapabilityEligibility(capability.id);
    return eligibility.eligibleForAppliedUse === false;
  },
);

assert.ok(nonEligibleCapability);

const nonEligible = getAppliedIntelligenceCapabilityEligibility(nonEligibleCapability.id);
assert.equal(nonEligible.found, true);
assert.equal(nonEligible.eligibleForAppliedUse, false);
assert.equal(nonEligible.executionAuthorized, false);

const missing = getAppliedIntelligenceCapabilityEligibility('__iasevero_missing_capability__');
assert.equal(missing.found, false);
assert.equal(missing.eligibleForAppliedUse, false);
assert.equal(missing.executionAuthorized, false);

console.log('Runtime governed capability authorization boundary proof passed.');
console.log({
  architecture: 'governed-capability-authorization-boundary',
  provedCapability: provedCapability.id,
  eligibleForAppliedUse: eligible.eligibleForAppliedUse,
  eligibilityDoesNotAuthorizeExecution: eligible.executionAuthorized === false,
  nonEligibleCapabilityRejected: nonEligible.eligibleForAppliedUse === false,
  missingCapabilityRejected: missing.eligibleForAppliedUse === false,
  executionApplied: false,
  mutationApplied: false,
});
