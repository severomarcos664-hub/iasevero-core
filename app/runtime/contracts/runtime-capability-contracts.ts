export type RuntimeCapability =
  | 'observe'
  | 'analyze'
  | 'govern'
  | 'execute'
  | 'recover'
  | 'route'
  | 'validate'
  | 'persist'

export interface RuntimeContract {
  module: string
  layer: string
  capabilities: RuntimeCapability[]
  forbidden: RuntimeCapability[]
}

export const RUNTIME_CONTRACTS: RuntimeContract[] = [
  {
    module: 'runtime-governor',
    layer: 'governance',
    capabilities: ['govern', 'validate'],
    forbidden: ['execute']
  },
  {
    module: 'runtime-telemetry',
    layer: 'observability',
    capabilities: ['observe'],
    forbidden: ['execute', 'recover']
  },
  {
    module: 'runtime-recovery',
    layer: 'autonomy',
    capabilities: ['recover'],
    forbidden: ['govern']
  }
]
