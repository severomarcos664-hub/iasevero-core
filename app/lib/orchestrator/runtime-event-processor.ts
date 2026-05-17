import {
  RuntimeEvent,
  emitRuntimeEvent
} from './runtime-event-bus'

import {
  registerRuntimeMemoryEvent
} from './runtime-operational-memory'

export type RuntimeEventProcessingResult = {
  processed: boolean
  eventId: string
  actions: string[]
  processedAt: string
}

export function processRuntimeEvent(
  event: RuntimeEvent
): RuntimeEventProcessingResult {

  const actions: string[] = []

  if (event.type === 'runtime-alert') {

    registerRuntimeMemoryEvent({
      id: crypto.randomUUID(),
      type: 'runtime',
      severity: 'high',
      message: 'Alerta runtime processado.',
      createdAt: new Date().toISOString()
    })

    actions.push('memory-registered')

    emitRuntimeEvent({
      id: crypto.randomUUID(),
      type: 'runtime-audit',
      payload: {
        source: event.id
      },
      createdAt: new Date().toISOString()
    })

    actions.push('audit-triggered')
  }

  if (event.type === 'runtime-recovery') {

    actions.push('recovery-validated')
  }

  return {
    processed: true,
    eventId: event.id,
    actions,
    processedAt: new Date().toISOString()
  }
}
