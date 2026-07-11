import {
  runGovernedSelfDevelopmentCycle,
  type RuntimeSelfDevelopmentInput,
} from '../app/lib/runtime-core/runtime-governed-self-development';

const input: RuntimeSelfDevelopmentInput = {
  mode: 'proposal-only',
  objective: {
    id: 'improve-runtime-planning',
    goal: 'Improve planning quality while preserving governance',
    successCriteria: [
      'Planning accuracy improves',
      'No governance bypass occurs',
      'All changes remain reversible',
    ],
    constraints: [
      'Local-first',
      'Zero automatic external cost',
      'No production code mutation',
      'Human approval required',
    ],
    maxIterations: 3,
    maxRiskScore: 40,
  },
  signals: [
    {
      source: 'runtime-evaluation',
      key: 'planning-quality',
      value: 0.61,
      confidence: 0.82,
    },
    {
      source: 'runtime-telemetry',
      key: 'workflow-completion-rate',
      value: 0.74,
      confidence: 0.87,
    },
    {
      source: 'runtime-memory',
      key: 'repeated-planning-failures',
      value: 3,
      confidence: 0.79,
    },
  ],
  currentCapabilities: [
    'runtime-memory',
    'runtime-task-planner',
    'runtime-governance',
    'runtime-enforcement',
    'runtime-telemetry',
  ],
  governance: {
    matrixApproved: true,
    ethicsApproved: true,
    integrityApproved: true,
    humanApprovalRequired: true,
    externalAccessAllowed: false,
    codeMutationAllowed: false,
  },
};

const report = runGovernedSelfDevelopmentCycle(input);

if (report.status !== 'proposal-created') {
  throw new Error(
    `Expected proposal-created, received ${report.status}`,
  );
}

if (report.executionAllowed !== false) {
  throw new Error('Direct execution must remain blocked.');
}

if (report.directCodeMutationAllowed !== false) {
  throw new Error('Direct code mutation must remain blocked.');
}

if (!report.proposal?.reversible) {
  throw new Error('Proposal must be reversible.');
}

console.log(
  'OK: governed self-development proposal generated safely.',
);
console.log(JSON.stringify(report, null, 2));
