export type RuntimeQueuePriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'

export type RuntimeQueueItem = {
  id: string
  createdAt: string
  action: string
  priority: RuntimeQueuePriority
  expiresAt?: string
}

const runtimeQueue: RuntimeQueueItem[] = []

export function enqueueRuntimeAction(
  action: string,
  priority: RuntimeQueuePriority = 'normal',
  ttlMs?: number,
): RuntimeQueueItem {

  const item: RuntimeQueueItem = {
    id: `rq_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    action,
    priority,
    expiresAt:
      ttlMs
        ? new Date(Date.now() + ttlMs).toISOString()
        : undefined,
  }

  runtimeQueue.push(item)

  runtimeQueue.sort((a, b) => {
    const weight = {
      critical: 4,
      high: 3,
      normal: 2,
      low: 1,
    }

    return weight[b.priority] - weight[a.priority]
  })

  return item
}

export function dequeueRuntimeAction():
RuntimeQueueItem | undefined {

  clearExpiredRuntimeQueue()

  return runtimeQueue.shift()
}

export function readRuntimeQueue():
RuntimeQueueItem[] {

  clearExpiredRuntimeQueue()

  return [...runtimeQueue]
}

export function clearRuntimeQueue(): void {
  runtimeQueue.length = 0
}

export function clearExpiredRuntimeQueue(): void {

  const now = Date.now()

  for (let i = runtimeQueue.length - 1; i >= 0; i--) {

    const item = runtimeQueue[i]

    if (
      item.expiresAt &&
      new Date(item.expiresAt).getTime() < now
    ) {
      runtimeQueue.splice(i, 1)
    }
  }
}
