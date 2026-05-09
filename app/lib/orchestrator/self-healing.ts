import { runDiagnostics } from './diagnostics'
import { resetState } from './state-engine'
import { clearQueue } from './queue-governor'
import { clearDecisionMemory } from './decision-memory'

export function executeSelfHealing() {
  const diagnostics = runDiagnostics()

  if (diagnostics.healthy) {
    return {
      healed: false,
      reason: 'Runtime saudável.'
    }
  }

  resetState()
  clearQueue()
  clearDecisionMemory()

  return {
    healed: true,
    reason: 'Self-healing executado.'
  }
}
