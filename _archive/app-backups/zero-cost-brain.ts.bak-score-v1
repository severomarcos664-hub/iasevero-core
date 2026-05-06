export type Intent = 'cost' | 'debug' | 'memory' | 'deploy' | 'guide' | 'identity' | 'general'

const responseCache = new Map<string, string>()

export function classifyIntent(message: string): Intent {
  const m = message.toLowerCase()

  if (m.includes('quem te criou') || m.includes('criador') || m.includes('dono')) return 'identity'
  if (m.includes('api') || m.includes('custo') || m.includes('caro') || m.includes('gastar')) return 'cost'
  if (m.includes('erro') || m.includes('bug') || m.includes('falha') || m.includes('quebrou')) return 'debug'
  if (m.includes('memória') || m.includes('memoria') || m.includes('contexto') || m.includes('lembr')) return 'memory'
  if (m.includes('deploy') || m.includes('cloud run') || m.includes('build')) return 'deploy'
  if (m.includes('como') || m.includes('fazer') || m.includes('próximo') || m.includes('proximo') || m.includes('agora')) return 'guide'

  return 'general'
}

export function getCachedResponse(message: string): string | null {
  return responseCache.get(message.toLowerCase().trim()) || null
}

export function saveCachedResponse(message: string, response: string) {
  responseCache.set(message.toLowerCase().trim(), response)
}

export function localIntelligence(message: string, context: string): string | null {
  const cached = getCachedResponse(message)
  if (cached) return cached

  const intent = classifyIntent(message)
  const m = message.toLowerCase()
  const c = context.toLowerCase()

  let response: string | null = null

  if ((m.includes('e agora') || m.includes('o que faço') || m.includes('proximo') || m.includes('próximo')) && c.includes('api')) {
    response = 'Você mencionou custo de API. Próximo passo recomendado: manter provider local ativo, evitar API externa em testes, usar cache e só liberar IA avançada com limite diário de custo.'
  } else if (intent === 'cost') {
    response = 'Modo custo zero ativo. Estratégia: usar provider local primeiro, evitar APIs externas em testes, cachear respostas úteis e só ativar inteligência avançada com limite diário.'
  } else if (intent === 'debug') {
    response = 'Diagnóstico técnico: verifique logs, rode build, confirme imports, valide rotas e só avance depois que o erro estiver isolado.'
  } else if (intent === 'memory') {
    response = context || 'Memória ativa, mas ainda sem contexto suficiente para resumir.'
  } else if (intent === 'deploy') {
    response = 'Deploy seguro: validar build local primeiro, manter Cloud Run com min instances 0 e evitar serviços com custo fixo.'
  }

  if (response) saveCachedResponse(message, response)

  return response
}
