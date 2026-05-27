import {
  evaluateRuntimeDispatchController,
} from '@/app/lib/runtime-dispatch-controller/runtime-dispatch-controller'

export type RuntimeExecutionLane =
  | 'priority-lane'
  | 'adaptive-lane'
  | 'balanced-lane'
  | 'restricted-lane'

export type RuntimeExecutionRoute =
  | 'direct-execution'
  | 'adaptive-execution'
  | 'controlled-execution'
  | 'containment-execution'

export function evaluateRuntimeExecutionRouter() {
  const dispatch =
    evaluateRuntimeDispatchController()

  const executionLane: RuntimeExecutionLane =
    dispatch.dispatchTarget === 'priority-runtime'
      ? 'priority-lane'
      : dispatch.dispatchTarget === 'adaptive-runtime'
      ? 'adaptive-lane'
      : dispatch.dispatchTarget === 'balanced-runtime'
      ? 'balanced-lane'
      : 'restricted-lane'

  const executionRoute: RuntimeExecutionRoute =
    dispatch.dispatchMode === 'execute'
      ? 'direct-execution'
      : dispatch.dispatchMode === 'throttle'
      ? 'adaptive-execution'
      : dispatch.dispatchMode === 'stabilize'
      ? 'controlled-execution'
      : 'containment-execution'

  const routeWindowMs =
    executionLane === 'priority-lane'
      ? 50
      : executionLane === 'adaptive-lane'
      ? 120
      : executionLane === 'balanced-lane'
      ? 250
      : 500

  const executionThroughput =
    executionLane === 'priority-lane'
      ? 100
      : executionLane === 'adaptive-lane'
      ? 80
      : executionLane === 'balanced-lane'
      ? 55
      : 15

  const executionAllowed =
    dispatch.dispatchAllowed &&
    dispatch.runtimeProtected

  const routerStable =
    executionAllowed

  return {
    routerId: `router-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source:
      'runtime-execution-router',

    executionLane,
    executionRoute,

    routeWindowMs,
    executionThroughput,

    executionAllowed,
    routerStable,

    dispatchMode:
      dispatch.dispatchMode,

    dispatchTarget:
      dispatch.dispatchTarget,

    queueUtilization:
      dispatch.queueUtilization,

    consensusRatio:
      dispatch.consensusRatio,

    recommendation:
      executionAllowed
        ? 'Runtime execution routing active.'
        : 'Runtime execution routing blocked.',

    reasoning: [
      `lane:${executionLane}`,
      `route:${executionRoute}`,
      `allowed:${executionAllowed}`,
      `stable:${routerStable}`,
      `window:${routeWindowMs}`,
      `throughput:${executionThroughput}`,
      `dispatch:${dispatch.dispatchMode}`,
      `target:${dispatch.dispatchTarget}`,
      `queue:${dispatch.queueUtilization}`,
      `consensus:${dispatch.consensusRatio}`,
    ],
  }
}
