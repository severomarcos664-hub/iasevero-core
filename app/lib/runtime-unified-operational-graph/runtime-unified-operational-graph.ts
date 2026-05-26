export type RuntimeOperationalTopology =
  | 'stable-topology'
  | 'adaptive-topology'
  | 'protected-topology'
  | 'critical-topology'

export type RuntimeOperationalFlow =
  | 'synchronized-flow'
  | 'adaptive-flow'
  | 'protected-flow'
  | 'restricted-flow'

export interface RuntimeUnifiedOperationalGraphReport {
  graphId: string

  createdAt: string

  source: string

  operationalTopology: RuntimeOperationalTopology
  operationalFlow: RuntimeOperationalFlow

  runtimeStable: boolean
  runtimeProtected: boolean

  coherenceLevel: number
  synchronizationStrength: number

  cognitionIntensity: number
  awarenessIntensity: number

  operationalPressure: number
  runtimeIntensity: number

  consensusRatio: number
  queueUtilization: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
