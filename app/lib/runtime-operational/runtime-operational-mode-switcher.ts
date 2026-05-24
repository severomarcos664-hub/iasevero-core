import {
  evaluateUnifiedRuntimeIntelligence,
} from '@/app/lib/runtime-unified/runtime-unified-intelligence-bus'

export function evaluateRuntimeOperationalMode() {
  const unified = evaluateUnifiedRuntimeIntelligence()

  const operationalMode =
    unified.unifiedMode === 'protected-runtime'
      ? 'safe-protection'
      : unified.unifiedScore >= 95
        ? 'maximum-performance'
        : unified.unifiedScore >= 80
          ? 'balanced-runtime'
          : 'recovery-runtime'

  const executionProfile =
    operationalMode === 'maximum-performance'
      ? 'high-throughput'
      : operationalMode === 'balanced-runtime'
        ? 'balanced-execution'
        : operationalMode === 'safe-protection'
          ? 'restricted-execution'
          : 'stabilization-execution'

  return {
    modeId: `mode_${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-operational-mode-switcher',

    unifiedScore: unified.unifiedScore,

    operationalMode,
    executionProfile,

    runtimeStable:
      operationalMode !== 'recovery-runtime',

    recommendation:
      operationalMode === 'maximum-performance'
        ? 'Runtime operating at maximum orchestration performance.'
        : operationalMode === 'balanced-runtime'
          ? 'Balanced runtime execution active.'
          : operationalMode === 'safe-protection'
            ? 'Protected runtime execution active.'
            : 'Runtime stabilization mode active.',

    reasoning: [
      `score:${unified.unifiedScore}`,
      `mode:${operationalMode}`,
      `profile:${executionProfile}`,
      `trusted:${unified.runtimeTrusted}`,
    ],
  }
}
