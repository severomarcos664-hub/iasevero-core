import { strict as assert } from "node:assert";

import { integrateGovernedEvolutionMissionWaitingAuthorization } from "../app/lib/runtime-core/runtime-governed-evolution-mission-waiting-authorization-integration";

const decision = integrateGovernedEvolutionMissionWaitingAuthorization({
  missionId: "mission-v2877415",
  proposalId: "mission-v2877415",
  authorizationDecision: {
    integrationEvaluated: true,
    proposalIdentityBound: true,
    sandboxOnlyVerified: true,
    executionAuthorized: true,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  },
});

assert.equal(decision.waitingAuthorizationIntegrated, true);
assert.equal(decision.authorizationConsumed, true);
assert.equal(decision.missionIdentityBound, true);
assert.equal(decision.executionAuthorized, true);
assert.equal(decision.dispatchApplied, false);
assert.equal(decision.executionApplied, false);
assert.equal(decision.mutationApplied, false);
assert.equal(decision.networkAuthorityGranted, false);
assert.equal(decision.productionMutationApplied, false);
assert.equal(decision.selfPromotionApplied, false);

console.log("V287_74_15_GOVERNED_EVOLUTION_MISSION_WAITING_AUTHORIZATION_INTEGRATION_FOUNDATION_PROOF=PASS");
