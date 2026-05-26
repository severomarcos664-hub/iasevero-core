export type RuntimeNeuralState =
  | 'synchronized'
  | 'adaptive'
  | 'stabilizing'
  | 'protected'

export type RuntimeNeuralMode =
  | 'coordination'
  | 'adaptation'
  | 'stabilization'
  | 'protection'

export interface RuntimeNeuralCoordinationReport {
  coordinationId: string

  createdAt: string

  source: string

  neuralState: RuntimeNeuralState
  neuralMode: RuntimeNeuralMode

  runtimeStable: boolean
  runtimeProtected: boolean

  synchronizationLevel: number
  cognitionIntensity: number

  consensusRatio: number
  queueUtilization: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
