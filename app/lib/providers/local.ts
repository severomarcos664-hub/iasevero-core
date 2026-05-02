import { fallbackLocal } from '../fallback'
import { fallbackLocal } from '../fallback'
import { fallbackLocal } from '../fallback'
import { hybridProvider } from './hybrid'
import { coreIdentity } from '../core-identity'
import { logUnknown, tryLearned, teach, approve, listMemory } from '../learning'
import { detectIntent } from '../router'

function smartReply(message: string, intent: string) {
  const m = message.toLowerCase()

  if (intent === 'diagnostic') {
    if (m.includes('build')) return 'Erro no build detectado. Rode: rm -rf .next && npm run build'
    if (m.includes('next')) return 'Problema com Next.js detectado. Verifique dependências e rode npm install.'
    return 'Erro detectado. Execute: ./security_check.sh && ./verify_iasevero.sh'
  }

  if (intent === 'cost') {
    if (m.includes('api')) return 'Evite APIs externas. Use provider local para manter custo zero.'
    return 'Modo custo zero ativo: manter local, sem API externa e sem deploy desnecessário.'
  }

  if (intent === 'deploy') {
    return 'Deploy detectado. Só subir com build OK, security_check OK, verify OK e rollback pronto.'
  }

  if (intent === 'security') {
    if (m.includes('token')) return 'Token exposto é risco crítico. Revogue imediatamente e gere outro.'
    return 'Segurança detectada. Nunca exponha tokens, chaves ou secrets.'
  }

  return null
}

function splitInput(text: string) {
  return text
    .split(/[?.!,;\n]+/)
    .map(p => p.trim())
    .filter(Boolean)
}

export async function localProvider(message: string) {
  const text = (message || '').trim()

  if (!text) return 'Entrada vazia.'

  const fixed = coreIdentity(text)
  if (fixed) return fixed

  const intent = detectIntent(text)

  if (intent === 'learn') {
    const [q, r] = text.replace('ensinar:', '').split('=>')
    if (q && r) {
      teach(q.trim(), r.trim())
      return `Registrado. Use: aprovar: ${q.trim()}`
    }
    return 'Formato correto: ensinar: pergunta => resposta'
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

  const fallback = fallbackLocal(text)
  if (fallback) return fallback

  for (const part of splitInput(text)) {
    const learnedPart = tryLearned(part)
    if (learnedPart) return learnedPart
  }

  const dynamic = smartReply(text, intent)
  if (dynamic) return dynamic

  logUnknown(text)
  return 'Ainda não sei isso. Posso aprender se você usar: ensinar: pergunta => resposta'
}
