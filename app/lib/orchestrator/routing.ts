import { resolveRuntimeDecision } from './runtime'

export type ProviderRoute = {
  provider: 'local' | 'openai' | 'hybrid'
  allowExternal: boolean
  reason: string
}

export function resolveProviderRoute(intent = 'general'): ProviderRoute {
  const runtime = resolveRuntimeDecision()

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
