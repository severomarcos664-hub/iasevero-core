import { getOperationalMetrics } from './metrics'
import { isLimitExceeded } from './runtime-limiter'
import { updateState } from './state-engine'

export function enforceRuntimeSafety() {
  const metrics = getOperationalMetrics()

  const exceeded = isLimitExceeded({
    events: metrics.eventCount,
    traces: metrics.traceCount,
    queue: 0
  })

  const danger =
    exceeded.events ||
    exceeded.traces ||
    exceeded.queue

  if (danger) {
    updateState({
      safe: false,
      lastRisk: 'high'
    })

    return {
      protected: true,
      reason: 'Runtime protegido automaticamente'
    }
  }

  updateState({
    safe: true,
    lastRisk: 'low'
  })

  return {
    protected: false,
    reason: 'Runtime estável'
  }
}
