export type RuntimeSelfDevelopmentMode =
  | 'disabled'
  | 'proposal-only'
  | 'sandbox';

export type RuntimeSelfDevelopmentStatus =
  | 'disabled'
  | 'insufficient-evidence'
  | 'proposal-created'
  | 'blocked-by-governance'
  | 'approved-for-sandbox';

export interface RuntimeSelfDevelopmentObjective {
  id: string;
  goal: string;
  successCriteria: string[];
  constraints: string[];
  maxIterations: number;
  maxRiskScore: number;
}

export interface RuntimeSelfDevelopmentSignal {
  source: string;
  key: string;
  value: string | number | boolean;
  confidence: number;
}

export interface RuntimeSelfDevelopmentGovernance {
  matrixApproved: boolean;
  ethicsApproved: boolean;
  integrityApproved: boolean;
  humanApprovalRequired: boolean;
  externalAccessAllowed: boolean;
  codeMutationAllowed: boolean;
}

export interface RuntimeSelfDevelopmentInput {
  mode: RuntimeSelfDevelopmentMode;
  objective: RuntimeSelfDevelopmentObjective;
  signals: RuntimeSelfDevelopmentSignal[];
  currentCapabilities: string[];
  governance: RuntimeSelfDevelopmentGovernance;
}

export interface RuntimeSelfDevelopmentProposal {
  id: string;
  objectiveId: string;
  title: string;
  rationale: string[];
  expectedBenefits: string[];
  successCriteria: string[];
  riskScore: number;
  reversible: true;
  requiresHumanApproval: true;
  allowedEnvironment: 'sandbox-only';
  prohibitedActions: string[];
}

export interface RuntimeSelfDevelopmentReport {
  generatedAt: string;
  source: 'runtime-governed-self-development';
  mode: RuntimeSelfDevelopmentMode;
  status: RuntimeSelfDevelopmentStatus;
  evidenceScore: number;
  governanceApproved: boolean;
  executionAllowed: false;
  directCodeMutationAllowed: false;
  proposal: RuntimeSelfDevelopmentProposal | null;
  reasoning: string[];
  recommendation: string;
}

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const normalizeConfidence = (value: number): number =>
  clamp(Number.isFinite(value) ? value : 0, 0, 1);

function calculateEvidenceScore(
  signals: RuntimeSelfDevelopmentSignal[],
): number {
  if (signals.length === 0) {
    return 0;
  }

  const total = signals.reduce(
    (sum, signal) => sum + normalizeConfidence(signal.confidence),
    0,
  );

  return Number((total / signals.length).toFixed(4));
}

function calculateRiskScore(
  objective: RuntimeSelfDevelopmentObjective,
  governance: RuntimeSelfDevelopmentGovernance,
): number {
  let risk = 20;

  if (!governance.matrixApproved) risk += 30;
  if (!governance.ethicsApproved) risk += 30;
  if (!governance.integrityApproved) risk += 20;
  if (governance.externalAccessAllowed) risk += 10;
  if (governance.codeMutationAllowed) risk += 25;

  if (objective.maxIterations > 5) risk += 10;

  return clamp(risk, 0, 100);
}

function governanceAllowsSandboxProposal(
  governance: RuntimeSelfDevelopmentGovernance,
): boolean {
  return (
    governance.matrixApproved &&
    governance.ethicsApproved &&
    governance.integrityApproved &&
    !governance.codeMutationAllowed
  );
}

export function runGovernedSelfDevelopmentCycle(
  input: RuntimeSelfDevelopmentInput,
): RuntimeSelfDevelopmentReport {
  const generatedAt = new Date().toISOString();
  const evidenceScore = calculateEvidenceScore(input.signals);
  const governanceApproved = governanceAllowsSandboxProposal(
    input.governance,
  );

  const baseReport = {
    generatedAt,
    source: 'runtime-governed-self-development' as const,
    mode: input.mode,
    evidenceScore,
    governanceApproved,
    executionAllowed: false as const,
    directCodeMutationAllowed: false as const,
  };

  if (input.mode === 'disabled') {
    return {
      ...baseReport,
      status: 'disabled',
      proposal: null,
      reasoning: [
        'Self-development mode is disabled.',
        'No proposal, execution or mutation was performed.',
      ],
      recommendation:
        'Enable proposal-only mode to permit governed improvement analysis.',
    };
  }

  if (evidenceScore < 0.6) {
    return {
      ...baseReport,
      status: 'insufficient-evidence',
      proposal: null,
      reasoning: [
        `evidenceScore:${evidenceScore}`,
        'Minimum evidence score required: 0.6.',
        'The runtime must collect stronger operational evidence.',
      ],
      recommendation:
        'Collect additional telemetry, evaluation and failure evidence before proposing a change.',
    };
  }

  if (!governanceApproved) {
    return {
      ...baseReport,
      status: 'blocked-by-governance',
      proposal: null,
      reasoning: [
        `matrixApproved:${input.governance.matrixApproved}`,
        `ethicsApproved:${input.governance.ethicsApproved}`,
        `integrityApproved:${input.governance.integrityApproved}`,
        `codeMutationAllowed:${input.governance.codeMutationAllowed}`,
        'Governance requirements were not satisfied.',
      ],
      recommendation:
        'Resolve governance restrictions before creating a sandbox proposal.',
    };
  }

  const riskScore = calculateRiskScore(
    input.objective,
    input.governance,
  );

  if (riskScore > input.objective.maxRiskScore) {
    return {
      ...baseReport,
      status: 'blocked-by-governance',
      proposal: null,
      reasoning: [
        `riskScore:${riskScore}`,
        `maximumAllowedRisk:${input.objective.maxRiskScore}`,
        'Calculated risk exceeds the objective limit.',
      ],
      recommendation:
        'Reduce scope, iterations, external access or mutation privileges.',
    };
  }

  const proposal: RuntimeSelfDevelopmentProposal = {
    id: `self-development-${Date.now()}`,
    objectiveId: input.objective.id,
    title: `Governed improvement proposal: ${input.objective.goal}`,
    rationale: input.signals.map(
      (signal) =>
        `${signal.source}:${signal.key}=${String(signal.value)} confidence=${normalizeConfidence(signal.confidence)}`,
    ),
    expectedBenefits: [
      'Improve runtime capability without bypassing the matrix.',
      'Preserve traceability, reversibility and governance.',
      'Generate measurable evidence before permanent adoption.',
    ],
    successCriteria: input.objective.successCriteria,
    riskScore,
    reversible: true,
    requiresHumanApproval: true,
    allowedEnvironment: 'sandbox-only',
    prohibitedActions: [
      'Direct mutation of production code',
      'Automatic push to remote repositories',
      'Automatic credential or secret access',
      'Unapproved external network access',
      'Destructive file, database or infrastructure operations',
      'Bypassing matrix, policy, governance or enforcement',
    ],
  };

  return {
    ...baseReport,
    status:
      input.mode === 'sandbox'
        ? 'approved-for-sandbox'
        : 'proposal-created',
    proposal,
    reasoning: [
      `objective:${input.objective.id}`,
      `evidenceScore:${evidenceScore}`,
      `riskScore:${riskScore}`,
      `matrixApproved:${input.governance.matrixApproved}`,
      `ethicsApproved:${input.governance.ethicsApproved}`,
      `integrityApproved:${input.governance.integrityApproved}`,
      'Direct production mutation remains prohibited.',
    ],
    recommendation:
      input.mode === 'sandbox'
        ? 'Execute the proposal only in an isolated sandbox and evaluate the result.'
        : 'Submit the proposal to matrix and human approval before sandbox execution.',
  };
}
