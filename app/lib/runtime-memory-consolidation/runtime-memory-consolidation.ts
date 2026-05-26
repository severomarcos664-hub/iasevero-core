import {
  evaluateRuntimeReflectionFeedback,
} from '@/app/lib/runtime-reflection-feedback/runtime-reflection-feedback'

export type RuntimeMemoryState =
  | 'consolidating'
  | 'stable'
  | 'restricted'

export interface RuntimeMemoryConsolidationReport {
  memoryId: string
  createdAt: string
  source: 'runtime-memory-consolidation'

  memoryState: RuntimeMemoryState

  reflectionState: string
  integrationState: string

  executionAllowed: boolean
  pipelineStable: boolean

  adaptationScore: number
  memoryStrength: number

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeMemoryConsolidation():
RuntimeMemoryConsolidationReport {
  const reflection =
    evaluateRuntimeReflectionFeedback()

  const memoryStrength =
    reflection.adaptationScore >= 90 &&
    reflection.pipelineStable
      ? 96
      : reflection.pipelineStable
        ? 75
        : 40

  const memoryState: RuntimeMemoryState =
    !reflection.executionAllowed
      ? 'restricted'
      : memoryStrength >= 90
        ? 'consolidating'
        : 'stable'

  return {
    memoryId: `memory-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-memory-consolidation',

    memoryState,

    reflectionState:
      reflection.reflectionState,

    integrationState:
      reflection.integrationState,

    executionAllowed:
      reflection.executionAllowed,

    pipelineStable:
      reflection.pipelineStable,

    adaptationScore:
      reflection.adaptationScore,

    memoryStrength,

    queueUtilization:
      reflection.queueUtilization,

    consensusRatio:
      reflection.consensusRatio,

    recommendation:
      reflection.executionAllowed
        ? 'Runtime memory consolidation active.'
        : 'Runtime memory consolidation restricted.',

    reasoning: [
      `memory:${memoryState}`,
      `reflection:${reflection.reflectionState}`,
      `integration:${reflection.integrationState}`,
      `allowed:${reflection.executionAllowed}`,
      `stable:${reflection.pipelineStable}`,
      `adaptation:${reflection.adaptationScore}`,
      `memoryStrength:${memoryStrength}`,
      `queue:${reflection.queueUtilization}`,
      `consensus:${reflection.consensusRatio}`,
    ],
  }
}
