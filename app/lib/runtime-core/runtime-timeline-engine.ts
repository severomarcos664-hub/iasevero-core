import { readRuntimeTelemetry }
from './runtime-telemetry-fabric'

export type RuntimeTimelineEntry = {
  timestamp: string
  source: string
  severity: string
  type: string
  message: string
}

export type RuntimeTimelineAnalysis = {
  generatedAt: string
  source: 'runtime-timeline-engine'
  totalEntries: number
  latestSeverity: string
  operationalTrend:
    | 'stable'
    | 'elevated'
    | 'critical'
  recommendation: string
  timeline: RuntimeTimelineEntry[]
  reasoning: string[]
}

export function buildRuntimeTimeline():
  RuntimeTimelineAnalysis {

  const telemetry = readRuntimeTelemetry()

  const timeline: RuntimeTimelineEntry[] =
    telemetry.map(event => ({
      timestamp: event.timestamp,
      source: event.source,
      severity: event.severity,
      type: event.type,
      message: event.message,
    }))

  const latestSeverity =
    timeline.length > 0
      ? timeline[timeline.length - 1].severity
      : 'info'

  const operationalTrend =
    latestSeverity === 'critical'
      ? 'critical'
      : latestSeverity === 'warning'
        ? 'elevated'
        : 'stable'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-timeline-engine',

    totalEntries: timeline.length,

    latestSeverity,

    operationalTrend,

    recommendation:
      operationalTrend === 'critical'
        ? 'Timeline indica degradação crítica.'
        : operationalTrend === 'elevated'
          ? 'Timeline indica elevação operacional.'
          : 'Timeline operacional estável.',

    timeline,

    reasoning: [
      `entries:${timeline.length}`,
      `latest:${latestSeverity}`,
      `trend:${operationalTrend}`,
    ],
  }
}
