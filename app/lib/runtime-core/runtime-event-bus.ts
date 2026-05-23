export type RuntimeBusEvent = {
  id: string
  timestamp: string
  source: string
  type: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  payload?: Record<string, unknown>
}

const runtimeEventBus: RuntimeBusEvent[] = []

function createRuntimeEventId(): string {
  return `rbus_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function publishRuntimeEvent(
  event: Omit<RuntimeBusEvent, 'id' | 'timestamp'>
): RuntimeBusEvent {
  const normalizedEvent: RuntimeBusEvent = {
    id: createRuntimeEventId(),
    timestamp: new Date().toISOString(),
    ...event,
  }

  runtimeEventBus.unshift(normalizedEvent)

  if (runtimeEventBus.length > 300) {
    runtimeEventBus.pop()
  }

  return normalizedEvent
}

export function readRuntimeEvents(): RuntimeBusEvent[] {
  return [...runtimeEventBus]
}

export function clearRuntimeEvents(): void {
  runtimeEventBus.length = 0
}
