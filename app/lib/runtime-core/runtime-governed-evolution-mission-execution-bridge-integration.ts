import type { GovernedEvolutionMissionExecutionBridgeHandoffDecision } from "./runtime-governed-evolution-mission-execution-bridge-handoff";

export type GovernedEvolutionMissionExecutionBridgeIntegrationInput = {
  missionId: string;
  proposalId: string;
  executionBridgeHandoffDecision: GovernedEvolutionMissionExecutionBridgeHandoffDecision;
};

export type GovernedEvolutionMissionExecutionBridgeIntegrationDecision = {
  integrationEvaluated: true;
  executionBridgeIntegrationEligible: boolean;
  executionBridgeIntegrationPrepared: boolean;
  executionBridgeInvoked: false;
  executionKey: string;
  correlationId: string;
  traceId: string;
  stepId: string;
  dispatchApplied: false;
  executionApplied: false;
  mutationApplied: false;
  networkAuthorityGranted: false;
  productionMutationApplied: false;
  selfPromotionApplied: false;
};

export function integrateGovernedEvolutionMissionExecutionBridge(
  input: GovernedEvolutionMissionExecutionBridgeIntegrationInput,
): GovernedEvolutionMissionExecutionBridgeIntegrationDecision {
  const decision = input.executionBridgeHandoffDecision;

  const inheritedAuthorityIsZero =
    decision.dispatchApplied === false &&
    decision.executionApplied === false &&
    decision.mutationApplied === false &&
    decision.networkAuthorityGranted === false &&
    decision.productionMutationApplied === false &&
    decision.selfPromotionApplied === false;

  const executionBridgeIntegrationEligible =
    input.missionId.trim().length > 0 &&
    input.proposalId.trim().length > 0 &&
    decision.executiveAuthorityEvaluated === true &&
    decision.executiveAuthorityAllowed === true &&
    decision.executionBridgeHandoffEligible === true &&
    decision.executionBridgeHandoffPrepared === true &&
    decision.executionKey.trim().length > 0 &&
    decision.correlationId.trim().length > 0 &&
    decision.traceId.trim().length > 0 &&
    decision.stepId.trim().length > 0 &&
    inheritedAuthorityIsZero;

  return {
    integrationEvaluated: true,
    executionBridgeIntegrationEligible,
    executionBridgeIntegrationPrepared: executionBridgeIntegrationEligible,
    executionBridgeInvoked: false,
    executionKey: decision.executionKey,
    correlationId: decision.correlationId,
    traceId: decision.traceId,
    stepId: decision.stepId,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  };
}
