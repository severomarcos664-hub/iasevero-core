import {
  buildRuntimePersistenceRecord,
  persistRuntimeRecord,
  readRuntimePersistenceRecords,
} from '../runtime-core/runtime-persistence-fabric'

export type RuntimeCognitiveLearningState = {
  version: 1
  cycleCount: number
  lastKernelId: string | null
  lastCorrelationId: string | null
  lastExecutionAllowed: boolean | null
  lastStopReason: string | null
  lastRecommendation: string | null
  lastReflectionState: string | null
  lastConsensusRatio: number | null
  updatedAt: string | null
}


const LEARNING_PERSISTENCE_CATEGORY = 'runtime-state'

function isRuntimeCognitiveLearningState(
  value: unknown,
): value is RuntimeCognitiveLearningState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as Partial<RuntimeCognitiveLearningState>

  return (
    state.version === 1 &&
    typeof state.cycleCount === 'number' &&
    (state.lastKernelId === null ||
      typeof state.lastKernelId === 'string') &&
    (state.lastCorrelationId === null ||
      typeof state.lastCorrelationId === 'string') &&
    (state.lastExecutionAllowed === null ||
      typeof state.lastExecutionAllowed === 'boolean') &&
    (state.lastStopReason === null ||
      typeof state.lastStopReason === 'string') &&
    (state.lastRecommendation === null ||
      typeof state.lastRecommendation === 'string') &&
    (state.lastReflectionState === null ||
      typeof state.lastReflectionState === 'string') &&
    (state.lastConsensusRatio === null ||
      typeof state.lastConsensusRatio === 'number') &&
    (state.updatedAt === null ||
      typeof state.updatedAt === 'string')
  )
}

function loadPersistedRuntimeCognitiveLearningState():
  | RuntimeCognitiveLearningState
  | null {
  const records = readRuntimePersistenceRecords(
    LEARNING_PERSISTENCE_CATEGORY,
  )
    .filter(
      (record) =>
        record.source === 'runtime-cognitive-learning-state',
    )
    .sort((left, right) => {
      const timestampDifference =
        Date.parse(right.timestamp) - Date.parse(left.timestamp)

      if (timestampDifference !== 0) {
        return timestampDifference
      }

      return right.id.localeCompare(left.id)
    })

  for (const record of records) {
    if (isRuntimeCognitiveLearningState(record.payload)) {
      return {
        ...record.payload,
      }
    }
  }

  return null
}

function persistRuntimeCognitiveLearningState(
  state: RuntimeCognitiveLearningState,
): void {
  const record = buildRuntimePersistenceRecord(
    'runtime-cognitive-learning-state',
    LEARNING_PERSISTENCE_CATEGORY,
    state,
  )

  persistRuntimeRecord(record)
}

const initialState: RuntimeCognitiveLearningState = {
  version: 1,
  cycleCount: 0,
  lastKernelId: null,
  lastCorrelationId: null,
  lastExecutionAllowed: null,
  lastStopReason: null,
  lastRecommendation: null,
  lastReflectionState: null,
  lastConsensusRatio: null,
  updatedAt: null,
}

let runtimeCognitiveLearningState: RuntimeCognitiveLearningState =
  loadPersistedRuntimeCognitiveLearningState() ?? {
    ...initialState,
  }

export function readRuntimeCognitiveLearningState(): RuntimeCognitiveLearningState {
  return {
    ...runtimeCognitiveLearningState,
  }
}

export function updateRuntimeCognitiveLearningState(
  input: Omit<
    RuntimeCognitiveLearningState,
    'version' | 'cycleCount' | 'updatedAt'
  >,
): RuntimeCognitiveLearningState {
  runtimeCognitiveLearningState = {
    version: 1,
    cycleCount: runtimeCognitiveLearningState.cycleCount + 1,
    ...input,
    updatedAt: new Date().toISOString(),
  }

  persistRuntimeCognitiveLearningState(
    runtimeCognitiveLearningState,
  )

  return readRuntimeCognitiveLearningState()
}

export function resetRuntimeCognitiveLearningState(): RuntimeCognitiveLearningState {
  runtimeCognitiveLearningState = {
    ...initialState,
  }

  persistRuntimeCognitiveLearningState(
    runtimeCognitiveLearningState,
  )

  return readRuntimeCognitiveLearningState()
}
