import { runCentralRuntimeCore } from './central-runtime-core'

let lastRuntimeState: any = null

export function executeRuntimeConsciousLoop() {
  const runtime = runCentralRuntimeCore()

  lastRuntimeState = {
    timestamp: new Date().toISOString(),
    operational: runtime.operational,
    supervision: runtime.supervision.operational,
    awareness: runtime.evolution.awareness.awareness.safe,
    healed: runtime.healing.healed
  }

  return {
    runtime,
    consciousness: lastRuntimeState
  }
}

export function getLastRuntimeState() {
  return lastRuntimeState
}
