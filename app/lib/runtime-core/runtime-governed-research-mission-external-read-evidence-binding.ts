export type GovernedResearchMissionExternalReadEvidenceBindingInput = {
  missionId: string;
  missionExecutionKey: string;
  missionCorrelationId: string;
  missionTraceId: string;
  missionStepId: string;
  evidenceId: string;
  evidenceExecutionKey: string;
  evidenceCorrelationId: string;
  evidenceTraceId: string;
  evidenceStepId: string;
  evidenceCreated: boolean;
  provenanceStatus: 'verified';
};

export type GovernedResearchMissionExternalReadEvidenceBinding = {
  missionId: string;
  evidenceId: string;
  researchMissionEvidenceBound: boolean;
  provenanceVerified: boolean;
  authorityGranted: false;
  networkAccess: false;
  executionApplied: false;
  mutationApplied: false;
  memoryApplied: false;
  learningApplied: false;
};

export function bindGovernedResearchMissionExternalReadEvidence(
  input: GovernedResearchMissionExternalReadEvidenceBindingInput,
): GovernedResearchMissionExternalReadEvidenceBinding {
  const identitiesMatch =
    input.missionExecutionKey === input.evidenceExecutionKey &&
    input.missionCorrelationId === input.evidenceCorrelationId &&
    input.missionTraceId === input.evidenceTraceId &&
    input.missionStepId === input.evidenceStepId;

  const provenanceVerified =
    input.evidenceCreated === true &&
    input.provenanceStatus === 'verified';

  return {
    missionId: input.missionId,
    evidenceId: input.evidenceId,
    researchMissionEvidenceBound:
      input.missionId.trim().length > 0 &&
      input.evidenceId.trim().length > 0 &&
      identitiesMatch &&
      provenanceVerified,
    provenanceVerified,
    authorityGranted: false,
    networkAccess: false,
    executionApplied: false,
    mutationApplied: false,
    memoryApplied: false,
    learningApplied: false,
  };
}
