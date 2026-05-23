import { readRuntimeTelemetry } from './runtime-telemetry-fabric'

export type RuntimeTelemetryCorrelation = {
  generatedAt: string
  source: 'runtime-telemetry-correlation'
  totalEvents: number
  criticalEvents: number
  warningEvents: number
  infoEvents: number
  uniqueSources: number
  uniqueCorrelations: number
  observabilityHealth: 'healthy' | 'warning' | 'critical'
  recommendation: string
  reasoning: string[]
}

export function correlateRuntimeTelemetry(): RuntimeTelemetryCorrelation {
  const events = readRuntimeTelemetry()

  const criticalEvents = events.filter(e => e.severity === 'critical').length
  const warningEvents = events.filter(e => e.severity === 'warning').length
  const infoEvents = events.filter(e => e.severity === 'info').length

  const uniqueSources = new Set(events.map(e => e.source)).size
  const uniqueCorrelations = new Set(events.map(e => e.correlationId)).size

  const observabilityHealth =
    criticalEvents > 0
      ? 'critical'
      : warningEvents > 2
        ? 'warning'
        : 'healthy'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-telemetry-correlation',
    totalEvents: events.length,
    criticalEvents,
    warningEvents,
    infoEvents,
    uniqueSources,
    uniqueCorrelations,
    observabilityHealth,
    recommendation:
      observabilityHealth === 'critical'
        ? 'Telemetry indica eventos críticos; investigar imediatamente.'
        : observabilityHealth === 'warning'
          ? 'Telemetry indica sinais de atenção; ampliar observação.'
          : 'Telemetry saudável; continuar operação.',
    reasoning: [
      `events:${events.length}`,
      `critical:${criticalEvents}`,
      `warning:${warningEvents}`,
      `info:${infoEvents}`,
      `sources:${uniqueSources}`,
      `correlations:${uniqueCorrelations}`,
      `health:${observabilityHealth}`,
    ],
  }
}
