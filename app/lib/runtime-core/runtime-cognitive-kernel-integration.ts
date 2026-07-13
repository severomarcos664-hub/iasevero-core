import {
  persistRuntimeAdaptiveExecutionState,
} from './runtime-adaptive-execution-persistence'

import {
  readLatestRuntimeAdaptiveExecutionStateByExecutionKey,
} from './runtime-adaptive-execution-persistence'

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

import {
  completeRuntimeAdaptiveExecutionStep,
  createRuntimeAdaptiveExecutionState,
  evaluateRuntimeAdaptiveExecution,
} from './runtime-adaptive-execution-enforcement'

import {
  adaptRuntimeTaskPlan,
} from './runtime-adaptive-planning-policy'
export type RuntimeCognitiveKernelInput = {
  message: string
  userId: string
  executionKey?: string
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
    executionEnforcement: {
      initialState: ReturnType<typeof createRuntimeAdaptiveExecutionState>
      preExecutionState: ReturnType<typeof createRuntimeAdaptiveExecutionState>
      preExecutionDecision: ReturnType<typeof evaluateRuntimeAdaptiveExecution>
      finalState: ReturnType<typeof createRuntimeAdaptiveExecutionState>
      finalDecision: ReturnType<typeof evaluateRuntimeAdaptiveExecution>
    }
    executionPersistence: {
      executionKey: string
      source: 'new' | 'recovered'
      taskId: string
    }
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
  const executionKey =
    input.executionKey?.trim() ||
    `${userId}:${message}`

  if (!message) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty message.')
  }

  if (!userId) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty userId.')
  }

  const memory = buildRuntimeOperationalMemory()
  const basePlanning = planRuntimeTask(message, {
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

  const recoveredExecution =
    readLatestRuntimeAdaptiveExecutionStateByExecutionKey(
      executionKey,
    )

  const planning =
    recoveredExecution?.plan ??
    adaptRuntimeTaskPlan(
      basePlanning,
      previousLearningState,
    )
  const authority = evaluateRuntimeExecutiveAuthorityGateway()

  const initialExecutionState =
    recoveredExecution?.state ??
    createRuntimeAdaptiveExecutionState(planning)

  let preExecutionState = initialExecutionState

  persistRuntimeAdaptiveExecutionState(
    planning,
    preExecutionState,
    executionKey,
  )

  for (const step of [...planning.steps].sort(
    (left, right) => left.order - right.order,
  )) {
    if (step.type === 'execution') {
      break
    }

    const decision =
      evaluateRuntimeAdaptiveExecution(
        planning,
        preExecutionState,
      )

    if (
      !decision.executionAllowed ||
      decision.currentStep?.id !== step.id
    ) {
      break
    }

    preExecutionState =
      completeRuntimeAdaptiveExecutionStep(
        planning,
        preExecutionState,
        step.id,
      )
  }

  const preExecutionDecision =
    evaluateRuntimeAdaptiveExecution(
      planning,
      preExecutionState,
    )

  const execution =
    authority.executionAllowed &&
    preExecutionDecision.executionAllowed &&
    preExecutionDecision.currentStep?.type ===
      'execution'
      ? runRuntimeExecutionBridge(message, userId)
      : null

  let finalExecutionState = preExecutionState

  if (
    execution &&
    preExecutionDecision.currentStep
  ) {
    finalExecutionState =
      completeRuntimeAdaptiveExecutionStep(
        planning,
        finalExecutionState,
        preExecutionDecision.currentStep.id,
      )
  }

  const reflection = evaluateRuntimeReflectionFeedback()
  const consolidation = evaluateRuntimeMemoryConsolidation()

  if (execution) {
    for (const step of [...planning.steps].sort(
      (left, right) => left.order - right.order,
    )) {
      const decision =
        evaluateRuntimeAdaptiveExecution(
          planning,
          finalExecutionState,
        )

      if (
        !decision.executionAllowed ||
        decision.currentStep?.id !== step.id
      ) {
        continue
      }

      if (step.type === 'execution') {
        continue
      }

      finalExecutionState =
        completeRuntimeAdaptiveExecutionStep(
          planning,
          finalExecutionState,
          step.id,
        )
    }
  }

  const finalExecutionDecision =
    evaluateRuntimeAdaptiveExecution(
      planning,
      finalExecutionState,
    )

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


  persistRuntimeAdaptiveExecutionState(
    planning,
    finalExecutionState,
    executionKey,
  )

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
      executionEnforcement: {
        initialState: initialExecutionState,
        preExecutionState,
        preExecutionDecision,
        finalState: finalExecutionState,
        finalDecision: finalExecutionDecision,
      },
      executionPersistence: {
        executionKey,
        source: recoveredExecution
          ? 'recovered'
          : 'new',
        taskId: planning.taskId,
      },
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
      `Execution enforcement preReason=${preExecutionDecision.reason}.`,
      `Execution enforcement finalReason=${finalExecutionDecision.reason}.`,
      execution
        ? 'Execution Bridge executed the authorized operation.'
        : 'Execution was blocked before the Execution Bridge.',
      'Runtime reflection feedback evaluated.',
      'Runtime memory consolidation evaluated.',
    ],
  }
}
