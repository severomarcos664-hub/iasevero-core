import { evaluateRuntimePredictiveStabilization } from './runtime-predictive-stabilization'
import { evaluateRuntimeSeverityGovernance } from './runtime-severity-governance'
import { RuntimeActionType } from './runtime-action-engine'

export type RuntimePolicyDecision = {
  generatedAt: string
  source: 'runtime-policy-engine'
  allowed: boolean
  requiredAction: RuntimeActionType
  policyLevel: 'normal' | 'observe' | 'preventive' | 'restricted' | 'critical'
  reason: string
  reasoning: string[]
}

export function evaluateRuntimePolicy(): RuntimePolicyDecision {
  const severity = evaluateRuntimeSeverityGovernance()
  const predictive = evaluateRuntimePredictiveStabilization()

  const policyLevel =
    severity.severityLevel === 'containment' || predictive.predictiveRisk === 'high'
      ? 'critical'
      : severity.severityLevel === 'critical'
        ? 'restricted'
        : predictive.predictiveRisk === 'moderate'
          ? 'preventive'
          : severity.severityLevel === 'observe' || severity.severityLevel === 'warning'
            ? 'observe'
            : 'normal'

  const requiredAction: RuntimeActionType =
    policyLevel === 'critical'
      ? 'contain'
      : policyLevel === 'restricted'
        ? 'recover'
        : policyLevel === 'preventive'
          ? 'stabilize'
          : policyLevel === 'observe'
            ? 'observe'
            : 'observe'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-policy-engine',
    allowed: policyLevel !== 'critical',
    requiredAction,
    policyLevel,
    reason:
      policyLevel === 'critical'
        ? 'Política crítica exige contenção operacional.'
        : policyLevel === 'restricted'
          ? 'Política restrita exige recuperação controlada.'
          : policyLevel === 'preventive'
            ? 'Política preventiva exige estabilização.'
            : policyLevel === 'observe'
              ? 'Política exige observação ampliada.'
              : 'Política normal permite operação.',
    reasoning: [
      ...severity.reasoning,
      ...predictive.reasoning,
      `policy:${policyLevel}`,
      `requiredAction:${requiredAction}`,
    ],
  }
}
