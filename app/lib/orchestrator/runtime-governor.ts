import type { RuntimeContext } from './runtime-context'
import type { RuntimePolicyDecision } from './runtime-policy'

export type RuntimeGovernanceDecision = {
  executable: boolean
  providerAllowed: boolean
  safeModeRequired: boolean
  reason: string
  severity: RuntimePolicyDecision['severity']
}

export function evaluateRuntimeGovernance(
  context: RuntimeContext,
  policy: RuntimePolicyDecision
): RuntimeGovernanceDecision {
  if (!policy.allowed) {
    return {
      executable: false,
      providerAllowed: false,
      safeModeRequired: true,
      reason: policy.reason,
      severity: policy.severity
    }
  }

  if (context.allowExternal && !policy.allowExternal) {
    return {
      executable: false,
      providerAllowed: false,
      safeModeRequired: true,
      reason: 'Governance bloqueou provider externo.',
      severity: 'high'
    }
  }

  return {
    executable: true,
    providerAllowed: context.provider === 'local',
    safeModeRequired: policy.forceSafeMode,
    reason: 'RuntimeGovernance aprovado.',
    severity: policy.severity
  }
}
