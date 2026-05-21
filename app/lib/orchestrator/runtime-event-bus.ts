export type RuntimeEvent = {
  id: string
  type:
    | 'runtime-alert'
    | 'runtime-recovery'
    | 'runtime-audit'
    | 'runtime-build'
    | 'runtime-regression'
  payload: Record<string, unknown>
  timestamp?: string
  createdAt?: string
}

const runtimeEventBus: RuntimeEvent[] = []

export function emitRuntimeEvent(
  event: RuntimeEvent
) {
  const normalizedTimestamp =
    event.timestamp ?? event.createdAt ?? new Date().toISOString()

  const normalizedEvent: RuntimeEvent = {
    ...event,
    timestamp: normalizedTimestamp,
    createdAt: event.createdAt ?? normalizedTimestamp,
  }

  runtimeEventBus.unshift(normalizedEvent)

  if (runtimeEventBus.length > 500) {
    runtimeEventBus.pop()
  }
}

export function getRuntimeEvents() {
  return runtimeEventBus
}

export function getRuntimeEventsByType(
  type: RuntimeEvent['type']
) {
  return runtimeEventBus.filter(
    event => event.type === type
  )
}
