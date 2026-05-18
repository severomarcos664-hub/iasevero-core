import {
  runtimeEventBus,
  type RuntimeEvent
} from '../events/runtime-event-bus'

const telemetryEvents: RuntimeEvent[] = []

export function startRuntimeTelemetrySubscriber() {
  runtimeEventBus.subscribe('runtime.state.changed', event => {
    telemetryEvents.push(event)
  })
}

export function getRuntimeTelemetryEvents() {
  return telemetryEvents
}
