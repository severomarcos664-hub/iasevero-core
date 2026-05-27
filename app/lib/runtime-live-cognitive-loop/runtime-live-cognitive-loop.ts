import {
  evaluateRuntimeCognitiveStateFabric,
} from '@/app/lib/runtime-cognitive-state-fabric/runtime-cognitive-state-fabric'

import {
  evaluateRuntimeCausalInfluence,
} from '@/app/lib/runtime-causal-influence-engine/runtime-causal-influence-engine'

export type RuntimeLoopDecision =
  | 'accelerate'
  | 'stabilize'
  | 'contain'
  | 'observe'

export interface RuntimeLiveCognitiveLoopReport {
  loopId: string
  createdAt: string
  source: 'runtime-live-cognitive-loop'

  cognitiveState: string
  executionMode: string

  decision: RuntimeLoopDecision

  executionIntensity: number
  adaptationScore: number

  runtimePressure: number
  runtimeStability: number
  cognitiveCoherence: number

  memoryState: string
  reflectionState: string

  nextAction: string

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeLiveCognitiveLoop():
RuntimeLiveCognitiveLoopReport {

  const fabric =
    evaluateRuntimeCognitiveStateFabric()

  const influence =
    evaluateRuntimeCausalInfluence()

  const decision: RuntimeLoopDecision =
    !influence.executionAllowed
      ? 'contain'
      : influence.runtimePressure >= 90
        ? 'stabilize'
        : influence.cognitiveCoherence >= 95
          ? 'accelerate'
          : 'observe'

  const nextAction =
    decision === 'accelerate'
      ? 'increase-adaptive-execution'
      : decision === 'stabilize'
        ? 'reduce-runtime-pressure'
        : decision === 'contain'
          ? 'activate-runtime-protection'
          : 'observe-runtime-state'

  return {
    loopId: `loop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-live-cognitive-loop',

    cognitiveState:
      fabric.globalState,

    executionMode:
      influence.executionMode,

    decision,

    executionIntensity:
      influence.executionIntensity,

    adaptationScore:
      influence.adaptationScore,

    runtimePressure:
      influence.runtimePressure,

    runtimeStability:
      influence.runtimeStability,

    cognitiveCoherence:
      influence.cognitiveCoherence,

    memoryState:
      fabric.memoryState,

    reflectionState:
      fabric.reflectionState,

    nextAction,

    recommendation:
      `Runtime live loop decision: ${decision}.`,

    reasoning: [
      `decision:${decision}`,
      `next:${nextAction}`,
      `mode:${influence.executionMode}`,
      `pressure:${influence.runtimePressure}`,
      `stability:${influence.runtimeStability}`,
      `coherence:${influence.cognitiveCoherence}`,
      `memory:${fabric.memoryState}`,
      `reflection:${fabric.reflectionState}`,
      `adaptation:${influence.adaptationScore}`,
    ],
  }
}
