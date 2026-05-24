import {
  evaluateRuntimeOperationalMode,
} from '@/app/lib/runtime-operational/runtime-operational-mode-switcher'

export function evaluateRuntimeTrustEngine() {
  const operational = evaluateRuntimeOperationalMode()

  const integrityScore =
    operational.unifiedScore >= 95 ? 100 : 80

  const runtimeTrusted =
    operational.runtimeStable &&
    integrityScore >= 95

  const trustLevel =
    runtimeTrusted
      ? 'maximum'
      : integrityScore >= 80
        ? 'elevated'
        : 'restricted'

  const executionAuthorization =
    trustLevel !== 'restricted'

  return {
    trustId: `trust_${Date.now()}`,
    createdAt: new Date().toISOString(),

    source: 'runtime-trust-engine',

    integrityScore,
    trustLevel,

    runtimeTrusted,
    executionAuthorization,

    recommendation:
      runtimeTrusted
        ? 'Runtime fully trusted for autonomous execution.'
        : 'Runtime operating under restricted trust.',

    reasoning: [
      `score:${operational.unifiedScore}`,
      `integrity:${integrityScore}`,
      `trust:${trustLevel}`,
      `stable:${operational.runtimeStable}`,
      `authorized:${executionAuthorization}`,
    ],
  }
}
