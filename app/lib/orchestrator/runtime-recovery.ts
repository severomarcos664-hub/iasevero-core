import type { RuntimeAwareness } from './runtime-awareness'

export type RuntimeRecoveryPlan = {
  recoveryMode: boolean
  stabilizationRequired: boolean
  cooldownMs: number
  recommendedProvider: 'local' | 'hybrid' | 'openai'
  reason: string
}

export function evaluateRuntimeRecovery(
  awareness: RuntimeAwareness
): RuntimeRecoveryPlan {

  if (awareness.severity === 'critical') {
    return {
      recoveryMode: true,
      stabilizationRequired: true,
      cooldownMs: 15000,
      recommendedProvider: 'local',
      reason: 'Runtime crítico exige isolamento.'
    }
  }

  if (awareness.severity === 'high') {
    return {
      recoveryMode: true,
      stabilizationRequired: true,
      cooldownMs: 8000,
      recommendedProvider: 'local',
      reason: 'Alta pressão operacional.'
    }
  }

  if (awareness.severity === 'medium') {
    return {
      recoveryMode: false,
      stabilizationRequired: false,
      cooldownMs: 3000,
      recommendedProvider: 'hybrid',
      reason: 'Runtime moderadamente pressionado.'
    }
  }

  return {
    recoveryMode: false,
    stabilizationRequired: false,
    cooldownMs: 0,
    recommendedProvider: 'hybrid',
    reason: 'Runtime operacional estável.'
  }
}
