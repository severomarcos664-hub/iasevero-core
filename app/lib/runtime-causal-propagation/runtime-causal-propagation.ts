export type RuntimePropagationState =
  | 'stable'
  | 'adaptive'
  | 'propagating'
  | 'restricted'

export type RuntimePropagationMode =
  | 'synchronize'
  | 'adapt'
  | 'stabilize'
  | 'contain'

export interface RuntimeCausalPropagationReport {
  propagationId: string

  createdAt: string

  source: string

  propagationState: RuntimePropagationState
  propagationMode: RuntimePropagationMode

  runtimeStable: boolean
  runtimeProtected: boolean

  coherenceLevel: number
  synchronizationStrength: number

  operationalPressure: number
  runtimeIntensity: number

  cognitionIntensity: number
  awarenessIntensity: number

  propagationStrength: number
  propagationReach: number

  consensusRatio: number
  queueUtilization: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
