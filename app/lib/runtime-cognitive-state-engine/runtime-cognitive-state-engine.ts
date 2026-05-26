export type RuntimeCognitiveState =
  | 'optimal'
  | 'adaptive'
  | 'stabilizing'
  | 'protected'
  | 'critical'

export type RuntimeCognitiveMode =
  | 'execute'
  | 'adapt'
  | 'stabilize'
  | 'protect'

export interface RuntimeCognitiveStateReport {
  cognitionId: string

  createdAt: string

  source: string

  cognitiveState: RuntimeCognitiveState
  cognitiveMode: RuntimeCognitiveMode

  runtimeStable: boolean
  runtimeProtected: boolean

  queueUtilization: number
  consensusRatio: number

  executionPriority: string
  executionRoute: string

  operationalPressure: number
  runtimeIntensity: number

  recommendation: string
  reasoning: string[]
}
