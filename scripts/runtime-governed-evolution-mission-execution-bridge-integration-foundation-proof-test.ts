import assert from "node:assert/strict";
import { integrateGovernedEvolutionMissionExecutionBridge } from "../app/lib/runtime-core/runtime-governed-evolution-mission-execution-bridge-integration";

const base = {
  missionId: "mission-v2877419",
  proposalId: "proposal-v2877419",
  executionBridgeHandoffDecision: {
    executiveAuthorityEvaluated: true,
    executiveAuthorityAllowed: true,
    executionBridgeHandoffEligible: true,
    executionBridgeHandoffPrepared: true,
    executionKey: "execution-v2877419",
    correlationId: "correlation-v2877419",
    traceId: "trace-v2877419",
    stepId: "step-v2877419",
    dispatchApplied: false as const,
    executionApplied: false as const,
    mutationApplied: false as const,
    networkAuthorityGranted: false as const,
    productionMutationApplied: false as const,
    selfPromotionApplied: false as const,
  },
};

const allowed = integrateGovernedEvolutionMissionExecutionBridge(base);
assert.equal(allowed.integrationEvaluated, true);
assert.equal(allowed.executionBridgeIntegrationEligible, true);
assert.equal(allowed.executionBridgeIntegrationPrepared, true);
assert.equal(allowed.executionBridgeInvoked, false);
assert.equal(allowed.dispatchApplied, false);
assert.equal(allowed.executionApplied, false);
assert.equal(allowed.mutationApplied, false);
assert.equal(allowed.networkAuthorityGranted, false);
assert.equal(allowed.productionMutationApplied, false);
assert.equal(allowed.selfPromotionApplied, false);

const denied = integrateGovernedEvolutionMissionExecutionBridge({
  ...base,
  executionBridgeHandoffDecision: {
    ...base.executionBridgeHandoffDecision,
    executionBridgeHandoffPrepared: false,
  },
});
assert.equal(denied.executionBridgeIntegrationEligible, false);
assert.equal(denied.executionBridgeIntegrationPrepared, false);
assert.equal(denied.executionBridgeInvoked, false);
assert.equal(denied.executionApplied, false);

console.log("V287_74_19_GOVERNED_EVOLUTION_MISSION_EXECUTION_BRIDGE_INTEGRATION_FOUNDATION_PROOF=PASS");
