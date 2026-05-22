import { superviseRuntimeAutonomously } from './runtime-autonomous-supervisor'

export type RuntimeMemorySnapshot = {
  timestamp: string
  supervisionLevel: string
  approved: boolean
  recommendation: string
}

export type RuntimeMemoryPersistenceResult = {
  generatedAt: string
  source: 'runtime-memory-persistence-loop'
  totalSnapshots: number
  stabilityRate: number
  criticalEvents: number
  operationalTrend: 'stable' | 'watching' | 'degrading'
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoning: string[]
}

const runtimeMemoryHistory: RuntimeMemorySnapshot[] = []

export function runRuntimeMemoryPersistenceLoop():
RuntimeMemoryPersistenceResult {

  const supervision = superviseRuntimeAutonomously()

  runtimeMemoryHistory.unshift({
    timestamp: new Date().toISOString(),
    supervisionLevel: supervision.supervisionLevel,
    approved: supervision.approved,
    recommendation: supervision.recommendation,
  })

  if (runtimeMemoryHistory.length > 25) {
    runtimeMemoryHistory.pop()
  }

  const totalSnapshots = runtimeMemoryHistory.length

  const stableCount =
    runtimeMemoryHistory.filter(
      item => item.supervisionLevel === 'normal'
    ).length

  const criticalEvents =
    runtimeMemoryHistory.filter(
      item => item.supervisionLevel === 'critical'
    ).length

  const stabilityRate =
    totalSnapshots === 0
      ? 100
      : Math.floor((stableCount / totalSnapshots) * 100)

  const operationalTrend =
    criticalEvents >= 3
      ? 'degrading'
      : stabilityRate >= 70
        ? 'stable'
        : 'watching'

  const confidenceLevel =
    stabilityRate >= 80
      ? 'high'
      : stabilityRate >= 50
        ? 'medium'
        : 'low'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-memory-persistence-loop',
    totalSnapshots,
    stabilityRate,
    criticalEvents,
    operationalTrend,
    confidenceLevel,
    reasoning: [
      `snapshots:${totalSnapshots}`,
      `stability:${stabilityRate}`,
      `critical:${criticalEvents}`,
      `trend:${operationalTrend}`,
      `confidence:${confidenceLevel}`,
    ],
  }
}
