import { evaluateRuntimeExecutiveAuthorityGateway } from '../runtime-executive-authority-gateway/runtime-executive-authority-gateway';
import {
  integrateGovernedEvolutionMissionAuthorizedDispatchPipeline,
  type GovernedEvolutionMissionAuthorizedDispatchPipelineIntegrationInput,
} from './runtime-governed-evolution-mission-authorized-dispatch-pipeline-integration';

export type GovernedEvolutionMissionExecutiveAuthorityGatewayIntegrationInput =
  GovernedEvolutionMissionAuthorizedDispatchPipelineIntegrationInput;

export function integrateGovernedEvolutionMissionExecutiveAuthorityGateway(
  input: GovernedEvolutionMissionExecutiveAuthorityGatewayIntegrationInput,
) {
  const pipeline =
    integrateGovernedEvolutionMissionAuthorizedDispatchPipeline(input);

  const executiveAuthority =
    evaluateRuntimeExecutiveAuthorityGateway();

  const executiveAuthorityEvaluated =
    pipeline.handoffPrepared === true;

  return {
    waitingAuthorizationIntegrated: pipeline.waitingAuthorizationIntegrated,
    authorizationConsumed: pipeline.authorizationConsumed,
    missionIdentityBound: pipeline.missionIdentityBound,
    executionAuthorized: pipeline.executionAuthorized,
    dispatchEligible: pipeline.dispatchEligible,
    dispatchPrepared: pipeline.dispatchPrepared,
    transactionalIdentityBound: pipeline.transactionalIdentityBound,
    handoffEligible: pipeline.handoffEligible,
    handoffPrepared: pipeline.handoffPrepared,
    executiveAuthorityEvaluated,
    executiveAuthorityAllowed:
      executiveAuthorityEvaluated && executiveAuthority.executionAllowed === true,
    executiveExecutionAllowed:
      executiveAuthorityEvaluated && executiveAuthority.executionAllowed === true,
    executionKey: pipeline.executionKey,
    correlationId: pipeline.correlationId,
    traceId: pipeline.traceId,
    stepId: pipeline.stepId,
    dispatchApplied: false as const,
    executionApplied: false as const,
    mutationApplied: false as const,
    networkAuthorityGranted: false as const,
    productionMutationApplied: false as const,
    selfPromotionApplied: false as const,
  };
}
