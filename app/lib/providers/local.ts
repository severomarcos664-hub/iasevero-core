import { logUnknown, tryLearned, teach, approve, listMemory } from '../learning'
import { detectIntent } from '../router'

function smartReply(message: string, intent: string) {
  const m = message.toLowerCase()

  if (intent === 'diagnostic') {
    if (m.includes('build')) return 'Erro no build detectado. Rode: rm -rf .next && npm run build'
    if (m.includes('next')) return 'Problema com Next.js. Verifique dependências e rode npm install'
    return 'Erro detectado. Execute: ./verify_iasevero.sh'
  }

  if (intent === 'cost') {
    if (m.includes('api')) return 'Evite APIs externas. Use provider local.'
    if (m.includes('cloud')) return 'Evite deploy contínuo. Use apenas quando necessário.'
    return 'Modo custo zero ativo: manter tudo local.'
  }

  if (intent === 'deploy') {
    if (m.includes('cloud run')) return 'Para Cloud Run: build OK + docker OK + deploy controlado.'
    return 'Deploy detectado. Valide build, segurança e rollback.'
  }

  if (intent === 'security') {
    if (m.includes('token')) return 'Token exposto é risco crítico. Revogue imediatamente.'
    return 'Segurança detectada. Nunca exponha secrets.'
  }

  return null
}

export async function localProvider(message: string) {
  const text = (message || '').trim()

  if (!text) return 'Entrada vazia.'

  const intent = detectIntent(text)

  if (intent === 'learn') {
    const [q, r] = text.replace('ensinar:', '').split('=>')
    if (q && r) {
      teach(q.trim(), r.trim())
      return `Registrado. Use: aprovar: ${q.trim()}`
    }
    return 'Formato: ensinar: pergunta => resposta'
  }

  if (intent === 'approve') {
    const q = text.replace('aprovar:', '').trim()
    return approve(q) ? `Aprovado: ${q}` : 'Não encontrado.'
  }

  if (intent === 'memory') {
    return JSON.stringify(listMemory(), null, 2)
  }

  const learned = tryLearned(text)
  if (learned) return learned

  const dynamic = smartReply(text, intent)
  if (dynamic) return dynamic

  logUnknown(text)
  return 'Ainda não sei isso. Posso aprender se você usar: ensinar: pergunta => resposta'
}
