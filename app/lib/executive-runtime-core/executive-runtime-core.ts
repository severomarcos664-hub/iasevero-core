import {
  evaluateRuntimeExecutiveGovernor,
} from '../runtime-executive-governor/runtime-executive-governor'

import {
  evaluateRuntimeAdaptiveExecutionCoordinator,
} from '../runtime-adaptive-execution-coordinator/runtime-adaptive-execution-coordinator'

export type ExecutiveRuntimeCoreState =
  | 'expanding'
  | 'balanced'
  | 'stabilizing'
  | 'protected'

export interface ExecutiveRuntimeCoreReport {
  coreId: string
  createdAt: string
  source: 'executive-runtime-core'

  coreState: ExecutiveRuntimeCoreState
  authority: 'central-executive-runtime-core'

  executionAllowed: boolean
  executiveDecision: string
  executionPolicy: string
  runtimeAction: string
  executionPriority: string
  executionRoute: string

  executionIntensity: number
  runtimePressure: number
  runtimeStability: number
  cognitiveCoherence: number
  adaptationScore: number

  recommendation: string
  reasoning: string[]
}

export function evaluateExecutiveRuntimeCore():
ExecutiveRuntimeCoreReport {
  const governor =
    evaluateRuntimeExecutiveGovernor()

  const coordinator =
    evaluateRuntimeAdaptiveExecutionCoordinator()

  const coreState: ExecutiveRuntimeCoreState =
    !governor.executionAllowed
      ? 'protected'
      : governor.runtimePressure >= 90
      ? 'stabilizing'
      : governor.executiveDecision === 'expand' &&
        coordinator.executionPriority === 'high'
      ? 'expanding'
      : 'balanced'

  return {
    coreId: `executive-core-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'executive-runtime-core',

    coreState,
    authority: 'central-executive-runtime-core',

    executionAllowed: governor.executionAllowed,
    executiveDecision: governor.executiveDecision,
    executionPolicy: governor.executionPolicy,
    runtimeAction: governor.runtimeAction,
    executionPriority: coordinator.executionPriority,
    executionRoute: coordinator.executionRoute,

    executionIntensity: governor.executionIntensity,
    runtimePressure: governor.runtimePressure,
    runtimeStability: governor.runtimeStability,
    cognitiveCoherence: governor.cognitiveCoherence,
    adaptationScore: governor.adaptationScore,

    recommendation:
      `Executive Runtime Core active: ${coreState}.`,

    reasoning: [
      `core:${coreState}`,
      `allowed:${governor.executionAllowed}`,
      `decision:${governor.executiveDecision}`,
      `policy:${governor.executionPolicy}`,
      `action:${governor.runtimeAction}`,
      `priority:${coordinator.executionPriority}`,
      `route:${coordinator.executionRoute}`,
      `pressure:${governor.runtimePressure}`,
      `stability:${governor.runtimeStability}`,
      `coherence:${governor.cognitiveCoherence}`,
      `adaptation:${governor.adaptationScore}`,
      `intensity:${governor.executionIntensity}`,
    ],
  }
}
