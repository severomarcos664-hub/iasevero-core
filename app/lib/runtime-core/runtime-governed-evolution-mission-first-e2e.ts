import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  createGovernedEvolutionMissionState,
  persistGovernedEvolutionMissionState,
} from './runtime-governed-evolution-mission-state';
import {
  acquireGovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease';
import {
  runGovernedPermanentEvolutionMissionIteration,
} from './runtime-governed-permanent-evolution-mission-runner';

export type GovernedEvolutionMissionFirstE2EInput = {
  missionId: string;
  objectiveId: string;
  objective: string;
};

export type GovernedEvolutionMissionFirstE2EResult = {
  missionId: string;
  objectiveId: string;

  cognitiveCycleCompleted: true;
  selfDevelopmentAssessmentCompleted: true;
  checkpointApplied: true;
  missionStatePersisted: true;
  leaseRenewalApplied: true;

  nextState: 'continue' | 'waiting_authorization' | 'completed';

  executionAuthorityGranted: false;
  networkAuthorityGranted: false;
  sandboxAuthorityGranted: false;
  productionMutationAllowed: false;
  selfPromotionAllowed: false;
};

export async function runGovernedEvolutionMissionFirstE2E(
  input: GovernedEvolutionMissionFirstE2EInput,
): Promise<GovernedEvolutionMissionFirstE2EResult> {
  const missionId = input.missionId.trim();
  const objectiveId = input.objectiveId.trim();
  const objectiveText = input.objective.trim();

  if (!missionId || !objectiveId || !objectiveText) {
    throw new Error(
      'Governed evolution mission first E2E requires mission, objective identity, and objective.',
    );
  }

  const repositoryDir = mkdtempSync(
    join(tmpdir(), 'iasevero-governed-evolution-mission-e2e-'),
  );

  try {
    const missionState = createGovernedEvolutionMissionState({
      missionId,
      objectiveId,
      objective: objectiveText,
      maximumResearchIterations: 3,
      networkReadBudget: 0,
      sandboxExecutionBudget: 0,
      now: '2026-09-20T20:40:00.000Z',
    });

    persistGovernedEvolutionMissionState(repositoryDir, missionState);

    const acquisition = acquireGovernedEvolutionMissionLease(
      repositoryDir,
      {
        missionId,
        runnerId: 'iasevero-v2877414-e2e-runner',
        leaseDurationMs: 60_000,
        now: '2026-09-20T20:40:00.000Z',
      },
    );

    if (!acquisition.acquired) {
      throw new Error(
        'Governed evolution mission first E2E could not acquire canonical mission lease.',
      );
    }

    const lease = acquisition.lease;

    const result = await runGovernedPermanentEvolutionMissionIteration({
      repositoryDir,
      missionId,
      lease,
      leaseDurationMs: 60_000,
      objective: {
        id: objectiveId,
        goal: objectiveText,
        successCriteria: [
          'Produce evidence-based architecture gap assessment.',
          'Produce governed improvement proposal.',
        ],
        constraints: [
          'Read-only analysis.',
          'No external network authority.',
          'No production mutation.',
          'No self-promotion.',
        ],
        maximumIterations: 3,
        maximumRiskScore: 25,
        externalAccessAllowed: false,
        destructiveActionsAllowed: false,
      },
      cognitiveAdapters: {
                observe: async (_objective, _state) => [
          {
            id: 'mission-first-e2e-observation',
            source: 'runtime-governed-permanent-evolution-mission-runner',
            statement: 'Governed permanent evolution mission observation established in read-only mode.',
            confidence: 0.9,
            verified: true,
          },
        ],
retrieveMemory: async () => ({
          working: [],
          episodic: [],
          semantic: [],
        }),
        createPlan: async (objective) => ({
          id: 'mission-first-e2e-plan',
          objectiveId: objective.id,
          actions: [
            {
              id: 'architecture-technology-gap-analysis',
              description: objectiveText,
              expectedOutcome:
                'Governed evidence-based architecture gap assessment.',
              riskScore: 0,
              reversible: true,
              requiresExternalAccess: false,
              destructive: false,
            },
          ],
          confidence: 0.9,
          rationale: ['Read-only governed first E2E fixture.'],
        }),
        authorize: async (_objective, _state, action) => ({
          allowed: true,
          matrixApproved: true,
          policyApproved: true,
          integrityApproved: true,
          reason: `Read-only governed authorization for ${action.id}.`,
        }),
        execute: async (_objective, _state, action) => ({
          actionId: action.id,
          success: true,
          output:
            'Governed architecture and technology gap analysis completed in read-only mode.',
          evidence: [],
          error: null,
        }),
        evaluate: async (_objective, _state, _action, _result) => ({
          objectiveSatisfied: true,
          progressScore: 1,
          confidence: 0.9,
          observations: [
            'Mission executed through governed permanent evolution mission runner.',
          ],
          learnedEvidence: [],
        }),
        consolidateMemory: async (current, learnedEvidence) => ({
          working: current.working,
          episodic: [...current.episodic, ...learnedEvidence],
          semantic: current.semantic,
        }),
      },
    selfDevelopmentInput: {
        mode: 'proposal-only',
        objective: {
          id: objectiveId,
          goal: objectiveText,
          successCriteria: [
            'Produce evidence-based assessment.',
            'Preserve governance boundaries.',
          ],
          constraints: [
            'No production mutation.',
            'No external access.',
            'No self-promotion.',
          ],
          maxIterations: 3,
          maxRiskScore: 25,
        },
        signals: [
          {
            source: 'runtime-evaluation',
            key: 'architecture-gap-analysis',
            value: 0.61,
            confidence: 0.8,
          },
          {
            source: 'runtime-telemetry',
            key: 'governed-mission-e2e',
            value: 0.74,
            confidence: 0.8,
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
      },
      now: '2026-09-20T20:40:10.000Z',
    });

    return {
      missionId,
      objectiveId,
      cognitiveCycleCompleted: result.cognitiveCycleCompleted,
      selfDevelopmentAssessmentCompleted:
        result.selfDevelopmentAssessmentCompleted,
      checkpointApplied: result.checkpointApplied,
      missionStatePersisted: result.missionStatePersisted,
      leaseRenewalApplied: result.leaseRenewalApplied,
      nextState: result.nextState as
        | 'continue'
        | 'waiting_authorization'
        | 'completed',
      executionAuthorityGranted: result.executionAuthorityGranted,
      networkAuthorityGranted: result.networkAuthorityGranted,
      sandboxAuthorityGranted: result.sandboxAuthorityGranted,
      productionMutationAllowed: result.productionMutationAllowed,
      selfPromotionAllowed: result.selfPromotionAllowed,
    };
  } finally {
    rmSync(repositoryDir, { recursive: true, force: true });
  }
}
