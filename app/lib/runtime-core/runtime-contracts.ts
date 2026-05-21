export type RuntimeGlobalState =
  | 'stable'
  | 'warning'
  | 'critical'

export type RuntimeRiskLevel =
  | 'low'
  | 'medium'
  | 'high'

export type RuntimeProvider =
  | 'local'
  | 'hybrid'
  | 'openai'
  | string

export type RuntimeMode =
  | 'local'
  | 'hybrid'
  | 'openai'
  | 'recovery'
  | string

export type RuntimeStabilizationLevel =
  | 'stable'
  | 'adaptive'
  | 'containment'
  | string

export type RuntimeMemoryMode =
  | 'protected'
  | 'isolated'
  | 'session'
  | 'persistent'
  | string

export type RuntimeBaseEvent = {
  id: string
  type: string
  timestamp: string
  severity?: RuntimeRiskLevel
  source?: string
  message?: string
  payload?: Record<string, unknown>
}

export type RuntimeSnapshotContract = {
  timestamp: string
  stable: boolean
  provider: RuntimeProvider
  mode: RuntimeMode
  awareness: string
  recovery: boolean
  stabilization: RuntimeStabilizationLevel
  memoryMode: RuntimeMemoryMode
}

export type RuntimeSupervisorContract = {
  operational: boolean
  globalState: RuntimeGlobalState
  operationalScore: number
  recommendation: string
}
