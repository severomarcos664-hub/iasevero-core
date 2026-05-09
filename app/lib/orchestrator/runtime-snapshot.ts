import { getState } from './state-engine'
import { getRecentEvents } from './event-logger'
import { getRecentTraces } from './trace'
import { getRecentDecisions } from './decision-memory'

export function createRuntimeSnapshot() {
  return {
    timestamp: new Date().toISOString(),
    state: getState(),
    events: getRecentEvents(),
    traces: getRecentTraces(),
    decisions: getRecentDecisions()
  }
}
