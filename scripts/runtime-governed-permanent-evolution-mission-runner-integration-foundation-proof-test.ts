import assert from 'node:assert/strict'
import {
  mkdtempSync,
  rmSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import type {
  CognitiveAction,
  CognitiveLoopAdapters,
  CognitiveObjective,
} from '../app/lib/runtime-core/runtime-governed-cognitive-loop'

import {
  createGovernedEvolutionMissionState,
  loadGovernedEvolutionMissionState,
  persistGovernedEvolutionMissionState,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-state'

import {
  acquireGovernedEvolutionMissionLease,
  readGovernedEvolutionMissionLease,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-lease'

import {
  runGovernedPermanentEvolutionMissionIteration,
} from '../app/lib/runtime-core/runtime-governed-permanent-evolution-mission-runner'

async function main(): Promise<void> {
  const repositoryDir =
    mkdtempSync(
      join(
        tmpdir(),
        'iasevero-v2877359-permanent-evolution-runner-',
      ),
    )

  try {
    const missionId =
      'mission-v2877359-permanent-evolution-runner-proof'

    const runnerId =
      'runner-v2877359-proof'

    const objective: CognitiveObjective = {
      id: 'objective-v2877359-proof',
      goal:
        'Evaluate one bounded governed improvement opportunity without granting operational authority.',
      successCriteria: [
        'One governed cognitive iteration completes.',
        'Mission checkpoint advances exactly once.',
      ],
      constraints: [
        'No production mutation.',
        'No self-promotion.',
        'No external access.',
      ],
      maximumIterations: 1,
      maximumRiskScore: 25,
      externalAccessAllowed: false,
      destructiveActionsAllowed: false,
    }

    const initialState =
      createGovernedEvolutionMissionState({
        missionId,
        objectiveId: objective.id,
        objective: objective.goal,
        maximumResearchIterations: 10,
        networkReadBudget: 0,
        sandboxExecutionBudget: 0,
        now: '2026-09-13T23:30:00.000Z',
      })

    persistGovernedEvolutionMissionState(
      repositoryDir,
      initialState,
    )

    const acquisition =
      acquireGovernedEvolutionMissionLease(
        repositoryDir,
        {
          missionId,
          runnerId,
          leaseDurationMs: 60_000,
          now: '2026-09-13T23:30:01.000Z',
        },
      )

    assert.equal(acquisition.acquired, true)

    if (!acquisition.acquired) {
      throw new Error(
        'Expected governed evolution mission lease acquisition.',
      )
    }

    const originalLease = acquisition.lease

    const action: CognitiveAction = {
      id: 'action-v2877359-proof',
      description:
        'Evaluate bounded planning evidence.',
      expectedOutcome:
        'Verified evidence for a governed improvement assessment.',
      riskScore: 5,
      reversible: true,
      requiresExternalAccess: false,
      destructive: false,
    }

    const adapters: CognitiveLoopAdapters = {
      async observe() {
        return [
          {
            id: 'evidence-v2877359-observation',
            source: 'runtime-evaluation',
            statement:
              'Bounded planning quality evidence is available.',
            confidence: 0.95,
            verified: true,
          },
        ]
      },

      async retrieveMemory() {
        return {
          working: [],
          episodic: [],
          semantic: [],
        }
      },

      async createPlan(objective) {
        return {
          id: 'plan-v2877359-proof',
          objectiveId: objective.id,
          actions: [action],
          confidence: 0.95,
          rationale: [
            'Use one bounded reversible action.',
          ],
        }
      },

      async authorize(_objective, _state, actionInput) {
        return {
          allowed:
            actionInput.requiresExternalAccess === false &&
            actionInput.destructive === false,
          matrixApproved: true,
          policyApproved: true,
          integrityApproved: true,
          reason:
            'Bounded local proof action satisfies governance.',
        }
      },

      async execute(_objective, _state, actionInput) {
        return {
          actionId: actionInput.id,
          success: true,
          output:
            'Governed bounded planning assessment completed.',
          evidence: [
            {
              id: 'evidence-v2877359-execution',
              source: 'runtime-proof',
              statement:
                'Bounded governed action completed successfully.',
              confidence: 0.99,
              verified: true,
            },
          ],
          error: null,
        }
      },

      async evaluate(
        _objective,
        _state,
        _actionInput,
        execution,
      ) {
        return {
          objectiveSatisfied: true,
          progressScore: 1,
          confidence: 0.99,
          observations: [
            'Governed proof objective satisfied.',
          ],
          learnedEvidence:
            execution.evidence,
        }
      },

      async consolidateMemory(
        current,
        learnedEvidence,
      ) {
        return {
          working: current.working,
          episodic: [
            ...current.episodic,
            ...learnedEvidence,
          ],
          semantic: current.semantic,
        }
      },
    }

    const result =
      await runGovernedPermanentEvolutionMissionIteration({
        repositoryDir,
        missionId,
        lease: originalLease,
        leaseDurationMs: 60_000,
        objective,
        cognitiveAdapters: adapters,
        selfDevelopmentInput: {
          mode: 'proposal-only',
          objective: {
            id: 'self-development-v2877359-proof',
            goal:
              'Improve planning quality while preserving governance.',
            successCriteria: [
              'Produce evidence-based assessment.',
            ],
            constraints: [
              'No production mutation.',
              'No self-promotion.',
            ],
            maxIterations: 3,
            maxRiskScore: 25,
          },
          signals: [
            {
              source: 'runtime-evaluation',
              key: 'planning-quality',
              value: 0.61,
              confidence: 0.40,
            },
            {
              source: 'runtime-telemetry',
              key: 'workflow-completion-rate',
              value: 0.74,
              confidence: 0.50,
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
        now: '2026-09-13T23:30:10.000Z',
      })

    assert.equal(
      result.cognitiveCycleCompleted,
      true,
    )
    assert.equal(
      result.selfDevelopmentAssessmentCompleted,
      true,
    )
    assert.equal(result.checkpointApplied, true)
    assert.equal(result.missionStatePersisted, true)
    assert.equal(result.leaseRenewalApplied, true)

    assert.equal(
      result.previousCheckpointSequence,
      0,
    )
    assert.equal(result.checkpointSequence, 1)

    assert.equal(
      result.previousResearchIteration,
      0,
    )
    assert.equal(result.researchIteration, 1)

    assert.equal(result.nextState, 'continue')

    assert.equal(
      result.executionAuthorityGranted,
      false,
    )
    assert.equal(
      result.networkAuthorityGranted,
      false,
    )
    assert.equal(
      result.sandboxAuthorityGranted,
      false,
    )
    assert.equal(
      result.productionMutationAllowed,
      false,
    )
    assert.equal(
      result.selfPromotionAllowed,
      false,
    )

    const persistedState =
      loadGovernedEvolutionMissionState(
        repositoryDir,
        missionId,
      )

    assert.ok(persistedState)
    assert.equal(
      persistedState.checkpointSequence,
      1,
    )
    assert.equal(
      persistedState.researchIteration,
      1,
    )

    const renewedLease =
      readGovernedEvolutionMissionLease(
        repositoryDir,
        missionId,
      )

    assert.ok(renewedLease)
    assert.equal(
      renewedLease.runnerId,
      runnerId,
    )
    assert.equal(
      renewedLease.leaseSequence,
      originalLease.leaseSequence + 1,
    )

    await assert.rejects(
      () =>
        runGovernedPermanentEvolutionMissionIteration({
          repositoryDir,
          missionId,
          lease: originalLease,
          leaseDurationMs: 60_000,
          objective,
          cognitiveAdapters: adapters,
          selfDevelopmentInput: {
            mode: 'proposal-only',
            objective: {
              id: 'stale-lease-proof',
              goal: 'Must never execute.',
              successCriteria: ['Rejected'],
              constraints: ['No authority'],
              maxIterations: 1,
              maxRiskScore: 1,
            },
            signals: [],
            currentCapabilities: [],
            governance: {
              matrixApproved: true,
              ethicsApproved: true,
              integrityApproved: true,
              humanApprovalRequired: true,
              externalAccessAllowed: false,
              codeMutationAllowed: false,
            },
          },
          now: '2026-09-13T23:30:20.000Z',
        }),
      /requires the current canonical persisted lease/,
    )

    console.log({
      architecture:
        'persistent-mission -> resume -> canonical-lease -> cognitive-cycle -> self-development -> checkpoint -> atomic-persist -> lease-renewal -> stale-lease-rejected',
      missionId,
      checkpointSequence:
        result.checkpointSequence,
      researchIteration:
        result.researchIteration,
      originalLeaseSequence:
        originalLease.leaseSequence,
      renewedLeaseSequence:
        renewedLease.leaseSequence,
      cognitiveCycleCompleted:
        result.cognitiveCycleCompleted,
      selfDevelopmentAssessmentCompleted:
        result.selfDevelopmentAssessmentCompleted,
      missionStatePersisted:
        result.missionStatePersisted,
      leaseRenewalApplied:
        result.leaseRenewalApplied,
      staleLeaseRejected: true,
      executionAuthorityGranted:
        result.executionAuthorityGranted,
      networkAuthorityGranted:
        result.networkAuthorityGranted,
      sandboxAuthorityGranted:
        result.sandboxAuthorityGranted,
      productionMutationAllowed:
        result.productionMutationAllowed,
      selfPromotionAllowed:
        result.selfPromotionAllowed,
    })

    console.log(
      'Runtime governed permanent evolution mission runner integration foundation proof passed.',
    )
  } finally {
    rmSync(repositoryDir, {
      recursive: true,
      force: true,
    })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
