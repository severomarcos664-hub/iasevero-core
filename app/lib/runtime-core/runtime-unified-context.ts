import { buildRuntimeBrainMatrix } from '../orchestrator/runtime-brain-matrix'

export type RuntimeUnifiedContext = {
  generatedAt: string
  source: 'runtime-unified-context'
  brain: ReturnType<typeof buildRuntimeBrainMatrix>
  operational: boolean
  globalState: ReturnType<typeof buildRuntimeBrainMatrix>['globalState']
  operationalScore: number
  recommendation: string
}

export function buildRuntimeUnifiedContext(): RuntimeUnifiedContext {
  const brain = buildRuntimeBrainMatrix()

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-unified-context',
    brain,
    operational: brain.operational,
    globalState: brain.globalState,
    operationalScore: brain.operationalScore,
    recommendation: brain.recommendation,
  }
}
