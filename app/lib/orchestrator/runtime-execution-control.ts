import type { RuntimeContext } from './runtime-context'

export type RuntimeExecutionControlResult = {
  allowed: boolean
  timeoutMs: number
  maxRetries: number
  budgetAllowed: boolean
  reason: string
}

export function evaluateExecutionControl(
  context: RuntimeContext
): RuntimeExecutionControlResult {

  if (!context.stable) {
    return {
      allowed: false,
      timeoutMs: 1000,
      maxRetries: 0,
      budgetAllowed: false,
      reason: 'Runtime instável.'
    }
  }

  if (context.safeMode) {
    return {
      allowed: true,
      timeoutMs: 3000,
      maxRetries: 1,
      budgetAllowed: false,
      reason: 'Modo seguro ativo.'
    }
  }

  if (context.provider === 'local') {
    return {
      allowed: true,
      timeoutMs: 5000,
      maxRetries: 1,
      budgetAllowed: true,
      reason: 'Provider local controlado.'
    }
  }

  return {
    allowed: true,
    timeoutMs: 8000,
    maxRetries: 2,
    budgetAllowed: true,
    reason: 'Execução híbrida controlada.'
  }
}
