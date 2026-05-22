export type RuntimeTelemetrySeverity =
  | 'debug'
  | 'info'
  | 'warning'
  | 'critical'

export type RuntimeTelemetryEvent = {
  id: string
  timestamp: string
  source: string
  type: string
  severity: RuntimeTelemetrySeverity
  correlationId: string
  message: string
  payload?: Record<string, unknown>
}

const runtimeTelemetryBuffer: RuntimeTelemetryEvent[] = []

function createTelemetryId(): string {
  return `rtel_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function emitRuntimeTelemetry(
  event: Omit<RuntimeTelemetryEvent, 'id' | 'timestamp'>
): RuntimeTelemetryEvent {
  const normalizedEvent: RuntimeTelemetryEvent = {
    id: createTelemetryId(),
    timestamp: new Date().toISOString(),
    ...event,
  }

  runtimeTelemetryBuffer.unshift(normalizedEvent)

  if (runtimeTelemetryBuffer.length > 200) {
    runtimeTelemetryBuffer.pop()
  }

  return normalizedEvent
}

export function readRuntimeTelemetry(): RuntimeTelemetryEvent[] {
  return [...runtimeTelemetryBuffer]
}

export function clearRuntimeTelemetry(): void {
  runtimeTelemetryBuffer.length = 0
}
