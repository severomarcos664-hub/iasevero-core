import {
  evaluateRuntimeTemporalDrift,
} from './runtime-temporal-drift-intelligence'

import {
  evaluateRuntimeDecisionFusion,
} from './runtime-decision-fusion-engine'

export type RuntimeCriticalityLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'

export type RuntimeExecutionCriticalityReport = {
  criticalityId: string
  createdAt: string
  source: 'runtime-execution-criticality-intelligence'
  criticalityLevel: RuntimeCriticalityLevel
  executionSafe: boolean
  requiresReview: boolean
  requiresContainment: boolean
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeExecutionCriticality():
RuntimeExecutionCriticalityReport {

  const drift = evaluateRuntimeTemporalDrift()
  const fusion = evaluateRuntimeDecisionFusion()

  const criticalityLevel: RuntimeCriticalityLevel =
    fusion.containmentRequired || drift.driftLevel === 'high'
      ? 'critical'
      : fusion.degradationRequired || drift.degradationRisk
        ? 'high'
        : fusion.overallScore < 85
          ? 'medium'
          : 'low'

  return {
    criticalityId: `criticality_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-execution-criticality-intelligence',

    criticalityLevel,
    executionSafe: criticalityLevel === 'low',
    requiresReview:
      criticalityLevel === 'medium' ||
      criticalityLevel === 'high',
    requiresContainment:
      criticalityLevel === 'critical',

    recommendation:
      criticalityLevel === 'low'
        ? 'Execution criticality low: continue runtime operation.'
        : criticalityLevel === 'medium'
          ? 'Execution criticality medium: monitor execution carefully.'
          : criticalityLevel === 'high'
            ? 'Execution criticality high: degradation/review recommended.'
            : 'Execution criticality critical: containment required.',

    reasoning: [
      ...drift.reasoning,
      ...fusion.reasoning,
      `criticality:${criticalityLevel}`,
    ],
  }
}
