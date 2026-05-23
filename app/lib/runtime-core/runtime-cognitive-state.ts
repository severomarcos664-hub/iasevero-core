import { evaluateRuntimeAwareness } from '../orchestrator/runtime-awareness'
import { evaluateRuntimeRecovery } from '../orchestrator/runtime-recovery'
import { analyzeRuntimeIntelligence } from '../orchestrator/runtime-intelligence'
import { evaluateRuntimeCognitiveGateway } from './runtime-cognitive-gateway'

export type RuntimeCognitiveState = {
  generatedAt: string

  pressure: number
  confidence: number

  stability: number

  degradationRisk: 'low' | 'medium' | 'high'

  cognitiveState:
    | 'stable'
    | 'focused'
    | 'degrading'
    | 'overloaded'
    | 'critical'

  operationalMode:
    | 'normal'
    | 'safe'
    | 'containment'
    | 'recovery'

  recommendation: string

  reasoning: string[]
}

export function evaluateRuntimeCognitiveState(): RuntimeCognitiveState {
  const awareness = evaluateRuntimeAwareness({
    runtimePressure: 80,
    providerPressure: 70,
    memoryPressure: 90,
    executionPressure: 75,

    degradationState: false,

    runtimeHealth: 'warning',

    recoveryMode: false,

    warnings: [
      'memory-pressure-high',
      'recovery-frequency-high'
    ],

    heartbeatAt: new Date().toISOString()
  })

  const recovery = evaluateRuntimeRecovery(awareness)

  const intelligence = analyzeRuntimeIntelligence([])

  const gateway = evaluateRuntimeCognitiveGateway()

  const pressure =
    Math.min(
      100,
      Math.floor(
        (
          awareness.healthScore +
          intelligence.recoveryFrequency +
          (gateway.riskLevel === 'high' ? 90 : 40)
        ) / 3
      )
    )

  const confidence =
    Math.max(
      5,
      100 -
      Math.floor(
        (
          intelligence.recoveryFrequency +
          (recovery.recoveryMode ? 40 : 0)
        ) / 2
      )
    )

  const stability =
    Math.max(
      5,
      100 - pressure
    )

  const degradationRisk =
    pressure >= 80
      ? 'high'
      : pressure >= 50
        ? 'medium'
        : 'low'

  const cognitiveState =
    pressure >= 90
      ? 'critical'
      : pressure >= 75
        ? 'overloaded'
        : pressure >= 55
          ? 'degrading'
          : confidence >= 80
            ? 'focused'
            : 'stable'

  const operationalMode =
    recovery.recoveryMode
      ? 'recovery'
      : gateway.operationalMode

  const reasoning = [
    `pressure:${pressure}`,
    `confidence:${confidence}`,
    `stability:${stability}`,
    `risk:${degradationRisk}`,
    `gateway:${gateway.operationalMode}`
  ]

  const recommendation =
    cognitiveState === 'critical'
      ? 'Runtime exige isolamento operacional imediato.'
      : cognitiveState === 'overloaded'
        ? 'Runtime deve reduzir pressão cognitiva.'
        : cognitiveState === 'degrading'
          ? 'Runtime requer estabilização supervisionada.'
          : 'Runtime operando normalmente.'

  return {
    generatedAt: new Date().toISOString(),
    pressure,
    confidence,
    stability,
    degradationRisk,
    cognitiveState,
    operationalMode,
    recommendation,
    reasoning
  }
}
