export type RuntimeLayer =
  | 'core'
  | 'governance'
  | 'execution'
  | 'budget'
  | 'provider'
  | 'memory'
  | 'state'
  | 'awareness'
  | 'recovery'
  | 'incidents'
  | 'stabilization'
  | 'telemetry'
  | 'snapshot'
  | 'intelligence'
  | 'policy'

export type RuntimeArchitectureModule = {
  name: string
  file: string
  layer: RuntimeLayer
  responsibility: string
  status: 'stable' | 'foundation' | 'legacy'
}

export const runtimeArchitectureIndex: RuntimeArchitectureModule[] = [
  {
    name: 'RuntimeDecisionEngine',
    file: 'runtime-decision-engine.ts',
    layer: 'core',
    responsibility: 'orquestrar o fluxo principal do runtime',
    status: 'stable'
  },
  {
    name: 'RuntimeContext',
    file: 'runtime-context.ts',
    layer: 'core',
    responsibility: 'manter contexto transitório da execução atual',
    status: 'stable'
  },
  {
    name: 'RuntimePolicy',
    file: 'runtime-policy.ts',
    layer: 'governance',
    responsibility: 'avaliar política baseada no contexto runtime',
    status: 'stable'
  },
  {
    name: 'RuntimeIntelligencePolicy',
    file: 'runtime-policy-engine.ts',
    layer: 'policy',
    responsibility: 'aplicar política baseada em inteligência histórica',
    status: 'foundation'
  },
  {
    name: 'RuntimeBudgetControl',
    file: 'runtime-budget-control.ts',
    layer: 'budget',
    responsibility: 'controlar risco de custo e provider externo',
    status: 'stable'
  },
  {
    name: 'RuntimeProviderGovernor',
    file: 'runtime-provider-governor.ts',
    layer: 'provider',
    responsibility: 'governar provider recomendado e bloqueios',
    status: 'stable'
  },
  {
    name: 'RuntimeMemory',
    file: 'runtime-memory.ts',
    layer: 'memory',
    responsibility: 'governar modo de memória e janela de contexto',
    status: 'stable'
  },
  {
    name: 'RuntimeStateRegistry',
    file: 'runtime-state-registry.ts',
    layer: 'state',
    responsibility: 'registrar health, pressure, warnings e heartbeat',
    status: 'stable'
  },
  {
    name: 'RuntimeAwareness',
    file: 'runtime-awareness.ts',
    layer: 'awareness',
    responsibility: 'calcular health score e severidade operacional',
    status: 'stable'
  },
  {
    name: 'RuntimeRecovery',
    file: 'runtime-recovery.ts',
    layer: 'recovery',
    responsibility: 'gerar plano de recuperação e cooldown',
    status: 'stable'
  },
  {
    name: 'RuntimeIncidents',
    file: 'runtime-incidents.ts',
    layer: 'incidents',
    responsibility: 'registrar incidentes e histórico operacional',
    status: 'stable'
  },
  {
    name: 'RuntimeAutonomousStabilizer',
    file: 'runtime-autonomous-stabilizer.ts',
    layer: 'stabilization',
    responsibility: 'avaliar estabilização autônoma e containment',
    status: 'stable'
  },
  {
    name: 'RuntimeTelemetry',
    file: 'runtime-telemetry.ts',
    layer: 'telemetry',
    responsibility: 'registrar snapshots de telemetria em memória',
    status: 'stable'
  },
  {
    name: 'RuntimeSnapshot',
    file: 'runtime-snapshot.ts',
    layer: 'snapshot',
    responsibility: 'persistir snapshots operacionais locais',
    status: 'stable'
  },
  {
    name: 'RuntimeIntelligence',
    file: 'runtime-intelligence.ts',
    layer: 'intelligence',
    responsibility: 'analisar histórico e calcular risco de degradação',
    status: 'stable'
  }
]

export function getRuntimeArchitectureIndex() {
  return runtimeArchitectureIndex
}
