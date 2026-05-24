import {
  evaluateRuntimeOperationalStateEngine,
} from '@/app/lib/runtime-state-engine/runtime-operational-state-engine'

export type RuntimeTransition =
  | 'maintain'
  | 'throttle'
  | 'stabilize'
  | 'recover'
  | 'contain'

export function evaluateRuntimeTransitionController() {
  const state =
    evaluateRuntimeOperationalStateEngine()

  const transition: RuntimeTransition =
    state.operationalState === 'fully-operational'
      ? 'maintain'
      : state.operationalState === 'throttled-runtime'
        ? 'throttle'
        : state.operationalState === 'stabilization-runtime'
          ? 'stabilize'
          : state.executionAllowed
            ? 'recover'
            : 'contain'

  const nextState =
    transition === 'maintain'
      ? 'fully-operational'
      : transition === 'throttle'
        ? 'adaptive-runtime'
        : transition === 'stabilize'
          ? 'stabilization-runtime'
          : transition === 'recover'
            ? 'adaptive-runtime'
            : 'containment-runtime'

  return {
    transitionId:
      `transition-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-transition-controller',

    currentState:
      state.operationalState,

    transition,

    nextState,

    riskLevel:
      state.riskLevel,

    executionAllowed:
      state.executionAllowed,

    runtimeStable:
      state.runtimeStable,

    recommendation:
      transition === 'maintain'
        ? 'Runtime transition stable.'
        : transition === 'throttle'
          ? 'Runtime throttling transition active.'
          : transition === 'stabilize'
            ? 'Runtime stabilization transition active.'
            : transition === 'recover'
              ? 'Runtime recovery transition active.'
              : 'Runtime containment transition active.',

    reasoning: [
      `current:${state.operationalState}`,
      `transition:${transition}`,
      `next:${nextState}`,
      `risk:${state.riskLevel}`,
      `allowed:${state.executionAllowed}`,
      `stable:${state.runtimeStable}`,
    ],
  }
}
