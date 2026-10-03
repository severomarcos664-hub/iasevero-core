import { prepareGovernedEvolutionMissionControlledExternalReadEffectAdmissionIntegration } from './runtime-governed-evolution-mission-controlled-external-read-effect-admission-integration';

export type GovernedResearchMissionExternalReadEffectAdmissionIntegrationInput = {
  readonly executionKey: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly stepId: string;
  readonly researchMissionExternalReadExecutionEligible: boolean;
  readonly routeConsumerBindingPrepared: boolean;
  readonly effectHandoffPrepared: boolean;
};

export function prepareGovernedResearchMissionExternalReadEffectAdmissionIntegration(
  input: GovernedResearchMissionExternalReadEffectAdmissionIntegrationInput,
) {
  const existingEffectAdmission =
    prepareGovernedEvolutionMissionControlledExternalReadEffectAdmissionIntegration({
      executionKey: input.executionKey,
      correlationId: input.correlationId,
      traceId: input.traceId,
      stepId: input.stepId,
      routeConsumerBindingPrepared:
        input.routeConsumerBindingPrepared &&
        input.researchMissionExternalReadExecutionEligible,
      effectHandoffPrepared: input.effectHandoffPrepared,
    });

  return {
    ...existingEffectAdmission,
    researchMissionExternalReadExecutionEligible:
      input.researchMissionExternalReadExecutionEligible,
    researchMissionEffectAdmissionPrepared:
      input.researchMissionExternalReadExecutionEligible === true &&
      existingEffectAdmission.effectAdmissionPrepared === true,
    networkAccess: false as const,
    externalReadApplied: false as const,
    executionApplied: false as const,
    mutationApplied: false as const,
  };
}
