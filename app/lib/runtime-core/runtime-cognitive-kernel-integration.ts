import { buildRuntimeOperationalMemory } from '../orchestrator/runtime-operational-memory'
import { evaluateRuntimeMemoryConsolidation } from '../runtime-memory-consolidation/runtime-memory-consolidation'
import { evaluateRuntimeReflectionFeedback } from '../runtime-reflection-feedback/runtime-reflection-feedback'
import {
  readRuntimeCognitiveLearningState,
  updateRuntimeCognitiveLearningState,
} from '../runtime-cognitive-learning/runtime-cognitive-learning-state'
import { evaluateRuntimeExecutiveAuthorityGateway } from '../runtime-executive-authority-gateway/runtime-executive-authority-gateway'
import { planRuntimeTask } from './runtime-task-planner'
import { runRuntimeExecutionBridge } from './runtime-execution-bridge'

export type RuntimeCognitiveKernelInput = {
  message: string
  userId: string
}

export type RuntimeCognitiveKernelReport = {
  kernelId: string
  createdAt: string
  source: 'runtime-cognitive-kernel-integration'
  completed: boolean
  executionAllowed: boolean
  stopReason: 'completed' | 'blocked-by-authority'
  stages: {
    memory: ReturnType<typeof buildRuntimeOperationalMemory>
    planning: ReturnType<typeof planRuntimeTask>
    authority: ReturnType<typeof evaluateRuntimeExecutiveAuthorityGateway>
    execution: ReturnType<typeof runRuntimeExecutionBridge> | null
    reflection: ReturnType<typeof evaluateRuntimeReflectionFeedback>
    consolidation: ReturnType<typeof evaluateRuntimeMemoryConsolidation>
  }
  learning: {
    previous: ReturnType<typeof readRuntimeCognitiveLearningState>
    current: ReturnType<typeof updateRuntimeCognitiveLearningState>
  }
  reasoning: string[]
}

export function runRuntimeCognitiveKernel(
  input: RuntimeCognitiveKernelInput,
): RuntimeCognitiveKernelReport {
  const previousLearningState = readRuntimeCognitiveLearningState()

  const message = input.message.trim()
  const userId = input.userId.trim()

  if (!message) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty message.')
  }

  if (!userId) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty userId.')
  }

  const memory = buildRuntimeOperationalMemory()
  const planning = planRuntimeTask(message, {
    cycleCount: previousLearningState.cycleCount,
    lastExecutionAllowed:
      previousLearningState.lastExecutionAllowed,
    lastRecommendation:
      previousLearningState.lastRecommendation,
    lastReflectionState:
      previousLearningState.lastReflectionState,
    lastConsensusRatio:
      previousLearningState.lastConsensusRatio,
  })
  const authority = evaluateRuntimeExecutiveAuthorityGateway()

  const execution = authority.executionAllowed
    ? runRuntimeExecutionBridge(message, userId)
    : null

  const reflection = evaluateRuntimeReflectionFeedback()
  const consolidation = evaluateRuntimeMemoryConsolidation()

  const completed = authority.executionAllowed && execution !== null

  const kernelId = `runtime-cognitive-kernel-${Date.now()}`

  const currentLearningState = updateRuntimeCognitiveLearningState({
    lastKernelId: kernelId,
    lastCorrelationId:
      execution?.correlationId ?? kernelId,
    lastExecutionAllowed: authority.executionAllowed,
    lastStopReason: authority.executionAllowed
      ? 'completed'
      : 'blocked-by-authority',
    lastRecommendation: reflection.recommendation,
    lastReflectionState: reflection.reflectionState,
    lastConsensusRatio: reflection.consensusRatio,
  })


  return {
    kernelId,
    createdAt: new Date().toISOString(),
    source: 'runtime-cognitive-kernel-integration',
    completed,
    executionAllowed: authority.executionAllowed,
    stopReason: completed ? 'completed' : 'blocked-by-authority',
    stages: {
      memory,
      planning,
      authority,
      execution,
      reflection,
      consolidation,
    },
    learning: {
      previous: previousLearningState,
      current: currentLearningState,
    },
    reasoning: [
      'Runtime operational memory loaded.',
      `Previous learning cycles:${previousLearningState.cycleCount}.`,
      'Runtime task planning completed.',
      `Executive authority executionAllowed=${authority.executionAllowed}.`,
      execution
        ? 'Execution Bridge executed the authorized operation.'
        : 'Execution was blocked before the Execution Bridge.',
      'Runtime reflection feedback evaluated.',
      'Runtime memory consolidation evaluated.',
    ],
  }
}
