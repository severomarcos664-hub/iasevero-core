export type RuntimeSignalState =
  | 'stable'
  | 'adaptive'
  | 'warning'
  | 'critical'

export type RuntimeSignalAction =
  | 'maintain'
  | 'adapt'
  | 'stabilize'
  | 'contain'

export interface RuntimeSignalIntelligenceReport {
  signalId: string

  createdAt: string

  source: string

  signalState: RuntimeSignalState
  signalAction: RuntimeSignalAction

  runtimeStable: boolean
  runtimeProtected: boolean

  coherenceLevel: number
  synchronizationStrength: number

  operationalPressure: number
  runtimeIntensity: number

  cognitionIntensity: number
  awarenessIntensity: number

  propagationStrength: number

  signalClarity: number
  signalStability: number

  consensusRatio: number
  queueUtilization: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
