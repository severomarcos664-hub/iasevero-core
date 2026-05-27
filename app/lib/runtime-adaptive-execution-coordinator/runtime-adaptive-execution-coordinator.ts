import {
  evaluateRuntimeExecutiveGovernor,
} from '../runtime-executive-governor/runtime-executive-governor'

export type RuntimeExecutionPriority =
  | 'critical'
  | 'high'
  | 'balanced'
  | 'restricted'

export type RuntimeExecutionRoute =
  | 'protection'
  | 'stabilization'
  | 'adaptive-growth'
  | 'observation'

export interface RuntimeAdaptiveExecutionCoordinatorReport {
  coordinatorId: string
  createdAt: string
  source: 'runtime-adaptive-execution-coordinator'

  executionPriority: RuntimeExecutionPriority
  executionRoute: RuntimeExecutionRoute

  executionAllowed: boolean
  executionIntensity: number

  runtimePressure: number
  runtimeStability: number
  cognitiveCoherence: number
  adaptationScore: number

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeAdaptiveExecutionCoordinator():
RuntimeAdaptiveExecutionCoordinatorReport {

  const governor =
    evaluateRuntimeExecutiveGovernor()

  const executionPriority: RuntimeExecutionPriority =
    !governor.executionAllowed
      ? 'restricted'
      : governor.runtimePressure >= 90
      ? 'critical'
      : governor.cognitiveCoherence >= 95
      ? 'high'
      : 'balanced'

  const executionRoute: RuntimeExecutionRoute =
    executionPriority === 'critical'
      ? 'protection'
      : governor.runtimeStability < 80
      ? 'stabilization'
      : governor.executiveDecision === 'expand'
      ? 'adaptive-growth'
      : 'observation'

  return {
    coordinatorId: `adaptive-execution-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-adaptive-execution-coordinator',

    executionPriority,
    executionRoute,

    executionAllowed:
      governor.executionAllowed,

    executionIntensity:
      governor.executionIntensity,

    runtimePressure:
      governor.runtimePressure,

    runtimeStability:
      governor.runtimeStability,

    cognitiveCoherence:
      governor.cognitiveCoherence,

    adaptationScore:
      governor.adaptationScore,

    recommendation:
      governor.executionAllowed
        ? 'Runtime adaptive execution coordination active.'
        : 'Runtime adaptive execution restricted.',

    reasoning: [
      `priority:${executionPriority}`,
      `route:${executionRoute}`,
      `pressure:${governor.runtimePressure}`,
      `stability:${governor.runtimeStability}`,
      `coherence:${governor.cognitiveCoherence}`,
      `adaptation:${governor.adaptationScore}`,
      `intensity:${governor.executionIntensity}`,
    ],
  }
}
