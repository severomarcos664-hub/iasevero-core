import { getState } from './state-engine'
import { getRecentEvents } from './event-logger'
import { getRecentTraces } from './trace'
import { getMemoryPolicy } from './memory-governor'

export function getOperationalMetrics() {
  const state = getState()
  const events = getRecentEvents()
  const traces = getRecentTraces()
  const memoryPolicy = getMemoryPolicy()

  return {
    service: 'IASevero',
    timestamp: new Date().toISOString(),
    state,
    eventCount: events.length,
    traceCount: traces.length,
    memoryPolicy,
    healthy: state.safe === true
  }
}
