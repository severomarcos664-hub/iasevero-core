import {
  evaluateRuntimeExecutionArbitrator,
} from '@/app/lib/runtime-execution-arbitrator/runtime-execution-arbitrator'

export type RuntimeQueueState =
  | 'healthy'
  | 'elevated'
  | 'critical'
  | 'overflow'

export type RuntimeQueueAction =
  | 'dispatch'
  | 'buffer'
  | 'throttle'
  | 'contain'

export type RuntimeQueueManagerReport = {
  queueId: string
  createdAt: string
  source: 'runtime-queue-manager'

  queueState: RuntimeQueueState
  queueAction: RuntimeQueueAction

  activeExecutions: number
  queuedExecutions: number
  maxQueueCapacity: number

  queueUtilization: number

  runtimeExecutionAllowed: boolean
  queueStable: boolean

  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeQueueManager():
RuntimeQueueManagerReport {

  const arbitration =
    evaluateRuntimeExecutionArbitrator()

  const activeExecutions =
    arbitration.executionPriority === 'critical'
      ? 12
      : arbitration.executionPriority === 'high'
        ? 8
        : arbitration.executionPriority === 'balanced'
          ? 5
          : 2

  const queuedExecutions =
    arbitration.executionPriority === 'critical'
      ? 80
      : arbitration.executionPriority === 'high'
        ? 45
        : arbitration.executionPriority === 'balanced'
          ? 20
          : 5

  const maxQueueCapacity = 100

  const queueUtilization =
    Math.round(
      (queuedExecutions / maxQueueCapacity) * 100
    )

  const queueState: RuntimeQueueState =
    queueUtilization >= 95
      ? 'overflow'
      : queueUtilization >= 75
        ? 'critical'
        : queueUtilization >= 45
          ? 'elevated'
          : 'healthy'

  const queueAction: RuntimeQueueAction =
    queueState === 'healthy'
      ? 'dispatch'
      : queueState === 'elevated'
        ? 'buffer'
        : queueState === 'critical'
          ? 'throttle'
          : 'contain'

  const queueStable =
    queueState !== 'overflow'

  return {
    queueId:
      `queue-${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    source:
      'runtime-queue-manager',

    queueState,
    queueAction,

    activeExecutions,
    queuedExecutions,
    maxQueueCapacity,

    queueUtilization,

    runtimeExecutionAllowed:
      arbitration.runtimeExecutionAllowed,

    queueStable,

    recommendation:
      queueAction === 'dispatch'
        ? 'Runtime queue dispatch operating normally.'
        : queueAction === 'buffer'
          ? 'Runtime queue buffering activated.'
          : queueAction === 'throttle'
            ? 'Runtime queue throttling activated.'
            : 'Runtime queue containment activated.',

    reasoning: [
      `state:${queueState}`,
      `action:${queueAction}`,
      `active:${activeExecutions}`,
      `queued:${queuedExecutions}`,
      `capacity:${maxQueueCapacity}`,
      `utilization:${queueUtilization}`,
      `stable:${queueStable}`,
    ],
  }
}
