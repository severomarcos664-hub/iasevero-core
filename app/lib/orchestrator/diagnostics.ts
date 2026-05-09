import { getOperationalMetrics } from './metrics'

export type RuntimeDiagnostic = {
  healthy: boolean
  level: 'low' | 'medium' | 'high'
  issues: string[]
}

export function runDiagnostics(): RuntimeDiagnostic {
  const metrics = getOperationalMetrics()

  const issues: string[] = []

  if (!metrics.healthy) {
    issues.push('Runtime marcado como inseguro.')
  }

  if (metrics.eventCount > 500) {
    issues.push('Volume elevado de eventos.')
  }

  if (metrics.traceCount > 500) {
    issues.push('Volume elevado de traces.')
  }

  const level =
    issues.length === 0
      ? 'low'
      : issues.length <= 2
        ? 'medium'
        : 'high'

  return {
    healthy: issues.length === 0,
    level,
    issues
  }
}
