export type RuntimeAwarenessLevel =
  | 'optimal'
  | 'stable'
  | 'elevated'
  | 'critical'

export type RuntimeAwarenessAction =
  | 'maintain'
  | 'adapt'
  | 'stabilize'
  | 'contain'

export interface RuntimeAwarenessMatrixReport {
  awarenessId: string

  createdAt: string

  source: string

  awarenessLevel: RuntimeAwarenessLevel
  awarenessAction: RuntimeAwarenessAction

  runtimeStable: boolean
  runtimeProtected: boolean

  queueUtilization: number
  consensusRatio: number

  executionPriority: string
  executionRoute: string

  recommendation: string
  reasoning: string[]
}
