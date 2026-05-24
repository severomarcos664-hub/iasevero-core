import {
  evaluateUnifiedRuntimeIntelligence,
} from '@/app/lib/runtime-unified/runtime-unified-intelligence-bus'

import {
  evaluateRuntimeConsciousnessIntegration,
} from '@/app/lib/runtime-consciousness-integration/runtime-consciousness-integration'

export function evaluateRuntimeCognitiveArbitration() {
  const unified =
    evaluateUnifiedRuntimeIntelligence()

  const consciousness =
    evaluateRuntimeConsciousnessIntegration()

  const arbitrationScore =
    Math.round(
      (
        unified.unifiedScore +
        (consciousness.integratedExecution ? 100 : 40)
      ) / 2
    )

  const runtimeGlobalMode =
    arbitrationScore >= 95
      ? 'cognitive-orchestration'
      : arbitrationScore >= 80
        ? 'adaptive-orchestration'
        : 'restricted-orchestration'

  const executionConsensus =
    unified.runtimeTrusted &&
    consciousness.integratedExecution

  return {
    arbitrationId: `arbitration-${Date.now()}`,
    createdAt: new Date().toISOString(),

    source:
      'runtime-cognitive-arbitration-engine',

    arbitrationScore,

    runtimeGlobalMode,

    executionConsensus,

    cognitiveStable:
      runtimeGlobalMode !==
      'restricted-orchestration',

    recommendation:
      executionConsensus
        ? 'Runtime cognitive arbitration fully synchronized.'
        : 'Runtime arbitration operating under restrictions.',

    reasoning: [
      `score:${arbitrationScore}`,
      `mode:${runtimeGlobalMode}`,
      `consensus:${executionConsensus}`,
      `trusted:${unified.runtimeTrusted}`,
    ],
  }
}
