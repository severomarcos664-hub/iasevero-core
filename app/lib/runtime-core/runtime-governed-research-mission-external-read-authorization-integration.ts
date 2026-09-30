import {
  evaluateRuntimeToolControlledExternalReadAuthorizationBoundary,
} from "../orchestrator/runtime-tool-controlled-external-read-authorization-boundary";

export type GovernedResearchMissionExternalReadAuthorizationIntegrationInput = {
  researchMissionExternalReadCapabilityRequestEligible: boolean;
  executionKey: string;
  correlationId: string;
  traceId: string;
  stepId: string;
};

export type GovernedResearchMissionExternalReadAuthorizationIntegrationDecision = {
  researchMissionExternalReadCapabilityRequestEligible: boolean;
  externalReadAuthorization: "requires-existing-controlled-authorization";
  executionKey: string;
  correlationId: string;
  traceId: string;
  stepId: string;
  networkAccess: false;
  externalReadApplied: false;
  executionApplied: false;
  mutationApplied: false;
};

export function integrateGovernedResearchMissionExternalReadAuthorization(
  input: GovernedResearchMissionExternalReadAuthorizationIntegrationInput,
): GovernedResearchMissionExternalReadAuthorizationIntegrationDecision {
  void evaluateRuntimeToolControlledExternalReadAuthorizationBoundary;

  return {
    researchMissionExternalReadCapabilityRequestEligible:
      input.researchMissionExternalReadCapabilityRequestEligible === true,
    externalReadAuthorization: "requires-existing-controlled-authorization",
    executionKey: input.executionKey,
    correlationId: input.correlationId,
    traceId: input.traceId,
    stepId: input.stepId,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
  };
}
