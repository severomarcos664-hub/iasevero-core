import type { RuntimeTopologyReport } from './runtime-topology-validator'
import type { RuntimeIntelligenceReport } from './runtime-intelligence'

export type RuntimeStructuralHealthReport = {
  score: number
  status: 'healthy' | 'warning' | 'critical'
  structuralRisk: 'low' | 'medium' | 'high'
  recommendation: string
}

export function evaluateStructuralHealth(
  topology: RuntimeTopologyReport,
  intelligence: RuntimeIntelligenceReport
): RuntimeStructuralHealthReport {

  const issuePenalty =
    topology.issues.length * 5

  const overloadPenalty =
    topology.overloadedModules.length * 10

  const degradationPenalty =
    intelligence.degradationRisk === 'high'
      ? 30
      : intelligence.degradationRisk === 'medium'
      ? 15
      : 0

  const score = Math.max(
    0,
    100
    - issuePenalty
    - overloadPenalty
    - degradationPenalty
  )

  const status =
    score < 40
      ? 'critical'
      : score < 70
      ? 'warning'
      : 'healthy'

  const structuralRisk =
    score < 40
      ? 'high'
      : score < 70
      ? 'medium'
      : 'low'

  const recommendation =
    structuralRisk === 'high'
      ? 'Runtime exige estabilização estrutural.'
      : structuralRisk === 'medium'
      ? 'Runtime deve reduzir acoplamento.'
      : 'Estrutura operacional estável.'

  return {
    score,
    status,
    structuralRisk,
    recommendation
  }
}
