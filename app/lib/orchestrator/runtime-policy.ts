import type { RuntimeContext } from './runtime-context'

export type RuntimePolicyDecision = {
  allowed: boolean
  reason: string
  severity: 'low' | 'medium' | 'high'
  forceSafeMode: boolean
  allowExternal: boolean
}

export function evaluateRuntimePolicy(
  context: RuntimeContext
): RuntimePolicyDecision {
  if (context.safeMode) {
    return {
      allowed: true,
      reason: 'Runtime em safeMode: execução permitida apenas em modo seguro.',
      severity: 'low',
      forceSafeMode: true,
      allowExternal: false
    }
  }

  if (context.allowExternal) {
    return {
      allowed: false,
      reason: 'Provider externo bloqueado pela política local-first.',
      severity: 'high',
      forceSafeMode: true,
      allowExternal: false
    }
  }

  return {
    allowed: true,
    reason: 'RuntimePolicy aprovada em modo local.',
    severity: 'low',
    forceSafeMode: false,
    allowExternal: false
  }
}
