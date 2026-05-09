import { runDiagnostics } from './diagnostics'
import { updateState } from './state-engine'

export function applyAdaptiveProtection() {
  const diagnostics = runDiagnostics()

  if (!diagnostics.healthy) {
    updateState({
      safe: false,
      lastRisk: diagnostics.level,
      lastProvider: 'local'
    })

    return {
      protected: true,
      reason: 'Modo seguro ativado automaticamente.'
    }
  }

  updateState({
    safe: true,
    lastRisk: diagnostics.level
  })

  return {
    protected: false,
    reason: 'Runtime operacional.'
  }
}
