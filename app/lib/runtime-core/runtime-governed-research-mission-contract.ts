export type GovernedResearchMissionContractInput = {
  missionId: string;
  objective: string;
  executionKey: string;
  correlationId: string;
  traceId: string;
  stepId: string;
};

export type GovernedResearchMissionContract = {
  schemaVersion: 1;
  kind: "iasevero-governed-research-mission-contract";
  missionId: string;
  objective: string;
  executionKey: string;
  correlationId: string;
  traceId: string;
  stepId: string;
  researchObjectiveBound: boolean;
  missionIdentityBound: boolean;
  correlationIdentityBound: boolean;
  researchMissionContractEligible: boolean;
  researchAuthorityGranted: false;
  networkAuthorityGranted: false;
  networkAccess: false;
  externalReadApplied: false;
  executionApplied: false;
  mutationApplied: false;
  memoryApplied: false;
  learningApplied: false;
  technologyAcquired: false;
  technologyInstalled: false;
  productionMutationApplied: false;
  selfPromotionApplied: false;
};

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`Governed research mission contract requires non-empty ${field}.`);
  }
  return normalized;
}

export function createGovernedResearchMissionContract(
  input: GovernedResearchMissionContractInput,
): GovernedResearchMissionContract {
  const missionId = requireNonEmpty(input.missionId, "missionId");
  const objective = requireNonEmpty(input.objective, "objective");
  const executionKey = requireNonEmpty(input.executionKey, "executionKey");
  const correlationId = requireNonEmpty(input.correlationId, "correlationId");
  const traceId = requireNonEmpty(input.traceId, "traceId");
  const stepId = requireNonEmpty(input.stepId, "stepId");

  return {
    schemaVersion: 1,
    kind: "iasevero-governed-research-mission-contract",
    missionId,
    objective,
    executionKey,
    correlationId,
    traceId,
    stepId,
    researchObjectiveBound: true,
    missionIdentityBound: true,
    correlationIdentityBound: true,
    researchMissionContractEligible: true,
    researchAuthorityGranted: false,
    networkAuthorityGranted: false,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    memoryApplied: false,
    learningApplied: false,
    technologyAcquired: false,
    technologyInstalled: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  };
}
