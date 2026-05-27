import {
  evaluateRuntimeExecutionScheduler,
} from '@/app/lib/runtime-execution-scheduler/runtime-execution-scheduler'

export type RuntimeExecutionTarget =
  | 'priority-runtime'
  | 'adaptive-runtime'
  | 'balanced-runtime'
  | 'restricted-runtime'

export type RuntimeExecutionAction =
  | 'execute'
  | 'queue'
  | 'throttle'
  | 'contain'

export type RuntimeExecutionPriority =
  | 'critical'
  | 'high'
  | 'balanced'
  | 'low'

export type RuntimeExecutionArbitrationReport = {
  arbitrationId: string
  createdAt: string
  source: 'runtime-execution-arbitrator'

  executionTarget: RuntimeExecutionTarget
  executionAction: RuntimeExecutionAction
  executionPriority: RuntimeExecutionPriority

  queuePosition: number
  executionWindowMs: number

  runtimeExecutionAllowed: boolean
  arbitrationStable: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutionArbitrator():
RuntimeExecutionArbitrationReport {

  const scheduler =
    evaluateRuntimeExecutionScheduler()

  const executionPriority =
    scheduler.executionPriority

  const executionAction: RuntimeExecutionAction =
    !scheduler.runtimeExecutionAllowed
      ? 'contain'
      : executionPriority === 'critical'
        ? 'execute'
        : executionPriority === 'high'
          ? 'queue'
          : executionPriority === 'balanced'
            ? 'throttle'
            : 'contain'

  const executionTarget: RuntimeExecutionTarget =
    executionPriority === 'critical'
      ? 'priority-runtime'
      : executionPriority === 'high'
        ? 'adaptive-runtime'
        : executionPriority === 'balanced'
          ? 'balanced-runtime'
          : 'restricted-runtime'

  const queuePosition =
    executionPriority === 'critical'
      ? 1
      : executionPriority === 'high'
        ? 3
        : executionPriority === 'balanced'
          ? 6
          : 10

  const arbitrationStable =
    scheduler.schedulerStable

  return {
    arbitrationId: `arbitrator-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-execution-arbitrator',

    executionTarget,
    executionAction,
    executionPriority,

    queuePosition,

    executionWindowMs:
      scheduler.executionWindowMs,

    runtimeExecutionAllowed:
      scheduler.runtimeExecutionAllowed,

    arbitrationStable,

    recommendation:
      executionAction === 'execute'
        ? 'Runtime arbitration approved for execution.'
        : executionAction === 'queue'
          ? 'Runtime queued for controlled execution.'
          : executionAction === 'throttle'
            ? 'Runtime throttling arbitration active.'
            : 'Runtime containment arbitration active.',

    reasoning: [
      `priority:${executionPriority}`,
      `action:${executionAction}`,
      `target:${executionTarget}`,
      `queue:${queuePosition}`,
      `window:${scheduler.executionWindowMs}`,
      `throughput:${scheduler.executionThroughput}`,
      `stable:${arbitrationStable}`,
    ],
  }
}
