import {
  createRuntimeUnifiedIntelligence,
  type RuntimeUnifiedIntelligence,
} from './runtime-unified-intelligence-factory'

export type RuntimeUnifiedIntelligenceServiceInput = Partial<RuntimeUnifiedIntelligence>

export function buildRuntimeUnifiedIntelligence(
  input: RuntimeUnifiedIntelligenceServiceInput = {}
): RuntimeUnifiedIntelligence {
  return createRuntimeUnifiedIntelligence(input)
}
