import { getRecentDecisions } from './decision-memory'

export function analyzeRuntimePatterns() {
  const decisions = getRecentDecisions()

  const risky = decisions.filter(
    d => d.safe === false
  ).length

  const safe = decisions.filter(
    d => d.safe === true
  ).length

  const dominantProvider =
    decisions.reduce((acc, d) => {
      acc[d.provider] =
        (acc[d.provider] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  return {
    total: decisions.length,
    safe,
    risky,
    dominantProvider
  }
}
