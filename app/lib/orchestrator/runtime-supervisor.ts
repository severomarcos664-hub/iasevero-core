import type { RuntimeAwareness } from './runtime-awareness'
import type { RuntimeIntelligenceReport } from './runtime-intelligence'
import type { RuntimeTopologyReport } from './runtime-topology-validator'
import type { RuntimeStructuralHealthReport } from './runtime-structural-health'

export type RuntimeSupervisorReport = {
  globalState:
    | 'stable'
    | 'warning'
    | 'critical'

  operationalScore: number

  recommendation: string
}

export function evaluateRuntimeSupervisor(
  awareness: RuntimeAwareness,
  intelligence: RuntimeIntelligenceReport,
  topology: RuntimeTopologyReport,
  structural: RuntimeStructuralHealthReport
): RuntimeSupervisorReport {

  const penalties = [
    awareness.severity === 'critical' ? 30 : 0,
    intelligence.degradationRisk === 'high' ? 25 : 0,
    topology.issues.length * 5,
    structural.structuralRisk === 'high' ? 30 : 0
  ]

  const operationalScore =
    Math.max(
      0,
      100 - penalties.reduce((a, b) => a + b, 0)
    )

  const globalState =
    operationalScore < 40
      ? 'critical'
      : operationalScore < 70
      ? 'warning'
      : 'stable'

  const recommendation =
    globalState === 'critical'
      ? 'Supervisor exige contenção imediata.'
      : globalState === 'warning'
      ? 'Supervisor recomenda estabilização.'
      : 'Supervisor considera runtime estável.'

  return {
    globalState,
    operationalScore,
    recommendation
  }
}


export function superviseRuntime() {
  return {
    operational: true,
    globalState: 'stable',
    operationalScore: 100,
    recommendation: 'Supervisor compatível operacional.'
  }
}
