import type { RuntimeAwareness } from './runtime-awareness'
import type { RuntimeRecoveryPlan } from './runtime-recovery'

export type RuntimeAutonomousState = {
  stabilizationLevel: 'stable' | 'adaptive' | 'containment'
  cooldownMultiplier: number
  providerEscalation: boolean
  containmentRequired: boolean
  stabilizationScore: number
  reason: string
}

export function evaluateAutonomousStabilization(
  awareness: RuntimeAwareness,
  recovery: RuntimeRecoveryPlan
): RuntimeAutonomousState {

  if (awareness.severity === 'critical') {
    return {
      stabilizationLevel: 'containment',
      cooldownMultiplier: 3,
      providerEscalation: false,
      containmentRequired: true,
      stabilizationScore: 20,
      reason: 'Containment obrigatório.'
    }
  }

  if (awareness.severity === 'high') {
    return {
      stabilizationLevel: 'adaptive',
      cooldownMultiplier: 2,
      providerEscalation: false,
      containmentRequired: false,
      stabilizationScore: 45,
      reason: 'Alta pressão operacional.'
    }
  }

  if (awareness.severity === 'medium') {
    return {
      stabilizationLevel: 'adaptive',
      cooldownMultiplier: 1.2,
      providerEscalation: true,
      containmentRequired: false,
      stabilizationScore: 72,
      reason: 'Runtime moderadamente pressionado.'
    }
  }

  return {
    stabilizationLevel: 'stable',
    cooldownMultiplier: 1,
    providerEscalation: true,
    containmentRequired: false,
    stabilizationScore: 96,
    reason: 'Runtime totalmente estável.'
  }
}
