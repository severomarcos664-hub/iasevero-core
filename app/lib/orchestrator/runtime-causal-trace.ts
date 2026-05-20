import { readRuntimeSnapshots } from './runtime-snapshot'

export type RuntimeCausalTraceMap = {
  generatedAt: string
  snapshotCount: number
  latestState: {
    provider: string | null
    mode: string | null
    awareness: string | null
    recovery: boolean | null
    stabilization: string | null
    memoryMode: string | null
  }
  causalSignals: string[]
  conclusion: string
}

export function buildRuntimeCausalTraceMap(): RuntimeCausalTraceMap {
  const snapshots = readRuntimeSnapshots()
  const latest = snapshots[0] ?? null

  const causalSignals: string[] = []

  if (latest?.recovery) causalSignals.push('recovery-active')
  if (latest?.stabilization) causalSignals.push(`stabilization:${latest.stabilization}`)
  if (latest?.awareness) causalSignals.push(`awareness:${latest.awareness}`)
  if (latest?.provider) causalSignals.push(`provider:${latest.provider}`)
  if (latest?.memoryMode) causalSignals.push(`memory:${latest.memoryMode}`)

  const conclusion =
    causalSignals.length === 0
      ? 'Nenhum sinal causal recente encontrado.'
      : `Estado atual explicado por ${causalSignals.join(' -> ')}.`

  return {
    generatedAt: new Date().toISOString(),
    snapshotCount: snapshots.length,
    latestState: {
      provider: latest?.provider ?? null,
      mode: latest?.mode ?? null,
      awareness: latest?.awareness ?? null,
      recovery: latest?.recovery ?? null,
      stabilization: latest?.stabilization ?? null,
      memoryMode: latest?.memoryMode ?? null,
    },
    causalSignals,
    conclusion,
  }
}
