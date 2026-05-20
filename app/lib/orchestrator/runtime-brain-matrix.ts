import { getOperationalMetrics } from './metrics'
import { readRuntimeSnapshots } from './runtime-snapshot'
import { superviseRuntime } from './runtime-supervisor'
import { buildRuntimeCausalTraceMap } from './runtime-causal-trace'
import { buildRuntimeOperationalMemory } from './runtime-operational-memory'

export type RuntimeBrainMatrixState = {
  service: 'IASevero'
  generatedAt: string
  sourceOfTruth: 'runtime-brain-matrix'
  operational: boolean
  operationalScore: number
  globalState: 'stable' | 'warning' | 'critical'
  recommendation: string
  metrics: ReturnType<typeof getOperationalMetrics>
  snapshots: {
    total: number
    latest: ReturnType<typeof readRuntimeSnapshots>[number] | null
  }
  supervision: ReturnType<typeof superviseRuntime>
  causalTrace: ReturnType<typeof buildRuntimeCausalTraceMap>
  operationalMemory: ReturnType<typeof buildRuntimeOperationalMemory>
}

export function buildRuntimeBrainMatrix(): RuntimeBrainMatrixState {
  const metrics = getOperationalMetrics()
  const snapshots = readRuntimeSnapshots()
  const latest = snapshots[0] ?? null
  const supervision = superviseRuntime()
  const causalTrace = buildRuntimeCausalTraceMap()
  const operationalMemory = buildRuntimeOperationalMemory()

  return {
    service: 'IASevero',
    generatedAt: new Date().toISOString(),
    sourceOfTruth: 'runtime-brain-matrix',
    operational: supervision.operational,
    operationalScore: supervision.operationalScore,
    globalState: supervision.globalState,
    recommendation: supervision.recommendation,
    metrics,
    snapshots: {
      total: snapshots.length,
      latest,
    },
    supervision,
    causalTrace,
    operationalMemory,
  }
}
