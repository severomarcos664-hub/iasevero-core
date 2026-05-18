export interface RuntimeAwarenessMetrics {
  activeModules: number
  activeFlows: number
  queuePressure: number
  recoveryEvents: number
}

export interface RuntimeAwarenessState {
  stability: 'stable' | 'warning' | 'critical'
  awarenessScore: number
}

export function evaluateRuntimeAwareness(
  metrics: RuntimeAwarenessMetrics
): RuntimeAwarenessState {
  let score = 100

  score -= metrics.queuePressure * 0.5
  score -= metrics.recoveryEvents * 5

  if (score < 0) {
    score = 0
  }

  if (score <= 40) {
    return {
      stability: 'critical',
      awarenessScore: score
    }
  }

  if (score <= 70) {
    return {
      stability: 'warning',
      awarenessScore: score
    }
  }

  return {
    stability: 'stable',
    awarenessScore: score
  }
}
