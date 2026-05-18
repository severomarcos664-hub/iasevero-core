import {
  runtimeEventBus
} from '../events/runtime-event-bus'

export function emitRuntimeStateChanged(
  key: string,
  value: unknown
) {
  runtimeEventBus.publish({
    id: crypto.randomUUID(),
    type: 'runtime.state.changed',
    source: 'runtime-state-kernel',
    timestamp: Date.now(),
    payload: {
      key,
      value
    }
  })
}
