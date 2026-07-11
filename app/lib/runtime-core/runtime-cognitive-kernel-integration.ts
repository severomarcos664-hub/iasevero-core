import { buildRuntimeOperationalMemory } from '../orchestrator/runtime-operational-memory'
import { evaluateRuntimeMemoryConsolidation } from '../runtime-memory-consolidation/runtime-memory-consolidation'
import { evaluateRuntimeReflectionFeedback } from '../runtime-reflection-feedback/runtime-reflection-feedback'
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
  reasoning: string[]
}

export function runRuntimeCognitiveKernel(
  input: RuntimeCognitiveKernelInput,
): RuntimeCognitiveKernelReport {
  const message = input.message.trim()
  const userId = input.userId.trim()

  if (!message) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty message.')
  }

  if (!userId) {
    throw new Error('Runtime Cognitive Kernel requires a non-empty userId.')
  }

  const memory = buildRuntimeOperationalMemory()
  const planning = planRuntimeTask(message)
  const authority = evaluateRuntimeExecutiveAuthorityGateway()

  const execution = authority.executionAllowed
    ? runRuntimeExecutionBridge(message, userId)
    : null

  const reflection = evaluateRuntimeReflectionFeedback()
  const consolidation = evaluateRuntimeMemoryConsolidation()

  const completed = authority.executionAllowed && execution !== null

  return {
    kernelId: `runtime-cognitive-kernel-${Date.now()}`,
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
    reasoning: [
      'Runtime operational memory loaded.',
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
