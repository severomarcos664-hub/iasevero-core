import { analyzeRuntimePatterns } from './learning-engine'
import { getRuntimeAwareness } from './awareness-engine'

export function evaluateRuntimeEvolution() {
  const patterns = analyzeRuntimePatterns()
  const awareness = getRuntimeAwareness()

  const suggestions: string[] = []

  if (patterns.risky > patterns.safe) {
    suggestions.push(
      'Reduzir uso de providers instáveis.'
    )
  }

  if (!awareness.awareness.safe) {
    suggestions.push(
      'Ativar modo seguro preventivo.'
    )
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Runtime operacional estável.'
    )
  }

  return {
    timestamp: new Date().toISOString(),
    patterns,
    awareness,
    suggestions
  }
}
