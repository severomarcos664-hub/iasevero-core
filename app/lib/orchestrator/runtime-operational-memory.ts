export type RuntimeMemoryEvent = {
  id: string
  type:
    | 'build'
    | 'regression'
    | 'recovery'
    | 'incident'
    | 'audit'
    | 'runtime'
  severity:
    | 'low'
    | 'medium'
    | 'high'
    | 'critical'
  message: string
  createdAt: string
}

const runtimeOperationalMemory: RuntimeMemoryEvent[] = []

export function registerRuntimeMemoryEvent(
  event: RuntimeMemoryEvent
) {
  runtimeOperationalMemory.unshift(event)

  if (runtimeOperationalMemory.length > 200) {
    runtimeOperationalMemory.pop()
  }
}

export function getRuntimeOperationalMemory() {
  return runtimeOperationalMemory
}

export function getCriticalRuntimeEvents() {
  return runtimeOperationalMemory.filter(
    event =>
      event.severity === 'critical'
  )
}
