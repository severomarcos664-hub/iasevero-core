import type { RuntimeContext } from './runtime-context'
import type { RuntimeGovernanceDecision } from './runtime-governor'

export type RuntimeEnforcementResult = {
  allowed: boolean
  reason: string
  severity: 'low' | 'medium' | 'high'
}

export function enforceRuntimeExecution(
  context: RuntimeContext,
  governance: RuntimeGovernanceDecision
): RuntimeEnforcementResult {

  if (!governance.executable) {
    return {
      allowed: false,
      reason: 'Governance bloqueou execução.',
      severity: governance.severity
    }
  }

  if (context.safeMode && context.provider !== 'local') {
    return {
      allowed: false,
      reason: 'safeMode exige provider local.',
      severity: 'high'
    }
  }

  if (!context.stable) {
    return {
      allowed: false,
      reason: 'Runtime instável.',
      severity: 'medium'
    }
  }

  return {
    allowed: true,
    reason: 'RuntimeEnforcement aprovado.',
    severity: 'low'
  }
}
