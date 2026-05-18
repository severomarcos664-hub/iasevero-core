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
    return {
      allowed: false,
      reason: enforcement.reason,
      metrics: getQueueMetrics(),
    }
  }

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

  updateTaskStatus(
    task.id,
    'completed',
    'Pipeline executado com sucesso.',
  )

  return {
    allowed: true,
    taskId: task.id,
    reason: 'Runtime pipeline executado.',
    metrics: getQueueMetrics(),
  }
}
