import { executeRuntimeConsciousLoop } from './runtime-conscious-loop'
import { resolveHybridProvider } from './hybrid-router'
import { executeSelfHealing } from './self-healing'

export function executeRuntimeDecisionEngine() {
  const consciousness = executeRuntimeConsciousLoop()

  const routing = resolveHybridProvider()

  const decisions: string[] = []

  if (!consciousness.consciousness.operational) {
    decisions.push('Ativar modo seguro.')
  }

  if (consciousness.consciousness.healed) {
    decisions.push('Runtime recuperado automaticamente.')
  }

  if (routing.mode === 'safe') {
    decisions.push('Provider local forçado.')
  }

  const healing =
    consciousness.consciousness.operational
      ? {
          healed: false,
          reason: 'Healing não necessário.'
        }
      : executeSelfHealing()

  return {
    timestamp: new Date().toISOString(),
    consciousness,
    routing,
    healing,
    decisions,
    stable:
      consciousness.consciousness.operational &&
      routing.mode !== 'safe'
  }
}
