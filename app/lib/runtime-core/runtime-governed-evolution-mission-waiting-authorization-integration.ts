import {
  consumeGovernedEvolutionMissionAuthorization,
  type GovernedEvolutionMissionAuthorizationDecision,
} from "./runtime-governed-evolution-mission-authorization-consumption";

export type GovernedEvolutionMissionWaitingAuthorizationIntegrationInput = {
  missionId: string;
  proposalId: string;
  authorizationDecision: GovernedEvolutionMissionAuthorizationDecision;
};

export type GovernedEvolutionMissionWaitingAuthorizationIntegrationDecision = {
  waitingAuthorizationIntegrated: boolean;
  authorizationConsumed: boolean;
  missionIdentityBound: boolean;
  executionAuthorized: boolean;
  dispatchApplied: false;
  executionApplied: false;
  mutationApplied: false;
  networkAuthorityGranted: false;
  productionMutationApplied: false;
  selfPromotionApplied: false;
};

export function integrateGovernedEvolutionMissionWaitingAuthorization(
  input: GovernedEvolutionMissionWaitingAuthorizationIntegrationInput,
): GovernedEvolutionMissionWaitingAuthorizationIntegrationDecision {
  const consumed = consumeGovernedEvolutionMissionAuthorization({
    missionId: input.missionId,
    proposalId: input.proposalId,
    authorizationDecision: input.authorizationDecision,
  });

  const waitingAuthorizationIntegrated =
    consumed.authorizationConsumed === true &&
    consumed.missionIdentityBound === true &&
    consumed.executionAuthorized === true;

  return {
    waitingAuthorizationIntegrated,
    authorizationConsumed: consumed.authorizationConsumed,
    missionIdentityBound: consumed.missionIdentityBound,
    executionAuthorized: consumed.executionAuthorized,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  };
}
