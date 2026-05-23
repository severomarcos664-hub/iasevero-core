import {
  evaluateRuntimeRiskEscalation,
} from './runtime-risk-escalation-intelligence'

export type RuntimeConfidenceLevel =
  | 'maximum'
  | 'high'
  | 'moderate'
  | 'low'
  | 'critical'

export type RuntimeConfidenceReport = {
  confidenceId: string
  createdAt: string
  source: 'runtime-confidence-intelligence'
  confidenceLevel: RuntimeConfidenceLevel
  confidenceScore: number
  executionTrusted: boolean
  degradationRecommended: boolean
  containmentRecommended: boolean
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeConfidence():
RuntimeConfidenceReport {

  const escalation =
    evaluateRuntimeRiskEscalation()

  const confidenceScore =
    escalation.containmentRequired
      ? 20
      : escalation.escalationLevel === 'critical'
        ? 35
        : escalation.escalationLevel === 'elevated'
          ? 60
          : escalation.escalationLevel === 'monitoring'
            ? 80
            : escalation.confidenceScore

  const confidenceLevel: RuntimeConfidenceLevel =
    confidenceScore >= 95
      ? 'maximum'
      : confidenceScore >= 80
        ? 'high'
        : confidenceScore >= 60
          ? 'moderate'
          : confidenceScore >= 35
            ? 'low'
            : 'critical'

  return {
    confidenceId: `confidence_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-confidence-intelligence',

    confidenceLevel,
    confidenceScore,

    executionTrusted:
      confidenceScore >= 80 &&
      !escalation.containmentRequired,

    degradationRecommended:
      confidenceScore < 80 &&
      confidenceScore >= 35,

    containmentRecommended:
      confidenceScore < 35 ||
      escalation.containmentRequired,

    recommendation:
      confidenceLevel === 'maximum'
        ? 'Runtime confidence maximum: execution fully trusted.'
        : confidenceLevel === 'high'
          ? 'Runtime confidence high: execution trusted with monitoring.'
          : confidenceLevel === 'moderate'
            ? 'Runtime confidence moderate: degradation recommended.'
            : confidenceLevel === 'low'
              ? 'Runtime confidence low: recovery or degradation required.'
              : 'Runtime confidence critical: containment required.',

    reasoning: [
      ...escalation.reasoning,
      `confidence:${confidenceScore}`,
      `level:${confidenceLevel}`,
      `trusted:${confidenceScore >= 80}`,
    ],
  }
}
