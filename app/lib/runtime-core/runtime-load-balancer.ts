import {
  enqueueRuntimeAction,
  readRuntimeQueue,
  RuntimeQueuePriority,
} from './runtime-queue-manager'

export type RuntimeExecutionLane =
  | 'critical-lane'
  | 'recovery-lane'
  | 'stabilization-lane'
  | 'background-lane'

export type RuntimeLoadBalanceResult = {
  generatedAt: string
  source: 'runtime-load-balancer'
  lane: RuntimeExecutionLane
  action: string
  priority: RuntimeQueuePriority
  queuedItems: number
  recommendation: string
  reasoning: string[]
}

export function balanceRuntimeLoad(
  action: string,
  priority: RuntimeQueuePriority
): RuntimeLoadBalanceResult {

  const lane: RuntimeExecutionLane =
    priority === 'critical'
      ? 'critical-lane'
      : priority === 'high'
        ? action.includes('recover')
          ? 'recovery-lane'
          : 'stabilization-lane'
        : 'background-lane'

  enqueueRuntimeAction(action, priority)

  const queue = readRuntimeQueue()

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-load-balancer',
    lane,
    action,
    priority,
    queuedItems: queue.length,
    recommendation:
      lane === 'critical-lane'
        ? 'Enviar para lane crítica imediatamente.'
        : lane === 'recovery-lane'
          ? 'Enviar para lane de recuperação.'
          : lane === 'stabilization-lane'
            ? 'Enviar para lane de estabilização.'
            : 'Enviar para lane de background.',
    reasoning: [
      `lane:${lane}`,
      `action:${action}`,
      `priority:${priority}`,
      `queued:${queue.length}`,
    ],
  }
}
