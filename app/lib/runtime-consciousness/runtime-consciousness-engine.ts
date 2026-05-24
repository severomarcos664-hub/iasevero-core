import {
  evaluateRuntimeTrustEngine,
} from '@/app/lib/runtime-trust/runtime-trust-engine'

import {
  evaluateRuntimeOperationalMode,
} from '@/app/lib/runtime-operational/runtime-operational-mode-switcher'

export function evaluateRuntimeConsciousness() {
  const trust = evaluateRuntimeTrustEngine()
  const operational = evaluateRuntimeOperationalMode()

  const consciousnessLevel =
    trust.runtimeTrusted &&
    operational.operationalMode === 'maximum-performance'
      ? 'fully-aware'
      : operational.runtimeStable
        ? 'operational-aware'
        : 'restricted-awareness'

  const autonomousConsciousness =
    consciousnessLevel === 'fully-aware'

  const executionState =
    autonomousConsciousness
      ? 'autonomous-execution'
      : 'restricted-execution'

  return {
    consciousnessId: `consciousness_${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-consciousness-engine',

    consciousnessLevel,
    autonomousConsciousness,

    executionState,

    runtimeTrusted: trust.runtimeTrusted,
    operationalMode: operational.operationalMode,

    recommendation:
      autonomousConsciousness
        ? 'Runtime consciousness fully operational.'
        : 'Runtime consciousness operating under restriction.',

    reasoning: [
      `trust:${trust.runtimeTrusted}`,
      `mode:${operational.operationalMode}`,
      `consciousness:${consciousnessLevel}`,
      `execution:${executionState}`,
    ],
  }
}
