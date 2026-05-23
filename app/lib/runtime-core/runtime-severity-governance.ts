import { correlateRuntimeTelemetry } from './runtime-telemetry-correlation'

export type RuntimeSeverityLevel =
  | 'normal'
  | 'observe'
  | 'warning'
  | 'critical'
  | 'containment'

export type RuntimeSeverityGovernance = {
  generatedAt: string
  source: 'runtime-severity-governance'
  severityLevel: RuntimeSeverityLevel
  escalationRequired: boolean
  recoveryRequired: boolean
  containmentRequired: boolean
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeSeverityGovernance():
  RuntimeSeverityGovernance {

  const telemetry = correlateRuntimeTelemetry()

  const severityLevel: RuntimeSeverityLevel =
    telemetry.criticalEvents > 0
      ? 'containment'
      : telemetry.warningEvents > 5
        ? 'critical'
        : telemetry.warningEvents > 2
          ? 'warning'
          : telemetry.infoEvents > 10
            ? 'observe'
            : 'normal'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-severity-governance',

    severityLevel,

    escalationRequired:
      severityLevel === 'critical' ||
      severityLevel === 'containment',

    recoveryRequired:
      severityLevel === 'critical' ||
      severityLevel === 'containment',

    containmentRequired:
      severityLevel === 'containment',

    recommendation:
      severityLevel === 'containment'
        ? 'Containment imediato recomendado.'
        : severityLevel === 'critical'
          ? 'Recuperação operacional imediata.'
          : severityLevel === 'warning'
            ? 'Aumentar monitoramento.'
            : severityLevel === 'observe'
              ? 'Observação contínua recomendada.'
              : 'Sistema operacional estável.',

    reasoning: [
      ...telemetry.reasoning,
      `severity:${severityLevel}`,
    ],
  }
}
