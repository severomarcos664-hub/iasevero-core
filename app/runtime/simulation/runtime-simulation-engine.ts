export interface RuntimeSimulationInput {
  concurrentFlows: number
  queuePressure: number
  failureRate: number
}

export interface RuntimeSimulationResult {
  projectedStress: number
  projectedStability: 'stable' | 'warning' | 'critical'
}

export function simulateRuntimeStress(
  input: RuntimeSimulationInput
): RuntimeSimulationResult {
  const projectedStress =
    (input.concurrentFlows * 2) +
    input.queuePressure +
    (input.failureRate * 10)

  if (projectedStress >= 120) {
    return {
      projectedStress,
      projectedStability: 'critical'
    }
  }

  if (projectedStress >= 70) {
    return {
      projectedStress,
      projectedStability: 'warning'
    }
  }

  return {
    projectedStress,
    projectedStability: 'stable'
  }
}
