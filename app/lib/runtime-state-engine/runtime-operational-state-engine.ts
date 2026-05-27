import {
  evaluateRuntimeAdaptiveDecisionLayer,
} from '@/app/lib/runtime-adaptive-decision/runtime-adaptive-decision-layer'

export type RuntimeOperationalState =
  | 'fully-operational'
  | 'adaptive-runtime'
  | 'stabilization-runtime'
  | 'throttled-runtime'
  | 'containment-runtime'

export function evaluateRuntimeOperationalStateEngine() {
  const adaptive =
    evaluateRuntimeAdaptiveDecisionLayer()

  const operationalState: RuntimeOperationalState =
    adaptive.coordinationMode === 'normal'
      ? 'fully-operational'
      : adaptive.coordinationMode === 'stabilize'
        ? 'stabilization-runtime'
        : adaptive.coordinationMode === 'throttle'
          ? 'throttled-runtime'
          : 'containment-runtime'

  const riskLevel =
    operationalState === 'fully-operational'
      ? 'low'
      : operationalState === 'stabilization-runtime'
        ? 'medium'
        : operationalState === 'throttled-runtime'
          ? 'elevated'
          : 'critical'

  const executionAllowed =
    operationalState !== 'containment-runtime'

  return {
    stateId: `runtime-state-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source:
      'runtime-operational-state-engine',

    operationalState,
    riskLevel,

    executionAllowed,

    governanceScore:
      adaptive.governanceScore,

    orchestrationIntensity:
      adaptive.orchestrationIntensity,

    autonomyLevel:
      adaptive.autonomyLevel,

    runtimeStable:
      adaptive.runtimeStable,

    recommendation:
      executionAllowed
        ? 'Runtime operational state validated.'
        : 'Runtime execution containment enabled.',

    reasoning: [
      `state:${operationalState}`,
      `risk:${riskLevel}`,
      `allowed:${executionAllowed}`,
      `governance:${adaptive.governanceScore}`,
      `intensity:${adaptive.orchestrationIntensity}`,
      `stable:${adaptive.runtimeStable}`,
    ],
  }
}
