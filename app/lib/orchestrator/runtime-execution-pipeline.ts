import { createRuntimeContext, type RuntimeProvider } from './runtime-context'
import { evaluateRuntimePolicy } from './runtime-policy'
import { evaluateRuntimeGovernance } from './runtime-governor'
import { enforceRuntimeExecution } from './runtime-enforcement'
import {
  addTask,
  markTaskRunning,
  updateTaskStatus,
  getQueueMetrics,
} from './queue-governor'

import { emitRuntimeEvent } from './runtime-event-bus'

export type RuntimeExecutionResult = {
  allowed: boolean
  taskId?: string
  reason: string
  metrics: ReturnType<typeof getQueueMetrics>
}

export function executeRuntimePipeline(input: {
  message: string
  requestId?: string
  provider?: RuntimeProvider
}) : RuntimeExecutionResult {

  emitRuntimeEvent({
    id: crypto.randomUUID(),
    type: 'runtime-audit',
    payload: {
      stage: 'pipeline:start',
      requestId: input.requestId,
    },
    createdAt: new Date().toISOString(),
  })

  const context = createRuntimeContext({
    requestId: input.requestId,
    provider: input.provider ?? 'local',
    reason: 'runtime-execution-pipeline',
    stable: true,
    healing: false,
    safeMode: true,
  })

  const policy = evaluateRuntimePolicy(context)

  const governance = evaluateRuntimeGovernance(
    context,
    policy,
  )

  const enforcement = enforceRuntimeExecution(
    context,
    governance,
  )

  if (!enforcement.allowed) {

    emitRuntimeEvent({
      id: crypto.randomUUID(),
      type: 'runtime-audit',
      payload: {
        stage: 'pipeline:failed',
        reason: enforcement.reason,
      },
      createdAt: new Date().toISOString(),
    })

    return {
      allowed: false,
      reason: enforcement.reason,
      metrics: getQueueMetrics(),
    }
  }

  emitRuntimeEvent({
    id: crypto.randomUUID(),
    type: 'runtime-audit',
    payload: {
      stage: 'pipeline:queued',
      requestId: context.requestId,
    },
    createdAt: new Date().toISOString(),
  })

  const task = addTask({
    id: context.requestId,
    type: 'runtime-execution',
    createdAt: new Date().toISOString(),
    priority: 'medium',
    metadata: {
      message: input.message,
    },
  })

  markTaskRunning(task.id)

  emitRuntimeEvent({
    id: crypto.randomUUID(),
    type: 'runtime-audit',
    payload: {
      stage: 'pipeline:executed',
      taskId: task.id,
    },
    createdAt: new Date().toISOString(),
  })

  updateTaskStatus(
    task.id,
    'completed',
    'Pipeline executado com sucesso.',
  )

  emitRuntimeEvent({
    id: crypto.randomUUID(),
    type: 'runtime-audit',
    payload: {
      stage: 'pipeline:completed',
      taskId: task.id,
    },
    createdAt: new Date().toISOString(),
  })

  return {
    allowed: true,
    taskId: task.id,
    reason: 'Runtime pipeline executado.',
    metrics: getQueueMetrics(),
  }
}
