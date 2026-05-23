import { evaluateRuntimeSeverityGovernance }
from './runtime-severity-governance'

export type RuntimePredictiveStabilization = {
  generatedAt: string
  source: 'runtime-predictive-stabilization'
  predictiveRisk: 'low' | 'moderate' | 'high'
  preventiveAction: boolean
  stabilizationMode:
    | 'normal'
    | 'observe'
    | 'adaptive-monitoring'
    | 'preventive-containment'
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimePredictiveStabilization():
  RuntimePredictiveStabilization {

  const governance = evaluateRuntimeSeverityGovernance()

  const predictiveRisk =
    governance.severityLevel === 'containment'
      ? 'high'
      : governance.severityLevel === 'critical'
        ? 'high'
        : governance.severityLevel === 'warning'
          ? 'moderate'
          : governance.severityLevel === 'observe'
            ? 'moderate'
            : 'low'

  const stabilizationMode =
    predictiveRisk === 'high'
      ? 'preventive-containment'
      : predictiveRisk === 'moderate'
        ? 'adaptive-monitoring'
        : governance.severityLevel === 'observe'
          ? 'observe'
          : 'normal'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-predictive-stabilization',

    predictiveRisk,

    preventiveAction:
      predictiveRisk !== 'low',

    stabilizationMode,

    recommendation:
      predictiveRisk === 'high'
        ? 'Ativar contenção preventiva imediatamente.'
        : predictiveRisk === 'moderate'
          ? 'Ativar monitoramento adaptativo.'
          : 'Sistema preditivamente estável.',

    reasoning: [
      ...governance.reasoning,
      `predictiveRisk:${predictiveRisk}`,
      `mode:${stabilizationMode}`,
    ],
  }
}
