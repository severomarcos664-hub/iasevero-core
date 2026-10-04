export type GovernedResearchIterationSourceBindingInput = {
  missionId: string;
  researchIteration: number;
  maximumResearchIterations: number;
  sourceEvaluated: boolean;
  sourceConfigured: boolean;
  sourceId: string | null;
};

export type GovernedResearchIterationSourceBinding = {
  missionId: string;
  researchIteration: number;
  sourceId: string | null;
  researchIterationSourceBound: boolean;
  sourceEvaluationVerified: boolean;
  iterationEligible: boolean;
  authorityGranted: false;
  networkAccess: false;
  executionApplied: false;
  mutationApplied: false;
  memoryApplied: false;
  learningApplied: false;
};

export function bindGovernedResearchIterationSource(
  input: GovernedResearchIterationSourceBindingInput,
): GovernedResearchIterationSourceBinding {
  const missionIdentityVerified = input.missionId.trim().length > 0;

  const iterationEligible =
    Number.isInteger(input.researchIteration) &&
    Number.isInteger(input.maximumResearchIterations) &&
    input.researchIteration >= 0 &&
    input.maximumResearchIterations > 0 &&
    input.researchIteration < input.maximumResearchIterations;

  const sourceEvaluationVerified =
    input.sourceEvaluated === true &&
    input.sourceConfigured === true &&
    input.sourceId !== null &&
    input.sourceId.trim().length > 0;

  return {
    missionId: input.missionId,
    researchIteration: input.researchIteration,
    sourceId: input.sourceId,
    researchIterationSourceBound:
      missionIdentityVerified &&
      iterationEligible &&
      sourceEvaluationVerified,
    sourceEvaluationVerified,
    iterationEligible,
    authorityGranted: false,
    networkAccess: false,
    executionApplied: false,
    mutationApplied: false,
    memoryApplied: false,
    learningApplied: false,
  };
}
