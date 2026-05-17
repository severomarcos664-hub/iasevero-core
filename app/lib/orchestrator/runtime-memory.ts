import type { RuntimeContext } from './runtime-context'

export type RuntimeMemoryState = {
  memoryEnabled: boolean
  memoryMode: 'isolated' | 'session' | 'persistent'
  contextWindow: number
  summaryRequired: boolean
  reason: string
}

export function evaluateRuntimeMemory(
  context: RuntimeContext
): RuntimeMemoryState {
  if (!context.stable) {
    return {
      memoryEnabled: false,
      memoryMode: 'isolated',
      contextWindow: 2,
      summaryRequired: false,
      reason: 'Runtime instável.'
    }
  }

  if (context.safeMode) {
    return {
      memoryEnabled: true,
      memoryMode: 'isolated',
      contextWindow: 4,
      summaryRequired: false,
      reason: 'SafeMode restringe memória.'
    }
  }

  if (context.provider === 'local') {
    return {
      memoryEnabled: true,
      memoryMode: 'session',
      contextWindow: 12,
      summaryRequired: false,
      reason: 'Provider local com memória expandida.'
    }
  }

  return {
    memoryEnabled: true,
    memoryMode: 'persistent',
    contextWindow: 24,
    summaryRequired: true,
    reason: 'Memória persistente supervisionada.'
  }
}
