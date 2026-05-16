import type { RuntimeContext } from './runtime-context'

export type RuntimeBudgetResult = {
  allowed: boolean
  providerBudgetAllowed: boolean
  estimatedCostLevel: 'low' | 'medium' | 'high'
  reason: string
}

export function evaluateRuntimeBudget(
  context: RuntimeContext
): RuntimeBudgetResult {

  if (context.safeMode) {
    return {
      allowed: true,
      providerBudgetAllowed: false,
      estimatedCostLevel: 'low',
      reason: 'Modo seguro bloqueia provider externo.'
    }
  }

  if (context.provider === 'local') {
    return {
      allowed: true,
      providerBudgetAllowed: true,
      estimatedCostLevel: 'low',
      reason: 'Provider local com baixo custo.'
    }
  }

  if (context.provider === 'hybrid') {
    return {
      allowed: true,
      providerBudgetAllowed: true,
      estimatedCostLevel: 'medium',
      reason: 'Provider híbrido controlado.'
    }
  }

  return {
    allowed: true,
    providerBudgetAllowed: true,
    estimatedCostLevel: 'high',
    reason: 'Provider externo permitido.'
  }
}
