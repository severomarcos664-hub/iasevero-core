export type RuntimeOperationalMetrics = {
  eventCount: number
  processedEvents: number
  failedEvents: number
  traceCount: number

  operationalScore: number
  stabilityRate: number
  recoveryFrequency: number

  degradationRisk: 'low' | 'medium' | 'high'

  queueDepth: number

  generatedAt: string
}
