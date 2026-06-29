import {
  coordinateRuntimeUnifiedIntelligence,
} from './runtime-unified-intelligence-coordinator'

export type RuntimeUnifiedIntelligenceEngineResult =
  ReturnType<typeof coordinateRuntimeUnifiedIntelligence>

export function executeRuntimeUnifiedIntelligence(input = {}) {
  return coordinateRuntimeUnifiedIntelligence(input)
}
