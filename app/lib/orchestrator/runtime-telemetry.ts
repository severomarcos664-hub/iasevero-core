import {
  RuntimeConsciousState
} from './runtime-conscious-loop'

export type RuntimeTelemetry = {
  operational: boolean
  stabilityScore: number
  processedEvents: number
  generatedAt: string
}

export function generateRuntimeTelemetry(
  consciousness: RuntimeConsciousState
): RuntimeTelemetry {

  const stabilityScore =
    consciousness.operational
      ? 100
      : 40

  return {
    operational: consciousness.operational,
    stabilityScore,
    processedEvents: consciousness.processedEvents,
    generatedAt: new Date().toISOString()
  }
}
