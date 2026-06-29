import type { RuntimeUnifiedIntelligence } from './runtime-unified-intelligence-factory'

export type RuntimeUnifiedIntelligenceValidation = {
  valid: boolean
  missingFields: string[]
  source: 'runtime-unified-intelligence-validator'
}

const REQUIRED_FIELDS: Array<keyof RuntimeUnifiedIntelligence> = [
  'confidenceScore',
  'confidenceLevel',
  'riskLevel',
  'criticalityLevel',
  'governanceState',
  'executionAllowed',
  'executionPriority',
  'operationalState',
  'recommendation',
  'source',
  'timestamp',
]

export function validateRuntimeUnifiedIntelligence(
  intelligence: Partial<RuntimeUnifiedIntelligence>
): RuntimeUnifiedIntelligenceValidation {
  const missingFields = REQUIRED_FIELDS.filter((field) => intelligence[field] === undefined)

  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.map(String),
    source: 'runtime-unified-intelligence-validator',
  }
}
