export type MemoryPolicy = {
  maxHistoryItems: number
  maxFacts: number
  strategy: 'recent-first' | 'facts-first'
  reason: string
}

export function getMemoryPolicy(): MemoryPolicy {
  return {
    maxHistoryItems: 12,
    maxFacts: 50,
    strategy: 'facts-first',
    reason: 'Priorizar fatos importantes e limitar histórico para evitar crescimento excessivo.'
  }
}

export function trimHistory(history: string[]): string[] {
  const policy = getMemoryPolicy()
  return history.slice(-policy.maxHistoryItems)
}

export function shouldStoreFact(key: string, value: string): boolean {
  if (!key || !value) return false
  if (key.length > 80) return false
  if (value.length > 300) return false
  return true
}
