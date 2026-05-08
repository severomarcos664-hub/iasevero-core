import { resolveRuntimeDecision } from './runtime'
import { createEvent } from './events'
import { logEvent } from './event-logger'
import { evaluatePolicy } from './policy'

export type ProviderRoute = {
  provider: 'local' | 'openai' | 'hybrid'
  allowExternal: boolean
  reason: string
}

export function resolveProviderRoute(
  message = '',
  intent = 'general'
): ProviderRoute {
  const runtime = resolveRuntimeDecision()

logEvent(
  createEvent('routing', {
    provider: runtime.mode,
    risk: runtime.safe ? 'low' : 'medium',
    details: runtime.reason
  })
)
  const policy = evaluatePolicy(message)

  if (!policy.allowed) {
    return {
      provider: 'local',
      allowExternal: false,
      reason: policy.reason
    }
  }

  if (!runtime.allowExternal) {
    return {
      provider: 'local',
      allowExternal: false,
      reason: runtime.reason
    }
  }

  if (runtime.mode === 'openai') {
    return {
      provider: 'openai',
      allowExternal: true,
      reason: 'OpenAI autorizado por IASEVERO_MODE.'
    }
  }

  if (runtime.mode === 'hybrid') {
    return {
      provider: intent === 'cost' ? 'local' : 'hybrid',
      allowExternal: intent !== 'cost',
      reason: intent === 'cost'
        ? 'Intent de custo detectado; fallback local obrigatório.'
        : 'Modo híbrido autorizado.'
    }
  }

  return {
    provider: 'local',
    allowExternal: false,
    reason: 'Fallback seguro para provider local.'
  }
}
