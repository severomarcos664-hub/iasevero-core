import {
  runGovernedCognitiveLoop,
  type CognitiveLoopAdapters,
  type CognitiveMemory,
  type CognitiveObjective,
} from '../app/lib/runtime-core/runtime-governed-cognitive-loop';

const objective: CognitiveObjective = {
  id: 'objective-improve-planning',
  goal: 'Identify and validate one safe improvement to runtime planning',
  successCriteria: [
    'A reversible improvement is identified',
    'The improvement is authorized by the matrix',
    'The result is evaluated',
    'Validated evidence is consolidated into memory',
  ],
  constraints: [
    'Local-first',
    'Zero external cost',
    'No destructive action',
    'No production mutation',
  ],
  maximumIterations: 3,
  maximumRiskScore: 30,
  externalAccessAllowed: false,
  destructiveActionsAllowed: false,
};

const initialMemory: CognitiveMemory = {
  working: [],
  episodic: [
    {
      id: 'episode-planning-001',
      source: 'runtime-evaluation',
      statement: 'Planning quality decreased on multi-step objectives.',
      confidence: 0.82,
      verified: true,
    },
  ],
  semantic: [],
};

let executionCount = 0;

const adapters: CognitiveLoopAdapters = {
  async observe() {
    return [
      {
        id: 'observation-planning-001',
        source: 'runtime-telemetry',
        statement: 'Repeated planning retries were detected.',
        confidence: 0.88,
        verified: true,
      },
    ];
  },

  async retrieveMemory() {
    return initialMemory;
  },

  async createPlan(currentObjective) {
    return {
      id: 'plan-planning-improvement-001',
      objectiveId: currentObjective.id,
      confidence: 0.91,
      rationale: [
        'Telemetry and episodic memory indicate repeated planning retries.',
        'A local reversible evaluation is the lowest-risk next action.',
      ],
      actions: [
        {
          id: 'action-evaluate-planning-strategy',
          description:
            'Evaluate a bounded alternative planning strategy in memory.',
          expectedOutcome:
            'Produce evidence about whether planning quality improves.',
          riskScore: 10,
          reversible: true,
          requiresExternalAccess: false,
          destructive: false,
        },
      ],
    };
  },

  async authorize() {
    return {
      allowed: true,
      matrixApproved: true,
      policyApproved: true,
      integrityApproved: true,
      reason: 'Matrix approved local reversible cognitive evaluation.',
    };
  },

  async execute(_currentObjective, _state, action) {
    executionCount += 1;

    return {
      actionId: action.id,
      success: true,
      output:
        'Alternative planning strategy improved simulated completion quality.',
      evidence: [
        {
          id: 'execution-evidence-001',
          source: 'runtime-cognitive-evaluation',
          statement:
            'Bounded strategy improved planning completion quality.',
          confidence: 0.9,
          verified: true,
        },
      ],
      error: null,
    };
  },

  async evaluate(_currentObjective, _state, _action, result) {
    return {
      objectiveSatisfied: result.success,
      progressScore: result.success ? 100 : 0,
      confidence: result.success ? 0.9 : 0,
      observations: [
        'The action completed without external access.',
        'The action remained reversible.',
        'The matrix authorization was preserved.',
      ],
      learnedEvidence: result.evidence,
    };
  },

  async consolidateMemory(current, learnedEvidence) {
    return {
      working: current.working,
      episodic: [...current.episodic, ...learnedEvidence],
      semantic: current.semantic,
    };
  },
};

async function main(): Promise<void> {
  const report = await runGovernedCognitiveLoop(
    objective,
    adapters,
  );

  if (!report.state.completed) {
    throw new Error(
      `Expected completed objective, received ${report.state.stopReason}`,
    );
  }

  if (report.state.stopReason !== 'objective-completed') {
    throw new Error(
      `Unexpected stop reason: ${report.state.stopReason}`,
    );
  }

  if (executionCount !== 1) {
    throw new Error(
      `Expected exactly one execution, received ${executionCount}`,
    );
  }

  if (report.state.memory.episodic.length !== 2) {
    throw new Error(
      'Validated execution evidence was not consolidated into memory.',
    );
  }

  if (report.traces[0]?.authorization?.allowed !== true) {
    throw new Error('The matrix did not authorize the safe action.');
  }

  console.log(
    'OK: governed cognitive core loop completed successfully.',
  );

  console.log(
    JSON.stringify(
      {
        objective: report.objective.id,
        completed: report.state.completed,
        stopReason: report.state.stopReason,
        iterations: report.state.iteration,
        progressScore: report.state.progressScore,
        accumulatedRisk: report.state.accumulatedRisk,
        memoryEvidence: report.state.memory.episodic.length,
        phases: report.traces[0]?.phases,
        recommendation: report.finalRecommendation,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
