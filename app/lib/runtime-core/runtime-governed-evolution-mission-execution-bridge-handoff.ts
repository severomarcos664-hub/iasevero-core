import type { GovernedEvolutionMissionExecutiveAuthorityGatewayIntegrationDecision } from './runtime-governed-evolution-mission-executive-authority-gateway-integration';

export type GovernedEvolutionMissionExecutionBridgeHandoffInput = {
  missionId: string;
  proposalId: string;
  executiveAuthorityDecision: GovernedEvolutionMissionExecutiveAuthorityGatewayIntegrationDecision;
};

export type GovernedEvolutionMissionExecutionBridgeHandoffDecision = {
  executiveAuthorityEvaluated: boolean;
  executiveAuthorityAllowed: boolean;
  executionBridgeHandoffEligible: boolean;
  executionBridgeHandoffPrepared: boolean;
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

export function prepareGovernedEvolutionMissionExecutionBridgeHandoff(
  input: GovernedEvolutionMissionExecutionBridgeHandoffInput,
): GovernedEvolutionMissionExecutionBridgeHandoffDecision {
  const decision = input.executiveAuthorityDecision;
  const missionId = input.missionId.trim();
  const proposalId = input.proposalId.trim();

  const inheritedAuthorityIsZero =
    decision.dispatchApplied === false &&
    decision.executionApplied === false &&
    decision.mutationApplied === false &&
    decision.networkAuthorityGranted === false &&
    decision.productionMutationApplied === false &&
    decision.selfPromotionApplied === false;

  const executionBridgeHandoffEligible =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    decision.missionIdentityBound === true &&
    decision.transactionalIdentityBound === true &&
    decision.handoffPrepared === true &&
    decision.executiveAuthorityEvaluated === true &&
    decision.executiveAuthorityAllowed === true &&
    inheritedAuthorityIsZero;

  return {
    executiveAuthorityEvaluated: decision.executiveAuthorityEvaluated,
    executiveAuthorityAllowed: decision.executiveAuthorityAllowed,
    executionBridgeHandoffEligible,
    executionBridgeHandoffPrepared: executionBridgeHandoffEligible,
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
