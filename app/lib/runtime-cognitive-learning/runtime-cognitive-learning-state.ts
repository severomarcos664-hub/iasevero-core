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

let runtimeCognitiveLearningState: RuntimeCognitiveLearningState = {
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

  return readRuntimeCognitiveLearningState()
}

export function resetRuntimeCognitiveLearningState(): RuntimeCognitiveLearningState {
  runtimeCognitiveLearningState = {
    ...initialState,
  }

  return readRuntimeCognitiveLearningState()
}
