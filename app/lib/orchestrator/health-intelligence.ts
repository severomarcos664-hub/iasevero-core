import { getOperationalMetrics } from './metrics'
import { runDiagnostics } from './diagnostics'
import { getState } from './state-engine'

export function getHealthIntelligence() {
  const metrics = getOperationalMetrics()
  const diagnostics = runDiagnostics()
  const state = getState()

  return {
    timestamp: new Date().toISOString(),
    runtime: {
      mode: state.mode,
      safe: state.safe
    },
    metrics,
    diagnostics,
    summary:
      diagnostics.healthy
        ? 'IASevero operacional e estável.'
        : 'IASevero detectou alertas operacionais.'
  }
}
