import {
  integrateGovernedEvolutionMissionWaitingAuthorization,
  type GovernedEvolutionMissionWaitingAuthorizationIntegrationInput,
} from "./runtime-governed-evolution-mission-waiting-authorization-integration";
import { prepareGovernedEvolutionMissionDispatchBinding } from "./runtime-governed-evolution-mission-dispatch-preparation-binding";
import { bindGovernedEvolutionMissionDispatchTransactionalIdentity } from "./runtime-governed-evolution-mission-dispatch-transactional-identity-binding";
import { prepareGovernedEvolutionMissionDispatchExecutiveAuthorityHandoff } from "./runtime-governed-evolution-mission-dispatch-executive-authority-handoff";

export type GovernedEvolutionMissionAuthorizedDispatchPipelineIntegrationInput =
  GovernedEvolutionMissionWaitingAuthorizationIntegrationInput & {
    executionKey: string;
    correlationId: string;
    traceId: string;
    stepId: string;
  };

export function integrateGovernedEvolutionMissionAuthorizedDispatchPipeline(
  input: GovernedEvolutionMissionAuthorizedDispatchPipelineIntegrationInput,
) {
  const authorization =
    integrateGovernedEvolutionMissionWaitingAuthorization(input);

  const preparation = prepareGovernedEvolutionMissionDispatchBinding({
    missionId: input.missionId,
    proposalId: input.proposalId,
    authorizationDecision: authorization,
  });

  const transactional =
    bindGovernedEvolutionMissionDispatchTransactionalIdentity({
      missionId: input.missionId,
      proposalId: input.proposalId,
      executionKey: input.executionKey,
      correlationId: input.correlationId,
      traceId: input.traceId,
      stepId: input.stepId,
      preparationDecision: preparation,
    });

  const handoff =
    prepareGovernedEvolutionMissionDispatchExecutiveAuthorityHandoff({
      missionId: input.missionId,
      proposalId: input.proposalId,
      transactionalDecision: transactional,
    });

  return {
    waitingAuthorizationIntegrated:
      authorization.waitingAuthorizationIntegrated,
    authorizationConsumed: authorization.authorizationConsumed,
    missionIdentityBound: handoff.missionIdentityBound,
    executionAuthorized: authorization.executionAuthorized,
    dispatchEligible: transactional.dispatchEligible,
    dispatchPrepared: handoff.dispatchPrepared,
    transactionalIdentityBound: handoff.transactionalIdentityBound,
    handoffEligible: handoff.handoffEligible,
    handoffPrepared: handoff.handoffPrepared,
    executionKey: handoff.executionKey,
    correlationId: handoff.correlationId,
    traceId: handoff.traceId,
    stepId: handoff.stepId,
    dispatchApplied: false as const,
    executionApplied: false as const,
    mutationApplied: false as const,
    networkAuthorityGranted: false as const,
    productionMutationApplied: false as const,
    selfPromotionApplied: false as const,
  };
}
