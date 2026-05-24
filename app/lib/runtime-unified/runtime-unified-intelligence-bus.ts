import { evaluateRuntimeConfidence } from '@/app/lib/runtime-core/runtime-confidence-intelligence'
import { evaluateRuntimeRiskEscalation } from '@/app/lib/runtime-core/runtime-risk-escalation-intelligence'
import { evaluateRuntimeAdaptiveIntelligence } from '@/app/lib/runtime-adaptive/runtime-adaptive-intelligence-engine'

export function evaluateUnifiedRuntimeIntelligence() {
  const confidence = evaluateRuntimeConfidence()
  const escalation = evaluateRuntimeRiskEscalation()
  const adaptive = evaluateRuntimeAdaptiveIntelligence()

  const unifiedScore = Math.round(
    (
      confidence.confidenceScore +
      adaptive.operationalScore
    ) / 2
  )

  const unifiedMode =
    escalation.escalationLevel === 'critical'
      ? 'protected-runtime'
      : adaptive.adaptiveMode

  return {
    unifiedId: `unified_${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-unified-intelligence-bus',

    unifiedScore,
    unifiedMode,

    runtimeTrusted:
      confidence.executionTrusted &&
      escalation.operationalRisk === 'low',

    recommendation:
      unifiedMode === 'protected-runtime'
        ? 'Protected runtime mode enabled.'
        : 'Unified runtime operating normally.',

    reasoning: [
      `confidence:${confidence.confidenceLevel}`,
      `risk:${escalation.operationalRisk}`,
      `adaptive:${adaptive.adaptiveMode}`,
      `score:${unifiedScore}`,
      `mode:${unifiedMode}`,
    ],
  }
}
