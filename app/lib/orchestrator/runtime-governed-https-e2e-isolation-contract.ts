export type GovernedE2EIsolationEvidence = Readonly<{
  isolatedWorkspace: boolean;
  persistentDataRedirected: boolean;
  sqliteIsolationVerified: boolean;
  originalRepositoryProtected: boolean;
  networkAuthorityGranted: boolean;
}>;

export type GovernedE2EIsolationDecision = Readonly<{
  isolationEligible: boolean;
  executionAuthorized: false;
  executionApplied: false;
  mutationApplied: false;
  reason: string;
}>;

export function evaluateGovernedE2EIsolation(
  evidence: GovernedE2EIsolationEvidence
): GovernedE2EIsolationDecision {
  const isolationEligible =
    evidence.isolatedWorkspace === true &&
    evidence.persistentDataRedirected === true &&
    evidence.sqliteIsolationVerified === true &&
    evidence.originalRepositoryProtected === true;

  return {
    isolationEligible,
    executionAuthorized: false,
    executionApplied: false,
    mutationApplied: false,
    reason: isolationEligible
      ? "ISOLATION_EVIDENCE_ACCEPTED_EXECUTION_NOT_AUTHORIZED"
      : "ISOLATION_EVIDENCE_INSUFFICIENT"
  };
}
