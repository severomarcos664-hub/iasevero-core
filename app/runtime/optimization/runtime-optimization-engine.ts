export interface RuntimeOptimizationMetrics {
  latencyMs: number
  queuePressure: number
  memoryPressure: number
}

export interface RuntimeOptimizationDecision {
  scalePriority: boolean
  reduceConcurrency: boolean
  enableProtectionMode: boolean
}

export function optimizeRuntime(
  metrics: RuntimeOptimizationMetrics
): RuntimeOptimizationDecision {
  return {
    scalePriority:
      metrics.queuePressure > 70,

    reduceConcurrency:
      metrics.memoryPressure > 80,

    enableProtectionMode:
      metrics.latencyMs > 4000
  }
}
