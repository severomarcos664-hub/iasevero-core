import {
  RuntimeEvent,
  getRuntimeEvents
} from './runtime-event-bus'

import {
  processRuntimeEvent
} from './runtime-event-processor'

export type RuntimeCoordinationReport = {
  processedEvents: number
  successfulEvents: number
  failedEvents: number
  generatedAt: string
}

export function coordinateRuntime(): RuntimeCoordinationReport {

  const events = getRuntimeEvents()

  let successfulEvents = 0
  let failedEvents = 0

  for (const event of events) {

    try {

      const result = processRuntimeEvent(event)

      if (result.processed) {
        successfulEvents++
      } else {
        failedEvents++
      }

    } catch {
      failedEvents++
    }
  }

  return {
    processedEvents: events.length,
    successfulEvents,
    failedEvents,
    generatedAt: new Date().toISOString()
  }
}
