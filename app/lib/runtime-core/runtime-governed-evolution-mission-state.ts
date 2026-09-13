import {
  createHash,
  randomUUID,
} from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

export type GovernedEvolutionMissionStatus =
  | 'active'
  | 'paused'
  | 'waiting_authorization'
  | 'completed'
  | 'failed'

export type GovernedEvolutionMissionState = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-state'

  missionId: string
  objectiveId: string
  objective: string

  status: GovernedEvolutionMissionStatus

  createdAt: string
  updatedAt: string
  lastCheckpointAt: string

  checkpointSequence: number

  currentTaskId: string | null
  completedTaskIds: string[]
  failedTaskIds: string[]
  blockedTaskIds: string[]

  researchIteration: number
  maximumResearchIterations: number

  networkReadBudget: number
  sandboxExecutionBudget: number

  selfPromotionAllowed: false
  productionMutationAllowed: false
  humanAuthorizationRequired: true
}

export type CreateGovernedEvolutionMissionStateInput = {
  missionId: string
  objectiveId: string
  objective: string
  maximumResearchIterations: number
  networkReadBudget: number
  sandboxExecutionBudget: number
  now?: string
}

export type GovernedEvolutionMissionCheckpointInput = {
  currentTaskId?: string | null
  completedTaskId?: string
  failedTaskId?: string
  blockedTaskId?: string
  researchIteration?: number
  status?: GovernedEvolutionMissionStatus
  now?: string
}

function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `Governed evolution mission state requires non-empty ${field}.`,
    )
  }
}

function assertNonNegativeSafeInteger(
  value: number,
  field: string,
): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `Governed evolution mission state requires non-negative integer ${field}.`,
    )
  }
}

function missionFileName(missionId: string): string {
  return `${createHash('sha256').update(missionId).digest('hex')}.json`
}

function assertGovernedEvolutionMissionState(
  state: GovernedEvolutionMissionState,
): void {
  if (
    state.schemaVersion !== 1 ||
    state.kind !== 'iasevero-governed-evolution-mission-state'
  ) {
    throw new Error(
      'Governed evolution mission state requires canonical schema identity.',
    )
  }

  assertNonEmpty(state.missionId, 'missionId')
  assertNonEmpty(state.objectiveId, 'objectiveId')
  assertNonEmpty(state.objective, 'objective')

  assertNonNegativeSafeInteger(
    state.checkpointSequence,
    'checkpointSequence',
  )
  assertNonNegativeSafeInteger(
    state.researchIteration,
    'researchIteration',
  )
  assertNonNegativeSafeInteger(
    state.maximumResearchIterations,
    'maximumResearchIterations',
  )
  assertNonNegativeSafeInteger(
    state.networkReadBudget,
    'networkReadBudget',
  )
  assertNonNegativeSafeInteger(
    state.sandboxExecutionBudget,
    'sandboxExecutionBudget',
  )

  if (
    state.researchIteration >
    state.maximumResearchIterations
  ) {
    throw new Error(
      'Governed evolution mission state research iteration exceeds its governed maximum.',
    )
  }

  if (
    state.selfPromotionAllowed !== false ||
    state.productionMutationAllowed !== false ||
    state.humanAuthorizationRequired !== true
  ) {
    throw new Error(
      'Governed evolution mission state requires zero self-promotion and production mutation authority.',
    )
  }
}

export function createGovernedEvolutionMissionState(
  input: CreateGovernedEvolutionMissionStateInput,
): GovernedEvolutionMissionState {
  assertNonEmpty(input.missionId, 'missionId')
  assertNonEmpty(input.objectiveId, 'objectiveId')
  assertNonEmpty(input.objective, 'objective')

  assertNonNegativeSafeInteger(
    input.maximumResearchIterations,
    'maximumResearchIterations',
  )
  assertNonNegativeSafeInteger(
    input.networkReadBudget,
    'networkReadBudget',
  )
  assertNonNegativeSafeInteger(
    input.sandboxExecutionBudget,
    'sandboxExecutionBudget',
  )

  const now = input.now ?? new Date().toISOString()

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-evolution-mission-state',

    missionId: input.missionId,
    objectiveId: input.objectiveId,
    objective: input.objective,

    status: 'active',

    createdAt: now,
    updatedAt: now,
    lastCheckpointAt: now,

    checkpointSequence: 0,

    currentTaskId: null,
    completedTaskIds: [],
    failedTaskIds: [],
    blockedTaskIds: [],

    researchIteration: 0,
    maximumResearchIterations:
      input.maximumResearchIterations,

    networkReadBudget: input.networkReadBudget,
    sandboxExecutionBudget:
      input.sandboxExecutionBudget,

    selfPromotionAllowed: false,
    productionMutationAllowed: false,
    humanAuthorizationRequired: true,
  }
}

export function checkpointGovernedEvolutionMissionState(
  state: GovernedEvolutionMissionState,
  input: GovernedEvolutionMissionCheckpointInput,
): GovernedEvolutionMissionState {
  assertGovernedEvolutionMissionState(state)

  const researchIteration =
    input.researchIteration ?? state.researchIteration

  assertNonNegativeSafeInteger(
    researchIteration,
    'researchIteration',
  )

  if (
    researchIteration >
    state.maximumResearchIterations
  ) {
    throw new Error(
      'Governed evolution mission checkpoint exceeds maximum research iterations.',
    )
  }

  const now = input.now ?? new Date().toISOString()

  const appendUnique = (
    values: string[],
    value?: string,
  ): string[] =>
    value && !values.includes(value)
      ? [...values, value]
      : [...values]

  const checkpointed: GovernedEvolutionMissionState = {
    ...state,

    status: input.status ?? state.status,

    updatedAt: now,
    lastCheckpointAt: now,

    checkpointSequence:
      state.checkpointSequence + 1,

    currentTaskId:
      input.currentTaskId !== undefined
        ? input.currentTaskId
        : state.currentTaskId,

    completedTaskIds: appendUnique(
      state.completedTaskIds,
      input.completedTaskId,
    ),

    failedTaskIds: appendUnique(
      state.failedTaskIds,
      input.failedTaskId,
    ),

    blockedTaskIds: appendUnique(
      state.blockedTaskIds,
      input.blockedTaskId,
    ),

    researchIteration,

    selfPromotionAllowed: false,
    productionMutationAllowed: false,
    humanAuthorizationRequired: true,
  }

  assertGovernedEvolutionMissionState(checkpointed)

  return checkpointed
}

export function persistGovernedEvolutionMissionState(
  repositoryDir: string,
  state: GovernedEvolutionMissionState,
): string {
  assertGovernedEvolutionMissionState(state)

  mkdirSync(repositoryDir, {
    recursive: true,
  })

  const finalPath = join(
    repositoryDir,
    missionFileName(state.missionId),
  )

  const temporaryPath =
    `${finalPath}.${process.pid}.${randomUUID()}.tmp`

  writeFileSync(
    temporaryPath,
    `${JSON.stringify(state, null, 2)}\n`,
    {
      encoding: 'utf8',
      mode: 0o600,
    },
  )

  renameSync(
    temporaryPath,
    finalPath,
  )

  return finalPath
}

export function loadGovernedEvolutionMissionState(
  repositoryDir: string,
  missionId: string,
): GovernedEvolutionMissionState | null {
  assertNonEmpty(missionId, 'missionId')

  const filePath = join(
    repositoryDir,
    missionFileName(missionId),
  )

  if (!existsSync(filePath)) {
    return null
  }

  const state = JSON.parse(
    readFileSync(filePath, 'utf8'),
  ) as GovernedEvolutionMissionState

  assertGovernedEvolutionMissionState(state)

  if (state.missionId !== missionId) {
    throw new Error(
      'Governed evolution mission persistence requires continuous mission identity.',
    )
  }

  return state
}
