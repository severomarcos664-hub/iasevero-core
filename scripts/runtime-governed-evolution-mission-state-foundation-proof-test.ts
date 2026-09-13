import assert from 'node:assert/strict'
import {
  mkdtempSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  checkpointGovernedEvolutionMissionState,
  createGovernedEvolutionMissionState,
  loadGovernedEvolutionMissionState,
  persistGovernedEvolutionMissionState,
  type GovernedEvolutionMissionState,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-state'

const repositoryDir = mkdtempSync(
  join(tmpdir(), 'iasevero-evolution-mission-proof-'),
)

try {
  const initial =
    createGovernedEvolutionMissionState({
      missionId:
        'mission-v2877353-permanent-evolution-proof',
      objectiveId:
        'objective-v2877353-proof',
      objective:
        'Continuously research and prepare governed IASevero evolution candidates.',
      maximumResearchIterations: 1000,
      networkReadBudget: 5000,
      sandboxExecutionBudget: 500,
      now: '2026-09-13T22:45:00.000Z',
    })

  assert.equal(initial.status, 'active')
  assert.equal(initial.checkpointSequence, 0)
  assert.equal(initial.selfPromotionAllowed, false)
  assert.equal(initial.productionMutationAllowed, false)
  assert.equal(initial.humanAuthorizationRequired, true)

  const initialPath =
    persistGovernedEvolutionMissionState(
      repositoryDir,
      initial,
    )

  assert.ok(initialPath.endsWith('.json'))

  const restoredInitial =
    loadGovernedEvolutionMissionState(
      repositoryDir,
      initial.missionId,
    )

  assert.ok(restoredInitial)
  assert.deepEqual(restoredInitial, initial)

  const checkpointed =
    checkpointGovernedEvolutionMissionState(
      restoredInitial,
      {
        currentTaskId:
          'research-external-content-trust',
        completedTaskId:
          'baseline-inspection',
        researchIteration: 1,
        now: '2026-09-13T22:46:00.000Z',
      },
    )

  assert.equal(
    checkpointed.checkpointSequence,
    1,
  )
  assert.equal(
    checkpointed.researchIteration,
    1,
  )
  assert.equal(
    checkpointed.currentTaskId,
    'research-external-content-trust',
  )
  assert.deepEqual(
    checkpointed.completedTaskIds,
    ['baseline-inspection'],
  )

  persistGovernedEvolutionMissionState(
    repositoryDir,
    checkpointed,
  )

  const restoredCheckpoint =
    loadGovernedEvolutionMissionState(
      repositoryDir,
      initial.missionId,
    )

  assert.ok(restoredCheckpoint)
  assert.equal(
    restoredCheckpoint.checkpointSequence,
    1,
  )
  assert.equal(
    restoredCheckpoint.currentTaskId,
    'research-external-content-trust',
  )

  const waiting =
    checkpointGovernedEvolutionMissionState(
      restoredCheckpoint,
      {
        status: 'waiting_authorization',
        completedTaskId:
          'research-external-content-trust',
        currentTaskId: null,
        researchIteration: 2,
        now: '2026-09-13T22:47:00.000Z',
      },
    )

  assert.equal(
    waiting.status,
    'waiting_authorization',
  )
  assert.equal(
    waiting.selfPromotionAllowed,
    false,
  )
  assert.equal(
    waiting.productionMutationAllowed,
    false,
  )
  assert.equal(
    waiting.humanAuthorizationRequired,
    true,
  )

  const authorityInjected = {
    ...waiting,
    selfPromotionAllowed: true,
  } as unknown as GovernedEvolutionMissionState

  assert.throws(
    () =>
      persistGovernedEvolutionMissionState(
        repositoryDir,
        authorityInjected,
      ),
    /requires zero self-promotion and production mutation authority/,
  )

  assert.throws(
    () =>
      checkpointGovernedEvolutionMissionState(
        waiting,
        {
          researchIteration: 1001,
        },
      ),
    /exceeds maximum research iterations/,
  )

  console.log({
    architecture:
      'objective -> durable-mission-state -> atomic-checkpoint -> restore -> waiting-authorization -> no-self-promotion',
    missionId: waiting.missionId,
    checkpointSequence:
      waiting.checkpointSequence,
    restoredAfterPersistence:
      restoredCheckpoint.missionId ===
      initial.missionId,
    status: waiting.status,
    selfPromotionAllowed:
      waiting.selfPromotionAllowed,
    productionMutationAllowed:
      waiting.productionMutationAllowed,
    humanAuthorizationRequired:
      waiting.humanAuthorizationRequired,
  })

  console.log(
    'Runtime governed persistent evolution mission state foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
