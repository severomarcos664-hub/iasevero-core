import { getState } from './state-engine'
import { runDiagnostics } from './diagnostics'
import { getOperationalMetrics } from './metrics'

export function getRuntimeAwareness() {
  const state = getState()
  const diagnostics = runDiagnostics()
  const metrics = getOperationalMetrics()

  return {
    awareness: {
      safe: state.safe,
      mode: state.mode,
      risk: state.lastRisk || 'low'
    },

    diagnostics,

    metrics,

    conclusion:
      diagnostics.healthy
        ? 'IASevero operacional e consciente do runtime.'
        : 'IASevero detectou instabilidade operacional.'
  }
}
