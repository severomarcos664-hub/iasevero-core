import type { RuntimeStateRegistry } from './runtime-state-registry'

export type RuntimeAwareness = {
  healthScore: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  degraded: boolean
  recoveryRequired: boolean
  diagnostic: string
}

export function evaluateRuntimeAwareness(
  registry: RuntimeStateRegistry
): RuntimeAwareness {

  const pressure =
    registry.runtimePressure +
    registry.providerPressure +
    registry.memoryPressure +
    registry.executionPressure

  const normalizedPressure = Math.min(
    100,
    Math.floor(pressure / 4)
  )

  if (registry.degradationState) {
    return {
      healthScore: 25,
      severity: 'critical',
      degraded: true,
      recoveryRequired: true,
      diagnostic: 'Runtime degradado.'
    }
  }

  if (normalizedPressure >= 75) {
    return {
      healthScore: 45,
      severity: 'high',
      degraded: true,
      recoveryRequired: true,
      diagnostic: 'Alta pressão operacional.'
    }
  }

  if (normalizedPressure >= 45) {
    return {
      healthScore: 70,
      severity: 'medium',
      degraded: false,
      recoveryRequired: false,
      diagnostic: 'Pressão moderada.'
    }
  }

  return {
    healthScore: 95,
    severity: 'low',
    degraded: false,
    recoveryRequired: false,
    diagnostic: 'Runtime estável.'
  }
}
