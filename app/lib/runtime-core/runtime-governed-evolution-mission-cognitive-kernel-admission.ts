import type {
  GovernedEvolutionMissionExecutionBridgeIntegrationDecision,
} from './runtime-governed-evolution-mission-execution-bridge-integration';

export type GovernedEvolutionMissionCognitiveKernelAdmissionInput = {
  missionId: string;
  proposalId: string;
  executionBridgeIntegrationDecision: GovernedEvolutionMissionExecutionBridgeIntegrationDecision;
};

export type GovernedEvolutionMissionCognitiveKernelAdmissionDecision = {
  admissionEvaluated: true;
  missionIdentityBound: boolean;
  executionBridgeIntegrationPrepared: boolean;
  cognitiveKernelAdmissionEligible: boolean;
  cognitiveKernelAdmissionPrepared: boolean;
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

export function evaluateGovernedEvolutionMissionCognitiveKernelAdmission(
  input: GovernedEvolutionMissionCognitiveKernelAdmissionInput,
): GovernedEvolutionMissionCognitiveKernelAdmissionDecision {
  const decision = input.executionBridgeIntegrationDecision;
  const missionId = input.missionId.trim();
  const proposalId = input.proposalId.trim();

  const inheritedAuthorityIsZero =
    decision.dispatchApplied === false &&
    decision.executionApplied === false &&
    decision.mutationApplied === false &&
    decision.networkAuthorityGranted === false &&
    decision.productionMutationApplied === false &&
    decision.selfPromotionApplied === false;

  const missionIdentityBound =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    decision.executionKey === missionId;

  const cognitiveKernelAdmissionEligible =
    missionIdentityBound &&
    decision.integrationEvaluated === true &&
    decision.executionBridgeIntegrationEligible === true &&
    decision.executionBridgeIntegrationPrepared === true &&
    decision.executionBridgeInvoked === false &&
    decision.executionKey.trim().length > 0 &&
    decision.correlationId.trim().length > 0 &&
    decision.traceId.trim().length > 0 &&
    decision.stepId.trim().length > 0 &&
    inheritedAuthorityIsZero;

  return {
    admissionEvaluated: true,
    missionIdentityBound,
    executionBridgeIntegrationPrepared:
      decision.executionBridgeIntegrationPrepared === true,
    cognitiveKernelAdmissionEligible,
    cognitiveKernelAdmissionPrepared: cognitiveKernelAdmissionEligible,
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
