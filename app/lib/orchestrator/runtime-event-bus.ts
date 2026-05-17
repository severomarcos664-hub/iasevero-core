export type RuntimeEvent = {
  id: string
  type:
    | 'runtime-alert'
    | 'runtime-recovery'
    | 'runtime-audit'
    | 'runtime-build'
    | 'runtime-regression'
  payload: Record<string, unknown>
  createdAt: string
}

const runtimeEventBus: RuntimeEvent[] = []

export function emitRuntimeEvent(
  event: RuntimeEvent
) {
  runtimeEventBus.unshift(event)

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
