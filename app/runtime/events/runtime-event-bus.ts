export type RuntimeEvent = {
  id: string
  type: string
  source: string
  timestamp: number
  payload?: unknown
}

type RuntimeHandler = (event: RuntimeEvent) => void

export class RuntimeEventBus {
  private handlers = new Map<string, RuntimeHandler[]>()

  subscribe(type: string, handler: RuntimeHandler) {
    const existing = this.handlers.get(type) || []
    existing.push(handler)
    this.handlers.set(type, existing)
  }

  publish(event: RuntimeEvent) {
    const handlers = this.handlers.get(event.type) || []

    for (const handler of handlers) {
      try {
        handler(event)
      } catch (error) {
        console.error(
          '[runtime-event-bus]',
          event.type,
          error
        )
      }
    }
  }

  stats() {
    return {
      eventTypes: this.handlers.size
    }
  }
}

export const runtimeEventBus =
  new RuntimeEventBus()
