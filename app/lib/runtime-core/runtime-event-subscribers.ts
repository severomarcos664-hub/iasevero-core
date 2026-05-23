import {
  RuntimeBusEvent,
  publishRuntimeEvent,
} from './runtime-event-bus'

export type RuntimeEventSubscriber = {
  id: string
  eventType: string
  onEvent: (event: RuntimeBusEvent) => void
}

const runtimeSubscribers: RuntimeEventSubscriber[] = []

export function registerRuntimeSubscriber(
  subscriber: RuntimeEventSubscriber
): void {
  runtimeSubscribers.push(subscriber)
}

export function dispatchRuntimeEvent(
  event: Omit<RuntimeBusEvent, 'id' | 'timestamp'>
): RuntimeBusEvent {
  const emittedEvent = publishRuntimeEvent(event)

  const matchingSubscribers = runtimeSubscribers.filter(
    subscriber =>
      subscriber.eventType === emittedEvent.type
  )

  for (const subscriber of matchingSubscribers) {
    try {
      subscriber.onEvent(emittedEvent)
    } catch (error) {
      console.error(
        '[runtime-event-subscriber-error]',
        subscriber.id,
        error
      )
    }
  }

  return emittedEvent
}

export function getRuntimeSubscribers(): RuntimeEventSubscriber[] {
  return [...runtimeSubscribers]
}
