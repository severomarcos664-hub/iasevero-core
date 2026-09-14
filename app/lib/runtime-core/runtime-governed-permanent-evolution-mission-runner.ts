import type {
  CognitiveLoopAdapters,
  CognitiveLoopReport,
  CognitiveObjective,
} from './runtime-governed-cognitive-loop'
import {
  runGovernedCognitiveLoop,
} from './runtime-governed-cognitive-loop'

import type {
  RuntimeSelfDevelopmentInput,
  RuntimeSelfDevelopmentReport,
} from './runtime-governed-self-development'
import {
  runGovernedSelfDevelopmentCycle,
} from './runtime-governed-self-development'

import type {
  GovernedEvolutionMissionState,
} from './runtime-governed-evolution-mission-state'
import {
  checkpointGovernedEvolutionMissionState,
  loadGovernedEvolutionMissionState,
  persistGovernedEvolutionMissionState,
} from './runtime-governed-evolution-mission-state'

import {
  assessGovernedEvolutionMissionResume,
} from './runtime-governed-evolution-mission-resume'

import type {
  GovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease'
import {
  readGovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease'

import {
  renewGovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease-renewal'

export type GovernedPermanentEvolutionMissionRunnerInput = {
  repositoryDir: string
  missionId: string

  lease: GovernedEvolutionMissionLease
  leaseDurationMs: number

  objective: CognitiveObjective
  cognitiveAdapters: CognitiveLoopAdapters
  selfDevelopmentInput: RuntimeSelfDevelopmentInput

  now?: string
}

export type GovernedPermanentEvolutionMissionRunnerResult = {
  schemaVersion: 1
  kind: 'iasevero-governed-permanent-evolution-mission-runner-result'

  missionId: string
  runnerId: string
  leaseId: string

  previousCheckpointSequence: number
  checkpointSequence: number

  previousResearchIteration: number
  researchIteration: number

  cognitiveCycleCompleted: true
  selfDevelopmentAssessmentCompleted: true
  checkpointApplied: true
  missionStatePersisted: true
  leaseRenewalApplied: true

  nextState:
    | 'continue'
    | 'waiting_authorization'
    | 'completed'

  cognitiveReport: CognitiveLoopReport
  selfDevelopmentReport: RuntimeSelfDevelopmentReport
  missionState: GovernedEvolutionMissionState

  executionAuthorityGranted: false
  networkAuthorityGranted: false
  sandboxAuthorityGranted: false
  productionMutationAllowed: false
  selfPromotionAllowed: false
}

function assertLeaseAuthorityIsZero(
  lease: GovernedEvolutionMissionLease,
): void {
  if (
    lease.executionAuthorized !== false ||
    lease.networkAuthorityGranted !== false ||
    lease.sandboxAuthorityGranted !== false ||
    lease.productionMutationAllowed !== false ||
    lease.selfPromotionAllowed !== false
  ) {
    throw new Error(
      'Governed permanent evolution mission runner requires zero inherited operational authority.',
    )
  }
}

export async function runGovernedPermanentEvolutionMissionIteration(
  input: GovernedPermanentEvolutionMissionRunnerInput,
): Promise<GovernedPermanentEvolutionMissionRunnerResult> {
  const missionState =
    loadGovernedEvolutionMissionState(
      input.repositoryDir,
      input.missionId,
    )

  if (!missionState) {
    throw new Error(
      'Governed permanent evolution mission runner requires a persisted mission state.',
    )
  }

  const resume =
    assessGovernedEvolutionMissionResume(
      input.repositoryDir,
      input.missionId,
    )

  if (!resume.resumeEligible) {
    throw new Error(
      `Governed permanent evolution mission runner cannot resume mission: ${resume.reason}`,
    )
  }

  if (
    input.lease.missionId !== input.missionId ||
    input.lease.runnerId.trim().length === 0 ||
    input.lease.leaseId.trim().length === 0 ||
    !Number.isSafeInteger(input.lease.leaseSequence) ||
    input.lease.leaseSequence <= 0
  ) {
    throw new Error(
      'Governed permanent evolution mission runner requires a valid continuous lease identity.',
    )
  }

  assertLeaseAuthorityIsZero(input.lease)

  const persistedLease =
    readGovernedEvolutionMissionLease(
      input.repositoryDir,
      input.missionId,
    )

  if (
    !persistedLease ||
    persistedLease.leaseId !== input.lease.leaseId ||
    persistedLease.runnerId !== input.lease.runnerId ||
    persistedLease.leaseSequence !== input.lease.leaseSequence
  ) {
    throw new Error(
      'Governed permanent evolution mission runner requires the current canonical persisted lease.',
    )
  }

  assertLeaseAuthorityIsZero(persistedLease)

  const cognitiveReport =
    await runGovernedCognitiveLoop(
      input.objective,
      input.cognitiveAdapters,
    )

  const selfDevelopmentReport =
    runGovernedSelfDevelopmentCycle(
      input.selfDevelopmentInput,
    )

  const previousResearchIteration =
    resume.researchIteration

  const nextResearchIteration =
    previousResearchIteration + 1

  const waitingAuthorization =
    selfDevelopmentReport.proposal !== null

  const completed =
    nextResearchIteration >=
    resume.maximumResearchIterations

  const nextState =
    completed
      ? 'completed'
      : waitingAuthorization
        ? 'waiting_authorization'
        : 'continue'

  const checkpointed =
    checkpointGovernedEvolutionMissionState(
      missionState,
      {
        researchIteration: nextResearchIteration,
        status:
          nextState === 'completed'
            ? 'completed'
            : nextState === 'waiting_authorization'
              ? 'waiting_authorization'
              : 'active',
        now: input.now,
      },
    )

  persistGovernedEvolutionMissionState(
    input.repositoryDir,
    checkpointed,
  )

  renewGovernedEvolutionMissionLease(
    input.repositoryDir,
    {
      missionId: input.missionId,
      runnerId: input.lease.runnerId,
      leaseId: input.lease.leaseId,
      expectedLeaseSequence:
        input.lease.leaseSequence,
      leaseDurationMs: input.leaseDurationMs,
      now: input.now,
    },
  )

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-permanent-evolution-mission-runner-result',

    missionId: input.missionId,
    runnerId: input.lease.runnerId,
    leaseId: input.lease.leaseId,

    previousCheckpointSequence:
      resume.checkpointSequence,
    checkpointSequence:
      checkpointed.checkpointSequence,

    previousResearchIteration,
    researchIteration:
      checkpointed.researchIteration,

    cognitiveCycleCompleted: true,
    selfDevelopmentAssessmentCompleted: true,
    checkpointApplied: true,
    missionStatePersisted: true,
    leaseRenewalApplied: true,

    nextState,

    cognitiveReport,
    selfDevelopmentReport,
    missionState: checkpointed,

    executionAuthorityGranted: false,
    networkAuthorityGranted: false,
    sandboxAuthorityGranted: false,
    productionMutationAllowed: false,
    selfPromotionAllowed: false,
  }
}
