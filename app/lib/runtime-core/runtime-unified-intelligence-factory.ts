export type RuntimeUnifiedIntelligence = {
  confidenceScore: number
  confidenceLevel: string
  riskLevel: string
  criticalityLevel: string
  governanceState: string
  executionAllowed: boolean
  executionPriority: string
  operationalState: string
  recommendation: string
  source: 'runtime-unified-intelligence-factory'
  timestamp: string
}

export function createRuntimeUnifiedIntelligence(
  input: Partial<RuntimeUnifiedIntelligence> = {}
): RuntimeUnifiedIntelligence {
  return {
    confidenceScore: input.confidenceScore ?? 0,
    confidenceLevel: input.confidenceLevel ?? 'unknown',
    riskLevel: input.riskLevel ?? 'unknown',
    criticalityLevel: input.criticalityLevel ?? 'unknown',
    governanceState: input.governanceState ?? 'unknown',
    executionAllowed: input.executionAllowed ?? false,
    executionPriority: input.executionPriority ?? 'normal',
    operationalState: input.operationalState ?? 'unknown',
    recommendation: input.recommendation ?? 'Unified intelligence pending runtime signals.',
    source: 'runtime-unified-intelligence-factory',
    timestamp: input.timestamp ?? new Date().toISOString(),
  }
}
