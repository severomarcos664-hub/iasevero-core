export type Intent = 'cost' | 'debug' | 'memory' | 'deploy' | 'guide' | 'identity' | 'general'

const responseCache = new Map<string, string>()

function norm(text: string) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function classifyIntent(message: string): Intent {
  const m = norm(message)

  const scores: Record<Intent, number> = {
    cost: 0,
    debug: 0,
    memory: 0,
    deploy: 0,
    guide: 0,
    identity: 0,
    general: 0
  }

  if (m.includes('quem te criou') || m.includes('criador') || m.includes('dono')) scores.identity += 5
  if (m.includes('api') || m.includes('custo') || m.includes('caro') || m.includes('gastar')) scores.cost += 4
  if (m.includes('erro') || m.includes('bug') || m.includes('falha') || m.includes('quebrou')) scores.debug += 4
  if (m.includes('memoria') || m.includes('contexto') || m.includes('lembr')) scores.memory += 4
  if (m.includes('deploy') || m.includes('cloud run') || m.includes('build') || m.includes('producao')) scores.deploy += 4
  if (m.includes('como') || m.includes('fazer') || m.includes('proximo') || m.includes('agora')) scores.guide += 3

  let best: Intent = 'general'
  for (const key of Object.keys(scores) as Intent[]) {
    if (scores[key] > scores[best]) best = key
  }

  return scores[best] > 0 ? best : 'general'
}

export function getCachedResponse(message: string): string | null {
  return responseCache.get(norm(message).trim()) || null
}

export function saveCachedResponse(message: string, response: string) {
  responseCache.set(norm(message).trim(), response)
}

export function localIntelligence(message: string, context: string): string | null {
  const cached = getCachedResponse(message)
  if (cached) return cached

  const intent = classifyIntent(message)
  const m = norm(message)
  const c = norm(context)

  let response: string | null = null

  if (intent === 'guide' && c.includes('api')) {
    response = 'Pelo contexto, você está lidando com custo de API. Ação recomendada: manter IASevero em modo local, usar cache, evitar testes com API externa e só ativar inteligência avançada com limite diário.'
  } else if (intent === 'cost') {
    response = 'Custo detectado. Estratégia correta: provider local primeiro, cache de respostas, testes sem API externa e ativação futura de IA avançada com limite de uso.'
  } else if (intent === 'debug') {
    response = 'Diagnóstico técnico: isole o erro, rode rm -rf .next, execute security_check, verify_iasevero e só depois npm run build.'
  } else if (intent === 'memory') {
    response = context || 'Memória ativa, mas ainda sem histórico suficiente.'
  } else if (intent === 'deploy') {
    response = 'Deploy seguro: build OK, security_check OK, verify OK, Git atualizado, rollback preparado e Cloud Run com min instances 0.'
  }

  if (response) saveCachedResponse(message, response)

  return response
}
