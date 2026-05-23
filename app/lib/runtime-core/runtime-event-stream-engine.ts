import { emitRuntimeTelemetry } from './runtime-telemetry-fabric'

export type RuntimeStreamEventType =
  | 'request.received'
  | 'runtime.checked'
  | 'governance.evaluated'
  | 'execution.allowed'
  | 'execution.blocked'
  | 'response.generated'
  | 'telemetry.persisted'

export type RuntimeStreamEvent = {
  id: string
  timestamp: string
  source: 'runtime-event-stream-engine'
  type: RuntimeStreamEventType
  correlationId: string
  payload: unknown
}

const runtimeEventStream: RuntimeStreamEvent[] = []

export function publishRuntimeStreamEvent(
  type: RuntimeStreamEventType,
  correlationId: string,
  payload: unknown,
): RuntimeStreamEvent {
  const event: RuntimeStreamEvent = {
    id: `rse_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    source: 'runtime-event-stream-engine',
    type,
    correlationId,
    payload,
  }

  runtimeEventStream.push(event)

  emitRuntimeTelemetry({
    source: 'runtime-event-stream-engine',
    type: 'runtime-stream-event',
    severity:
      type === 'execution.blocked'
        ? 'warning'
        : 'info',
    correlationId,
    message: `Runtime stream event published: ${type}`,
    payload: event,
  })

  return event
}

export function readRuntimeEventStream(): RuntimeStreamEvent[] {
  return [...runtimeEventStream]
}

export function clearRuntimeEventStream(): void {
  runtimeEventStream.length = 0
}
