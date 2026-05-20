import { readRuntimeSnapshots } from './runtime-snapshot'

export type RuntimeOperationalMemory = {
  generatedAt: string
  snapshotCount: number
  recoveryFrequency: number
  stabilityTrend: 'stable' | 'degrading' | 'recovering' | 'unknown'
  providerPattern: string
  memoryModePattern: string
  riskTrend: 'low' | 'medium' | 'high'
  operationalConclusion: string
}

function dominant(values: string[]): string {
  const map = new Map<string, number>()
  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1)
  }

  return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown'
}

export function buildRuntimeOperationalMemory(): RuntimeOperationalMemory {
  const snapshots = readRuntimeSnapshots()
  const total = snapshots.length

  if (total === 0) {
    return {
      generatedAt: new Date().toISOString(),
      snapshotCount: 0,
      recoveryFrequency: 0,
      stabilityTrend: 'unknown',
      providerPattern: 'unknown',
      memoryModePattern: 'unknown',
      riskTrend: 'low',
      operationalConclusion: 'Sem histórico operacional suficiente.',
    }
  }

  const recoveryCount = snapshots.filter((snapshot) => snapshot.recovery).length
  const stableCount = snapshots.filter((snapshot) => snapshot.stable).length

  const recoveryFrequency = Math.floor((recoveryCount / total) * 100)
  const stabilityRate = Math.floor((stableCount / total) * 100)

  const providerPattern = dominant(snapshots.map((snapshot) => snapshot.provider))
  const memoryModePattern = dominant(snapshots.map((snapshot) => snapshot.memoryMode))

  const stabilityTrend =
    recoveryFrequency >= 70
      ? 'degrading'
      : stabilityRate >= 70
        ? 'stable'
        : recoveryFrequency >= 30
          ? 'recovering'
          : 'unknown'

  const riskTrend =
    recoveryFrequency >= 70
      ? 'high'
      : recoveryFrequency >= 30
        ? 'medium'
        : 'low'

  const operationalConclusion =
    riskTrend === 'high'
      ? 'Histórico indica recovery recorrente e necessidade de contenção operacional.'
      : riskTrend === 'medium'
        ? 'Histórico indica instabilidade moderada com recuperação parcial.'
        : 'Histórico operacional indica estabilidade aceitável.'

  return {
    generatedAt: new Date().toISOString(),
    snapshotCount: total,
    recoveryFrequency,
    stabilityTrend,
    providerPattern,
    memoryModePattern,
    riskTrend,
    operationalConclusion,
  }
}
