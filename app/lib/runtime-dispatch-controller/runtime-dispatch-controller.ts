import {
  evaluateRuntimeExecutionPipeline,
} from '@/app/lib/runtime-execution-pipeline/runtime-execution-pipeline'

export type RuntimeDispatchMode =
  | 'execute'
  | 'throttle'
  | 'stabilize'
  | 'contain'

export type RuntimeDispatchTarget =
  | 'priority-runtime'
  | 'adaptive-runtime'
  | 'balanced-runtime'
  | 'restricted-runtime'

export function evaluateRuntimeDispatchController() {
  const pipeline =
    evaluateRuntimeExecutionPipeline()

  const dispatchMode: RuntimeDispatchMode =
    pipeline.pipelineAction === 'dispatch-runtime'
      ? 'execute'
      : pipeline.pipelineAction === 'controlled-runtime'
      ? 'stabilize'
      : pipeline.pipelineAction === 'throttle-runtime'
      ? 'throttle'
      : 'contain'

  const dispatchTarget: RuntimeDispatchTarget =
    pipeline.executionPriority === 'critical'
      ? 'priority-runtime'
      : pipeline.executionPriority === 'high'
      ? 'adaptive-runtime'
      : pipeline.executionPriority === 'balanced'
      ? 'balanced-runtime'
      : 'restricted-runtime'

  const dispatchAllowed =
    pipeline.runtimeExecutionAllowed &&
    pipeline.pipelineStable

  const dispatchWindowMs =
    dispatchMode === 'execute'
      ? 50
      : dispatchMode === 'throttle'
      ? 120
      : dispatchMode === 'stabilize'
      ? 250
      : 500

  const dispatchIntensity =
    dispatchMode === 'execute'
      ? 100
      : dispatchMode === 'throttle'
      ? 70
      : dispatchMode === 'stabilize'
      ? 45
      : 10

  const runtimeProtected =
    dispatchMode !== 'contain'

  return {
    dispatchId: `dispatch-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source:
      'runtime-dispatch-controller',

    dispatchMode,
    dispatchTarget,

    dispatchAllowed,

    dispatchWindowMs,
    dispatchIntensity,

    runtimeProtected,

    executionPriority:
      pipeline.executionPriority,

    queueUtilization:
      pipeline.queueUtilization,

    consensusRatio:
      pipeline.consensusRatio,

    recommendation:
      dispatchAllowed
        ? 'Runtime dispatch approved.'
        : 'Runtime dispatch blocked.',

    reasoning: [
      `mode:${dispatchMode}`,
      `target:${dispatchTarget}`,
      `allowed:${dispatchAllowed}`,
      `window:${dispatchWindowMs}`,
      `intensity:${dispatchIntensity}`,
      `priority:${pipeline.executionPriority}`,
      `consensus:${pipeline.consensusRatio}`,
      `queue:${pipeline.queueUtilization}`,
      `protected:${runtimeProtected}`,
    ],
  }
}
