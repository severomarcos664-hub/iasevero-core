export type RuntimeTaskPriority = 'low' | 'medium' | 'high'
export type RuntimeTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'blocked'

export type RuntimeTask = {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  priority: RuntimeTaskPriority
  status: RuntimeTaskStatus
  attempts: number
  maxAttempts: number
  reason?: string
  metadata?: Record<string, unknown>
}

const queue: RuntimeTask[] = []

const priorityLevel: Record<RuntimeTaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

function sortQueue() {
  queue.sort((a, b) => {
    const priorityDiff = priorityLevel[b.priority] - priorityLevel[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return a.createdAt.localeCompare(b.createdAt)
  })
}

export function addTask(task: Omit<RuntimeTask, 'updatedAt' | 'status' | 'attempts' | 'maxAttempts'> & {
  status?: RuntimeTaskStatus
  attempts?: number
  maxAttempts?: number
}) {
  const now = new Date().toISOString()

  const normalizedTask: RuntimeTask = {
    ...task,
    updatedAt: now,
    status: task.status ?? 'queued',
    attempts: task.attempts ?? 0,
    maxAttempts: task.maxAttempts ?? 3,
  }

  queue.push(normalizedTask)
  sortQueue()

  return normalizedTask
}

export function getQueue() {
  return [...queue]
}

export function getQueueMetrics() {
  return {
    total: queue.length,
    queued: queue.filter((task) => task.status === 'queued').length,
    running: queue.filter((task) => task.status === 'running').length,
    completed: queue.filter((task) => task.status === 'completed').length,
    failed: queue.filter((task) => task.status === 'failed').length,
    blocked: queue.filter((task) => task.status === 'blocked').length,
  }
}

export function getNextQueuedTask() {
  sortQueue()
  return queue.find((task) => task.status === 'queued') ?? null
}

export function updateTaskStatus(
  id: string,
  status: RuntimeTaskStatus,
  reason?: string,
) {
  const task = queue.find((item) => item.id === id)

  if (!task) {
    return null
  }

  task.status = status
  task.updatedAt = new Date().toISOString()

  if (reason) {
    task.reason = reason
  }

  return task
}

export function markTaskRunning(id: string) {
  const task = queue.find((item) => item.id === id)

  if (!task) {
    return null
  }

  task.attempts += 1

  return updateTaskStatus(id, 'running')
}

export function clearQueue() {
  queue.length = 0
}
