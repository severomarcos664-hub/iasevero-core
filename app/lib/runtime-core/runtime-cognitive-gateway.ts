import { buildRuntimeUnifiedContext } from './runtime-unified-context'
import type { RuntimeProvider, RuntimeRiskLevel } from './runtime-contracts'

export type RuntimeCognitiveDecision = {
  generatedAt: string
  source: 'runtime-cognitive-gateway'
  operationalMode: 'normal' | 'safe' | 'recovery' | 'containment'
  provider: RuntimeProvider
  riskLevel: RuntimeRiskLevel
  allowExternal: boolean
  throttleRequests: boolean
  cooldownMs: number
  reasoning: string[]
  recommendation: string
}

export function evaluateRuntimeCognitiveGateway(): RuntimeCognitiveDecision {
  const context = buildRuntimeUnifiedContext()
  const reasoning: string[] = []

  if (!context.operational) reasoning.push('runtime-not-operational')
  if (context.globalState === 'critical') reasoning.push('global-critical')
  if (context.globalState === 'warning') reasoning.push('global-warning')
  if (context.operationalScore < 70) reasoning.push('low-operational-score')

  const memory = context.brain.operationalMemory

  if (memory.riskTrend === 'high') reasoning.push('memory-risk-high')
  if (memory.stabilityTrend === 'degrading') reasoning.push('stability-degrading')
  if (memory.recoveryFrequency >= 70) reasoning.push('recovery-frequency-high')

  const riskLevel: RuntimeRiskLevel =
    reasoning.includes('global-critical') || reasoning.includes('memory-risk-high')
      ? 'high'
      : reasoning.length > 0
        ? 'medium'
        : 'low'

  const operationalMode =
    riskLevel === 'high'
      ? 'containment'
      : riskLevel === 'medium'
        ? 'safe'
        : 'normal'

  const provider: RuntimeProvider =
    riskLevel === 'high'
      ? 'local'
      : riskLevel === 'medium'
        ? 'hybrid'
        : 'hybrid'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-cognitive-gateway',
    operationalMode,
    provider,
    riskLevel,
    allowExternal: riskLevel === 'low',
    throttleRequests: riskLevel !== 'low',
    cooldownMs: riskLevel === 'high' ? 15000 : riskLevel === 'medium' ? 3000 : 0,
    reasoning,
    recommendation:
      riskLevel === 'high'
        ? 'Gateway recomenda contenção operacional e provider local.'
        : riskLevel === 'medium'
          ? 'Gateway recomenda modo seguro com throttling.'
          : 'Gateway libera operação normal supervisionada.',
  }
}
