import { evaluateRuntimePolicy } from './runtime-policy-engine'
import { evaluateRuntimePredictiveStabilization } from './runtime-predictive-stabilization'
import { evaluateRuntimeSeverityGovernance } from './runtime-severity-governance'
import { superviseRuntimeLanes } from './runtime-lane-supervisor'
import { scheduleRuntimeExecution } from './runtime-adaptive-scheduler'

export type RuntimeGovernanceDecision =
  | 'NORMAL_OPERATION'
  | 'STABILIZATION_REQUIRED'
  | 'THROTTLING_REQUIRED'
  | 'CONTAINMENT_REQUIRED'
  | 'RECOVERY_REQUIRED'

export type RuntimeGovernanceCenterReport = {
  generatedAt: string
  source: 'runtime-governance-center'
  decision: RuntimeGovernanceDecision
  allowExecution: boolean
  recommendedAction: string
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeGovernanceCenter():
RuntimeGovernanceCenterReport {

  const severity = evaluateRuntimeSeverityGovernance()
  const predictive = evaluateRuntimePredictiveStabilization()
  const policy = evaluateRuntimePolicy()
  const lanes = superviseRuntimeLanes()
  const schedule = scheduleRuntimeExecution()

  const decision: RuntimeGovernanceDecision =
    severity.containmentRequired || lanes.isolationRecommended
      ? 'CONTAINMENT_REQUIRED'
      : policy.requiredAction === 'recover'
        ? 'RECOVERY_REQUIRED'
        : lanes.throttlingRecommended
          ? 'THROTTLING_REQUIRED'
          : predictive.preventiveAction
            ? 'STABILIZATION_REQUIRED'
            : 'NORMAL_OPERATION'

  const riskLevel =
    decision === 'CONTAINMENT_REQUIRED'
      ? 'critical'
      : decision === 'RECOVERY_REQUIRED' || decision === 'THROTTLING_REQUIRED'
        ? 'high'
        : decision === 'STABILIZATION_REQUIRED'
          ? 'moderate'
          : 'low'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-governance-center',

    decision,

    allowExecution:
      decision !== 'CONTAINMENT_REQUIRED',

    recommendedAction:
      policy.requiredAction,

    riskLevel,

    recommendation:
      decision === 'CONTAINMENT_REQUIRED'
        ? 'Governance Center recomenda contenção imediata.'
        : decision === 'RECOVERY_REQUIRED'
          ? 'Governance Center recomenda recuperação operacional.'
          : decision === 'THROTTLING_REQUIRED'
            ? 'Governance Center recomenda throttling operacional.'
            : decision === 'STABILIZATION_REQUIRED'
              ? 'Governance Center recomenda estabilização preventiva.'
              : 'Governance Center aprova operação normal.',

    reasoning: [
      ...severity.reasoning,
      ...predictive.reasoning,
      ...policy.reasoning,
      ...lanes.reasoning,
      ...schedule.reasoning,
      `decision:${decision}`,
      `risk:${riskLevel}`,
    ],
  }
}
