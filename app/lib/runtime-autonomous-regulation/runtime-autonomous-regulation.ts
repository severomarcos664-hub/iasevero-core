export type RuntimeRegulationMode =
  | 'performance'
  | 'adaptive'
  | 'stabilization'
  | 'protection'

export type RuntimeRegulationAction =
  | 'increase-throughput'
  | 'maintain'
  | 'reduce-load'
  | 'activate-protection'

export interface RuntimeAutonomousRegulationReport {
  regulationId: string

  createdAt: string

  source: string

  regulationMode: RuntimeRegulationMode
  regulationAction: RuntimeRegulationAction

  runtimeStable: boolean
  runtimeProtected: boolean

  operationalPressure: number
  runtimeIntensity: number

  queueUtilization: number
  consensusRatio: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
