export type RuntimeHealth =
  | 'healthy'
  | 'warning'
  | 'degraded'
  | 'critical'

export type RuntimeStateRegistry = {
  runtimeHealth: RuntimeHealth
  runtimePressure: number
  providerPressure: number
  memoryPressure: number
  executionPressure: number
  degradationState: boolean
  recoveryMode: boolean
  warnings: string[]
  heartbeatAt: string
}

let runtimeRegistry: RuntimeStateRegistry = {
  runtimeHealth: 'healthy',
  runtimePressure: 0,
  providerPressure: 0,
  memoryPressure: 0,
  executionPressure: 0,
  degradationState: false,
  recoveryMode: false,
  warnings: [],
  heartbeatAt: new Date().toISOString()
}

export function getRuntimeRegistry(): RuntimeStateRegistry {
  return runtimeRegistry
}

export function updateRuntimeRegistry(
  partial: Partial<RuntimeStateRegistry>
): RuntimeStateRegistry {

  runtimeRegistry = {
    ...runtimeRegistry,
    ...partial,
    heartbeatAt: new Date().toISOString()
  }

  return runtimeRegistry
}

export function appendRuntimeWarning(
  warning: string
): RuntimeStateRegistry {

  runtimeRegistry = {
    ...runtimeRegistry,
    warnings: [
      ...runtimeRegistry.warnings,
      warning
    ].slice(-50),
    heartbeatAt: new Date().toISOString()
  }

  return runtimeRegistry
}
