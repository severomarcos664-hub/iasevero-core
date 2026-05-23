import {
  evaluateRuntimeAdaptiveExecution,
} from './runtime-adaptive-execution-engine'

export type RuntimeResilienceStrategy =
  | 'continue'
  | 'retry'
  | 'fallback'
  | 'degrade'
  | 'abort'

export type RuntimeResilienceReport = {
  resilienceId: string
  createdAt: string
  source: 'runtime-resilience-engine'
  strategy: RuntimeResilienceStrategy
  retryAllowed: boolean
  fallbackAllowed: boolean
  abortRequired: boolean
  cooldownMs: number
  maxRetries: number
  recommendation: string
  reasoning: string[]
}

export function evaluateRuntimeResilience():
RuntimeResilienceReport {

  const adaptive = evaluateRuntimeAdaptiveExecution()

  const strategy: RuntimeResilienceStrategy =
    !adaptive.executionAllowed
      ? 'abort'
      : adaptive.strategy === 'retry'
        ? 'retry'
        : adaptive.strategy === 'stabilize'
          ? 'degrade'
          : adaptive.adaptationRequired
            ? 'fallback'
            : 'continue'

  return {
    resilienceId: `resilience_${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-resilience-engine',

    strategy,

    retryAllowed:
      strategy === 'retry' ||
      strategy === 'fallback',

    fallbackAllowed:
      strategy === 'fallback' ||
      strategy === 'degrade',

    abortRequired:
      strategy === 'abort',

    cooldownMs:
      strategy === 'continue'
        ? 0
        : strategy === 'retry'
          ? 1000
          : strategy === 'fallback'
            ? 2000
            : strategy === 'degrade'
              ? 3000
              : 5000,

    maxRetries:
      strategy === 'retry'
        ? 3
        : strategy === 'fallback'
          ? 2
          : strategy === 'degrade'
            ? 1
            : 0,

    recommendation:
      strategy === 'continue'
        ? 'Resilience approved: continue execution.'
        : strategy === 'retry'
          ? 'Resilience recommends controlled retry.'
          : strategy === 'fallback'
            ? 'Resilience recommends fallback path.'
            : strategy === 'degrade'
              ? 'Resilience recommends degraded safe mode.'
              : 'Resilience requires abort.',

    reasoning: [
      ...adaptive.reasoning,
      `adaptiveStrategy:${adaptive.strategy}`,
      `resilienceStrategy:${strategy}`,
      `retryAllowed:${strategy === 'retry' || strategy === 'fallback'}`,
      `fallbackAllowed:${strategy === 'fallback' || strategy === 'degrade'}`,
    ],
  }
}
