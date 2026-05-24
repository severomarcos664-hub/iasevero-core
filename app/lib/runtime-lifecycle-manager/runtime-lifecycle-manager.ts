import {
  evaluateRuntimeTransitionController,
} from '@/app/lib/runtime-transition-controller/runtime-transition-controller'

export type RuntimeLifecyclePhase =
  | 'boot'
  | 'validate'
  | 'operate'
  | 'throttle'
  | 'stabilize'
  | 'recover'
  | 'contain'
  | 'revalidate'

export function evaluateRuntimeLifecycleManager() {
  const transition = evaluateRuntimeTransitionController()

  const lifecyclePhase: RuntimeLifecyclePhase =
    transition.transition === 'maintain'
      ? 'operate'
      : transition.transition === 'throttle'
        ? 'throttle'
        : transition.transition === 'stabilize'
          ? 'stabilize'
          : transition.transition === 'recover'
            ? 'recover'
            : 'contain'

  const lifecycleAction =
    lifecyclePhase === 'operate'
      ? 'continue-runtime-operation'
      : lifecyclePhase === 'throttle'
        ? 'reduce-runtime-throughput'
        : lifecyclePhase === 'stabilize'
          ? 'stabilize-runtime-state'
          : lifecyclePhase === 'recover'
            ? 'execute-runtime-recovery'
            : 'activate-runtime-containment'

  const lifecycleHealthy =
    lifecyclePhase !== 'contain'

  return {
    lifecycleId: `lifecycle-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-lifecycle-manager',

    lifecyclePhase,
    lifecycleAction,
    lifecycleHealthy,

    currentState: transition.currentState,
    transition: transition.transition,
    nextState: transition.nextState,

    riskLevel: transition.riskLevel,
    executionAllowed: transition.executionAllowed,
    runtimeStable: transition.runtimeStable,

    recommendation:
      lifecycleHealthy
        ? 'Runtime lifecycle operating within governed limits.'
        : 'Runtime lifecycle containment required.',

    reasoning: [
      `phase:${lifecyclePhase}`,
      `action:${lifecycleAction}`,
      `healthy:${lifecycleHealthy}`,
      `current:${transition.currentState}`,
      `transition:${transition.transition}`,
      `next:${transition.nextState}`,
      `risk:${transition.riskLevel}`,
      `allowed:${transition.executionAllowed}`,
      `stable:${transition.runtimeStable}`,
    ],
  }
}
