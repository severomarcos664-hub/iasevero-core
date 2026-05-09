import { getRecentEvents } from './event-logger'
import { getRecentTraces } from './trace'
import { getState } from './state-engine'

export function getAuditTrail() {
  return {
    timestamp: new Date().toISOString(),
    state: getState(),
    events: getRecentEvents(),
    traces: getRecentTraces()
  }
}
