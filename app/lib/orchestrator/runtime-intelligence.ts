import type { RuntimeSnapshot } from './runtime-snapshot'

export type RuntimeIntelligenceReport = {
  operationalScore: number
  stabilityRate: number
  degradationRisk: 'low' | 'medium' | 'high'
  dominantProvider: string
  dominantMode: string
  recoveryFrequency: number
  recommendation: string
}

export function analyzeRuntimeIntelligence(
  snapshots: RuntimeSnapshot[]
): RuntimeIntelligenceReport {

  if (!snapshots.length) {
    return {
      operationalScore: 100,
      stabilityRate: 100,
      degradationRisk: 'low',
      dominantProvider: 'local',
      dominantMode: 'local',
      recoveryFrequency: 0,
      recommendation: 'Sem histórico. Runtime considerado estável.'
    }
  }

  const stableCount = snapshots.filter(
    s => s.stable
  ).length

  const recoveryCount = snapshots.filter(
    s => s.recovery
  ).length

  const providerMap = new Map<string, number>()
  const modeMap = new Map<string, number>()

  for (const snapshot of snapshots) {

    providerMap.set(
      snapshot.provider,
      (providerMap.get(snapshot.provider) || 0) + 1
    )

    modeMap.set(
      snapshot.mode,
      (modeMap.get(snapshot.mode) || 0) + 1
    )
  }

  const dominantProvider =
    [...providerMap.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'local'

  const dominantMode =
    [...modeMap.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'local'

  const stabilityRate =
    Math.floor((stableCount / snapshots.length) * 100)

  const recoveryFrequency =
    Math.floor((recoveryCount / snapshots.length) * 100)

  const operationalScore =
    Math.max(
      5,
      stabilityRate - Math.floor(recoveryFrequency / 2)
    )

  const degradationRisk =
    operationalScore < 40
      ? 'high'
      : operationalScore < 70
      ? 'medium'
      : 'low'

  const recommendation =
    degradationRisk === 'high'
      ? 'Runtime exige estabilização imediata.'
      : degradationRisk === 'medium'
      ? 'Runtime deve reduzir pressão operacional.'
      : 'Runtime operando normalmente.'

  return {
    operationalScore,
    stabilityRate,
    degradationRisk,
    dominantProvider,
    dominantMode,
    recoveryFrequency,
    recommendation
  }
}
