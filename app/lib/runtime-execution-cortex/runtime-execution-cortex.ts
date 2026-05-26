export type RuntimeCortexState =
  | 'fully-operational'
  | 'adaptive-runtime'
  | 'controlled-runtime'
  | 'throttled-runtime'
  | 'containment-runtime'

export type RuntimeCortexMode =
  | 'execute'
  | 'adapt'
  | 'stabilize'
  | 'contain'

export interface RuntimeExecutionCortexReport {
  cortexId: string

  createdAt: string

  source: string

  cortexState: RuntimeCortexState
  cortexMode: RuntimeCortexMode

  executionConsensus: boolean
  runtimeProtected: boolean
  pipelineStable: boolean

  executionPriority: string
  executionRoute: string

  queueUtilization: number
  consensusRatio: number

  recommendation: string
  reasoning: string[]
}
