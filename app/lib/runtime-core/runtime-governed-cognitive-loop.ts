export type CognitiveLoopPhase =
  | 'observe'
  | 'remember'
  | 'plan'
  | 'authorize'
  | 'execute'
  | 'evaluate'
  | 'learn'
  | 'stop';

export type CognitiveStopReason =
  | 'objective-completed'
  | 'maximum-iterations-reached'
  | 'governance-blocked'
  | 'risk-limit-reached'
  | 'insufficient-evidence'
  | 'execution-failed'
  | 'no-valid-plan';

export interface CognitiveObjective {
  id: string;
  goal: string;
  successCriteria: string[];
  constraints: string[];
  maximumIterations: number;
  maximumRiskScore: number;
  externalAccessAllowed: boolean;
  destructiveActionsAllowed: false;
}

export interface CognitiveEvidence {
  id: string;
  source: string;
  statement: string;
  confidence: number;
  verified: boolean;
}

export interface CognitiveMemory {
  working: CognitiveEvidence[];
  episodic: CognitiveEvidence[];
  semantic: CognitiveEvidence[];
}

export interface CognitiveAction {
  id: string;
  description: string;
  expectedOutcome: string;
  riskScore: number;
  reversible: boolean;
  requiresExternalAccess: boolean;
  destructive: boolean;
}

export interface CognitivePlan {
  id: string;
  objectiveId: string;
  actions: CognitiveAction[];
  confidence: number;
  rationale: string[];
}

export interface CognitiveAuthorization {
  allowed: boolean;
  matrixApproved: boolean;
  policyApproved: boolean;
  integrityApproved: boolean;
  reason: string;
}

export interface CognitiveExecutionResult {
  actionId: string;
  success: boolean;
  output: string;
  evidence: CognitiveEvidence[];
  error: string | null;
}

export interface CognitiveEvaluation {
  objectiveSatisfied: boolean;
  progressScore: number;
  confidence: number;
  observations: string[];
  learnedEvidence: CognitiveEvidence[];
}

export interface CognitiveIterationTrace {
  iteration: number;
  phases: CognitiveLoopPhase[];
  selectedAction: CognitiveAction | null;
  authorization: CognitiveAuthorization | null;
  execution: CognitiveExecutionResult | null;
  evaluation: CognitiveEvaluation | null;
  reasoning: string[];
}

export interface CognitiveLoopState {
  objectiveId: string;
  iteration: number;
  progressScore: number;
  accumulatedRisk: number;
  completed: boolean;
  stopReason: CognitiveStopReason | null;
  memory: CognitiveMemory;
}

export interface CognitiveLoopReport {
  generatedAt: string;
  source: 'runtime-governed-cognitive-loop';
  objective: CognitiveObjective;
  state: CognitiveLoopState;
  traces: CognitiveIterationTrace[];
  finalRecommendation: string;
}

export interface CognitiveLoopAdapters {
  observe(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
  ): Promise<CognitiveEvidence[]>;

  retrieveMemory(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
  ): Promise<CognitiveMemory>;

  createPlan(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
    evidence: CognitiveEvidence[],
  ): Promise<CognitivePlan>;

  authorize(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
    action: CognitiveAction,
  ): Promise<CognitiveAuthorization>;

  execute(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
    action: CognitiveAction,
  ): Promise<CognitiveExecutionResult>;

  evaluate(
    objective: CognitiveObjective,
    state: CognitiveLoopState,
    action: CognitiveAction,
    result: CognitiveExecutionResult,
  ): Promise<CognitiveEvaluation>;

  consolidateMemory(
    current: CognitiveMemory,
    learnedEvidence: CognitiveEvidence[],
  ): Promise<CognitiveMemory>;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return clamp(value, 0, 1);
}

function validateAction(
  objective: CognitiveObjective,
  state: CognitiveLoopState,
  action: CognitiveAction,
): CognitiveAuthorization {
  if (action.destructive) {
    return {
      allowed: false,
      matrixApproved: false,
      policyApproved: false,
      integrityApproved: false,
      reason: 'Destructive actions are prohibited by the objective contract.',
    };
  }

  if (!action.reversible) {
    return {
      allowed: false,
      matrixApproved: false,
      policyApproved: false,
      integrityApproved: false,
      reason: 'Non-reversible actions are prohibited.',
    };
  }

  if (
    action.requiresExternalAccess &&
    !objective.externalAccessAllowed
  ) {
    return {
      allowed: false,
      matrixApproved: true,
      policyApproved: false,
      integrityApproved: true,
      reason: 'External access is not authorized for this objective.',
    };
  }

  if (
    state.accumulatedRisk + action.riskScore >
    objective.maximumRiskScore
  ) {
    return {
      allowed: false,
      matrixApproved: true,
      policyApproved: true,
      integrityApproved: false,
      reason: 'The action would exceed the objective risk limit.',
    };
  }

  return {
    allowed: true,
    matrixApproved: true,
    policyApproved: true,
    integrityApproved: true,
    reason: 'Action satisfies the local cognitive safety contract.',
  };
}

function createInitialState(
  objective: CognitiveObjective,
): CognitiveLoopState {
  return {
    objectiveId: objective.id,
    iteration: 0,
    progressScore: 0,
    accumulatedRisk: 0,
    completed: false,
    stopReason: null,
    memory: {
      working: [],
      episodic: [],
      semantic: [],
    },
  };
}

export async function runGovernedCognitiveLoop(
  objective: CognitiveObjective,
  adapters: CognitiveLoopAdapters,
): Promise<CognitiveLoopReport> {
  let state = createInitialState(objective);
  const traces: CognitiveIterationTrace[] = [];

  while (
    !state.completed &&
    state.iteration < objective.maximumIterations
  ) {
    const iteration = state.iteration + 1;
    const phases: CognitiveLoopPhase[] = [];
    const reasoning: string[] = [];

    phases.push('observe');
    const observedEvidence = await adapters.observe(objective, state);

    const verifiedEvidence = observedEvidence.filter(
      (evidence) =>
        evidence.verified &&
        normalizeConfidence(evidence.confidence) >= 0.6,
    );

    reasoning.push(
      `observedEvidence:${observedEvidence.length}`,
      `verifiedEvidence:${verifiedEvidence.length}`,
    );

    if (verifiedEvidence.length === 0) {
      state = {
        ...state,
        iteration,
        stopReason: 'insufficient-evidence',
      };

      traces.push({
        iteration,
        phases: [...phases, 'stop'],
        selectedAction: null,
        authorization: null,
        execution: null,
        evaluation: null,
        reasoning: [
          ...reasoning,
          'No verified evidence reached the minimum confidence threshold.',
        ],
      });

      break;
    }

    phases.push('remember');
    const retrievedMemory = await adapters.retrieveMemory(
      objective,
      state,
    );

    state = {
      ...state,
      memory: retrievedMemory,
    };

    phases.push('plan');
    const plan = await adapters.createPlan(
      objective,
      state,
      verifiedEvidence,
    );

    reasoning.push(
      `plan:${plan.id}`,
      `planConfidence:${normalizeConfidence(plan.confidence)}`,
      ...plan.rationale,
    );

    const selectedAction =
      plan.actions
        .filter((action) => !action.destructive && action.reversible)
        .sort((first, second) => first.riskScore - second.riskScore)[0] ??
      null;

    if (selectedAction === null) {
      state = {
        ...state,
        iteration,
        stopReason: 'no-valid-plan',
      };

      traces.push({
        iteration,
        phases: [...phases, 'stop'],
        selectedAction: null,
        authorization: null,
        execution: null,
        evaluation: null,
        reasoning: [
          ...reasoning,
          'The planner did not produce a valid reversible action.',
        ],
      });

      break;
    }

    phases.push('authorize');

    const localAuthorization = validateAction(
      objective,
      state,
      selectedAction,
    );

    const matrixAuthorization = localAuthorization.allowed
      ? await adapters.authorize(objective, state, selectedAction)
      : localAuthorization;

    const finalAuthorization: CognitiveAuthorization = {
      allowed:
        localAuthorization.allowed &&
        matrixAuthorization.allowed &&
        matrixAuthorization.matrixApproved &&
        matrixAuthorization.policyApproved &&
        matrixAuthorization.integrityApproved,
      matrixApproved:
        localAuthorization.matrixApproved &&
        matrixAuthorization.matrixApproved,
      policyApproved:
        localAuthorization.policyApproved &&
        matrixAuthorization.policyApproved,
      integrityApproved:
        localAuthorization.integrityApproved &&
        matrixAuthorization.integrityApproved,
      reason: localAuthorization.allowed
        ? matrixAuthorization.reason
        : localAuthorization.reason,
    };

    reasoning.push(
      `selectedAction:${selectedAction.id}`,
      `authorizationAllowed:${finalAuthorization.allowed}`,
      `authorizationReason:${finalAuthorization.reason}`,
    );

    if (!finalAuthorization.allowed) {
      state = {
        ...state,
        iteration,
        stopReason:
          state.accumulatedRisk + selectedAction.riskScore >
          objective.maximumRiskScore
            ? 'risk-limit-reached'
            : 'governance-blocked',
      };

      traces.push({
        iteration,
        phases: [...phases, 'stop'],
        selectedAction,
        authorization: finalAuthorization,
        execution: null,
        evaluation: null,
        reasoning,
      });

      break;
    }

    phases.push('execute');
    const execution = await adapters.execute(
      objective,
      state,
      selectedAction,
    );

    if (!execution.success) {
      state = {
        ...state,
        iteration,
        accumulatedRisk:
          state.accumulatedRisk + selectedAction.riskScore,
        stopReason: 'execution-failed',
      };

      traces.push({
        iteration,
        phases: [...phases, 'stop'],
        selectedAction,
        authorization: finalAuthorization,
        execution,
        evaluation: null,
        reasoning: [
          ...reasoning,
          `executionError:${execution.error ?? 'unknown'}`,
        ],
      });

      break;
    }

    phases.push('evaluate');
    const evaluation = await adapters.evaluate(
      objective,
      state,
      selectedAction,
      execution,
    );

    phases.push('learn');
    const consolidatedMemory = await adapters.consolidateMemory(
      state.memory,
      evaluation.learnedEvidence,
    );

    state = {
      ...state,
      iteration,
      progressScore: clamp(evaluation.progressScore, 0, 100),
      accumulatedRisk:
        state.accumulatedRisk + selectedAction.riskScore,
      completed: evaluation.objectiveSatisfied,
      stopReason: evaluation.objectiveSatisfied
        ? 'objective-completed'
        : null,
      memory: consolidatedMemory,
    };

    traces.push({
      iteration,
      phases: evaluation.objectiveSatisfied
        ? [...phases, 'stop']
        : phases,
      selectedAction,
      authorization: finalAuthorization,
      execution,
      evaluation,
      reasoning: [
        ...reasoning,
        `executionSuccess:${execution.success}`,
        `progressScore:${state.progressScore}`,
        `objectiveSatisfied:${evaluation.objectiveSatisfied}`,
        ...evaluation.observations,
      ],
    });
  }

  if (!state.completed && state.stopReason === null) {
    state = {
      ...state,
      stopReason: 'maximum-iterations-reached',
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-governed-cognitive-loop',
    objective,
    state,
    traces,
    finalRecommendation: state.completed
      ? 'Objective completed within matrix, policy and risk constraints.'
      : `Cognitive loop stopped: ${state.stopReason ?? 'unknown'}.`,
  };
}
