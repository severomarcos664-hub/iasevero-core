import {
  evaluateRuntimeCognitiveStateFabric,
} from '@/app/lib/runtime-cognitive-state-fabric/runtime-cognitive-state-fabric'

export type RuntimeExecutionMode =
  | 'adaptive'
  | 'stabilizing'
  | 'containment'

export interface RuntimeCausalInfluenceReport {
  influenceId: string
  createdAt: string
  source: 'runtime-causal-influence-engine'

  executionMode: RuntimeExecutionMode
  schedulerPriority: string
  throughputMode: string

  executionIntensity: number
  runtimePressure: number
  runtimeStability: number

  adaptationScore: number
  cognitiveCoherence: number

  executionAllowed: boolean
  pipelineStable: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeCausalInfluence():
RuntimeCausalInfluenceReport {

  const fabric =
    evaluateRuntimeCognitiveStateFabric()

  const runtimePressure =
    fabric.queueUtilization >= 85
      ? 92
      : fabric.queueUtilization >= 70
        ? 74
        : 48

  const runtimeStability =
    fabric.cognitiveCoherence >= 95 &&
    fabric.pipelineStable
      ? 98
      : 76

  const executionMode: RuntimeExecutionMode =
    !fabric.executionAllowed
      ? 'containment'
      : runtimePressure >= 90
        ? 'stabilizing'
        : 'adaptive'

  const schedulerPriority =
    executionMode === 'containment'
      ? 'critical-protection'
      : executionMode === 'stabilizing'
        ? 'stability-first'
        : 'adaptive-throughput'

  const throughputMode =
    executionMode === 'containment'
      ? 'restricted'
      : executionMode === 'stabilizing'
        ? 'regulated'
        : 'dynamic'

  const executionIntensity =
    executionMode === 'containment'
      ? 30
      : executionMode === 'stabilizing'
        ? 68
        : 96

  return {
    influenceId: `influence-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-causal-influence-engine',

    executionMode,
    schedulerPriority,
    throughputMode,

    executionIntensity,
    runtimePressure,
    runtimeStability,

    adaptationScore:
      fabric.adaptationScore,

    cognitiveCoherence:
      fabric.cognitiveCoherence,

    executionAllowed:
      fabric.executionAllowed,

    pipelineStable:
      fabric.pipelineStable,

    recommendation:
      executionMode === 'containment'
        ? 'Runtime containment active.'
        : executionMode === 'stabilizing'
          ? 'Runtime stabilizing execution pressure.'
          : 'Runtime adaptive execution active.',

    reasoning: [
      `mode:${executionMode}`,
      `priority:${schedulerPriority}`,
      `throughput:${throughputMode}`,
      `pressure:${runtimePressure}`,
      `stability:${runtimeStability}`,
      `coherence:${fabric.cognitiveCoherence}`,
      `adaptation:${fabric.adaptationScore}`,
      `intensity:${executionIntensity}`,
    ],
  }
}
