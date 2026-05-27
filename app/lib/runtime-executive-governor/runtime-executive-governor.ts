import {
  evaluateRuntimeLiveCognitiveLoop,
} from '../runtime-live-cognitive-loop/runtime-live-cognitive-loop'

export type RuntimeExecutiveDecision =
  | 'expand'
  | 'maintain'
  | 'throttle'
  | 'protect'

export interface RuntimeExecutiveGovernorReport {
  governorId: string
  createdAt: string
  source: 'runtime-executive-governor'

  executionAllowed: boolean

  executiveDecision: RuntimeExecutiveDecision
  executionPolicy: string
  runtimeAction: string

  executionIntensity: number
  runtimePressure: number
  runtimeStability: number
  cognitiveCoherence: number
  adaptationScore: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutiveGovernor():
RuntimeExecutiveGovernorReport {

  const loop =
    evaluateRuntimeLiveCognitiveLoop()

  const executiveDecision: RuntimeExecutiveDecision =
    !loop.executionAllowed
      ? 'protect'
      : loop.runtimePressure >= 90
      ? 'throttle'
      : loop.cognitiveCoherence >= 95 &&
        loop.runtimeStability >= 95
      ? 'expand'
      : 'maintain'

  const executionPolicy =
    executiveDecision === 'protect'
      ? 'protection-first'
      : executiveDecision === 'throttle'
      ? 'stability-first'
      : executiveDecision === 'expand'
      ? 'adaptive-growth'
      : 'balanced-operation'

  const runtimeAction =
    executiveDecision === 'protect'
      ? 'activate-runtime-protection'
      : executiveDecision === 'throttle'
      ? 'reduce-execution-pressure'
      : executiveDecision === 'expand'
      ? 'increase-adaptive-throughput'
      : 'maintain-governed-execution'

  return {
    governorId: `governor-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-executive-governor',

    executionAllowed:
      loop.executionAllowed,

    executiveDecision,
    executionPolicy,
    runtimeAction,

    executionIntensity:
      loop.executionIntensity,

    runtimePressure:
      loop.runtimePressure,

    runtimeStability:
      loop.runtimeStability,

    cognitiveCoherence:
      loop.cognitiveCoherence,

    adaptationScore:
      loop.adaptationScore,

    recommendation:
      `Runtime executive governor decision: ${executiveDecision}.`,

    reasoning: [
      `allowed:${loop.executionAllowed}`,
      `decision:${executiveDecision}`,
      `policy:${executionPolicy}`,
      `action:${runtimeAction}`,
      `pressure:${loop.runtimePressure}`,
      `stability:${loop.runtimeStability}`,
      `coherence:${loop.cognitiveCoherence}`,
      `adaptation:${loop.adaptationScore}`,
      `intensity:${loop.executionIntensity}`,
    ],
  }
}
