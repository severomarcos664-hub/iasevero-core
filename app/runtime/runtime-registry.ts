export type RuntimeModule = {
  name: string
  active: boolean
  critical: boolean
}

export const runtimeRegistry: RuntimeModule[] = [
  {
    name: 'runtime-conscious-loop',
    active: true,
    critical: true
  },
  {
    name: 'runtime-decision-engine',
    active: true,
    critical: true
  },
  {
    name: 'runtime-telemetry',
    active: true,
    critical: false
  },
  {
    name: 'runtime-self-healing',
    active: true,
    critical: false
  }
]
