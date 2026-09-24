import type {
  GovernedEvolutionMissionCognitiveKernelAdmissionDecision,
} from './runtime-governed-evolution-mission-cognitive-kernel-admission';

export type GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationInput = {
  missionId: string;
  proposalId: string;
  cognitiveKernelAdmissionDecision: GovernedEvolutionMissionCognitiveKernelAdmissionDecision;
};

export type GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationDecision = {
  integrationEvaluated: true;
  missionIdentityBound: boolean;
  cognitiveKernelAdmissionPrepared: boolean;
  permanentMissionIntegrationEligible: boolean;
  permanentMissionIntegrationPrepared: boolean;
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

export function evaluateGovernedEvolutionMissionCognitiveKernelAdmissionIntegration(
  input: GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationInput,
): GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationDecision {
  const decision = input.cognitiveKernelAdmissionDecision;
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
    decision.missionIdentityBound === true &&
    decision.executionKey === missionId;

  const permanentMissionIntegrationEligible =
    missionIdentityBound &&
    decision.admissionEvaluated === true &&
    decision.executionBridgeIntegrationPrepared === true &&
    decision.cognitiveKernelAdmissionEligible === true &&
    decision.cognitiveKernelAdmissionPrepared === true &&
    decision.executionBridgeInvoked === false &&
    decision.executionKey.trim().length > 0 &&
    decision.correlationId.trim().length > 0 &&
    decision.traceId.trim().length > 0 &&
    decision.stepId.trim().length > 0 &&
    inheritedAuthorityIsZero;

  return {
    integrationEvaluated: true,
    missionIdentityBound,
    cognitiveKernelAdmissionPrepared:
      decision.cognitiveKernelAdmissionPrepared === true,
    permanentMissionIntegrationEligible,
    permanentMissionIntegrationPrepared: permanentMissionIntegrationEligible,
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
