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
  persistGovernedEvolutionMissionState,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-state'

import {
  assessGovernedEvolutionMissionResume,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-resume'

const repositoryDir = mkdtempSync(
  join(tmpdir(), 'iasevero-evolution-resume-proof-'),
)

try {
  const active =
    createGovernedEvolutionMissionState({
      missionId:
        'mission-v2877354-resume-proof',
      objectiveId:
        'objective-v2877354-proof',
      objective:
        'Permanently research governed IASevero evolution opportunities.',
      maximumResearchIterations: 1000,
      networkReadBudget: 5000,
      sandboxExecutionBudget: 500,
      now: '2026-09-13T23:00:00.000Z',
    })

  const checkpointed =
    checkpointGovernedEvolutionMissionState(
      active,
      {
        currentTaskId:
          'research-frontier-improvements',
        researchIteration: 7,
        now: '2026-09-13T23:01:00.000Z',
      },
    )

  persistGovernedEvolutionMissionState(
    repositoryDir,
    checkpointed,
  )

  const resumable =
    assessGovernedEvolutionMissionResume(
      repositoryDir,
      active.missionId,
    )

  assert.equal(
    resumable.missionStateVerified,
    true,
  )
  assert.equal(
    resumable.checkpointVerified,
    true,
  )
  assert.equal(
    resumable.resumeAssessmentCompleted,
    true,
  )
  assert.equal(
    resumable.resumeEligible,
    true,
  )
  assert.equal(
    resumable.reason,
    'active-mission-resumable',
  )
  assert.equal(
    resumable.currentTaskId,
    'research-frontier-improvements',
  )

  assert.equal(
    resumable.executionApplied,
    false,
  )
  assert.equal(
    resumable.sandboxExecutionApplied,
    false,
  )
  assert.equal(
    resumable.productionMutationApplied,
    false,
  )
  assert.equal(
    resumable.selfPromotionApplied,
    false,
  )
  assert.equal(
    resumable.humanAuthorizationRequired,
    true,
  )

  const waiting =
    checkpointGovernedEvolutionMissionState(
      checkpointed,
      {
        status: 'waiting_authorization',
        currentTaskId: null,
        researchIteration: 8,
        now: '2026-09-13T23:02:00.000Z',
      },
    )

  persistGovernedEvolutionMissionState(
    repositoryDir,
    waiting,
  )

  const blocked =
    assessGovernedEvolutionMissionResume(
      repositoryDir,
      waiting.missionId,
    )

  assert.equal(
    blocked.resumeEligible,
    false,
  )
  assert.equal(
    blocked.reason,
    'waiting-human-authorization',
  )

  assert.throws(
    () =>
      assessGovernedEvolutionMissionResume(
        repositoryDir,
        'missing-mission-v2877354',
      ),
    /requires a persisted mission state/,
  )

  console.log({
    architecture:
      'durable-mission-state -> restore -> resume-assessment -> fail-closed -> no-execution',
    missionId: resumable.missionId,
    checkpointSequence:
      resumable.checkpointSequence,
    researchIteration:
      resumable.researchIteration,
    activeResumeEligible:
      resumable.resumeEligible,
    waitingAuthorizationResumeEligible:
      blocked.resumeEligible,
    waitingAuthorizationReason:
      blocked.reason,
    executionApplied:
      resumable.executionApplied,
    productionMutationApplied:
      resumable.productionMutationApplied,
    selfPromotionApplied:
      resumable.selfPromotionApplied,
    humanAuthorizationRequired:
      resumable.humanAuthorizationRequired,
  })

  console.log(
    'Runtime governed evolution mission resume foundation proof passed.',
  )
} finally {
  rmSync(repositoryDir, {
    recursive: true,
    force: true,
  })
}
