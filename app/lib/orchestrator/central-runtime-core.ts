import { superviseRuntime } from './runtime-supervisor'
import { evaluateRuntimeEvolution } from './evolution-engine'
import { executeSelfHealing } from './self-healing'
import { createRuntimeSnapshot } from './runtime-snapshot'

export function runCentralRuntimeCore() {
  const supervision = superviseRuntime()

  const evolution = evaluateRuntimeEvolution()

  const healing =
    supervision.operational
      ? {
          healed: false,
          reason: 'Runtime saudável.'
        }
      : executeSelfHealing()

  const snapshot = createRuntimeSnapshot()

  return {
    timestamp: new Date().toISOString(),
    supervision,
    evolution,
    healing,
    snapshot,
    operational:
      supervision.operational &&
      evolution.awareness.awareness.safe
  }
}
