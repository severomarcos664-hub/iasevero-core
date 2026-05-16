import type { RuntimeContext } from './runtime-context'

export type RuntimeProviderGovernorResult = {
  providerLocked: boolean
  recommendedProvider: 'local' | 'hybrid' | 'openai'
  escalationLevel: 'low' | 'medium' | 'high'
  reason: string
}

export function evaluateProviderGovernor(
  context: RuntimeContext
): RuntimeProviderGovernorResult {

  if (!context.stable) {
    return {
      providerLocked: true,
      recommendedProvider: 'local',
      escalationLevel: 'high',
      reason: 'Runtime instável exige isolamento local.'
    }
  }

  if (context.safeMode) {
    return {
      providerLocked: true,
      recommendedProvider: 'local',
      escalationLevel: 'high',
      reason: 'SafeMode bloqueia provider externo.'
    }
  }

  if (context.provider === 'local') {
    return {
      providerLocked: false,
      recommendedProvider: 'local',
      escalationLevel: 'low',
      reason: 'Provider local operacional.'
    }
  }

  if (context.provider === 'hybrid') {
    return {
      providerLocked: false,
      recommendedProvider: 'hybrid',
      escalationLevel: 'medium',
      reason: 'Provider híbrido controlado.'
    }
  }

  return {
    providerLocked: false,
    recommendedProvider: 'openai',
    escalationLevel: 'medium',
    reason: 'Provider externo supervisionado.'
  }
}
