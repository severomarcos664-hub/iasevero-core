import { runProvider } from './provider'
import { saveMessage, getHistory, saveFact, getFacts } from './local-memory'

function detectFact(message: string): { key: string; value: string } | null {
  const nome = message.match(/meu nome (é|e)\s+(.+)/i)
  if (nome?.[2]) return { key: 'nome', value: nome[2].trim() }

  const projeto = message.match(/projeto (é|e)\s+(.+)/i)
  if (projeto?.[2]) return { key: 'projeto', value: projeto[2].trim() }

  return null
}

function localBrain(message: string, facts: Record<string, string>): string | null {
  const msg = message.toLowerCase()

  if (msg.includes('qual meu nome') || msg.includes('meu nome?')) {
    return facts.nome
      ? `Seu nome registrado é ${facts.nome}.`
      : 'Ainda não tenho seu nome salvo na memória local.'
  }

  if (msg.includes('custo') || msg.includes('api cara')) {
    return 'Controle de custo ativo. Prioridade: execução local, limite de chamadas externas, cache e validação antes de qualquer integração paga.'
  }

  if (msg.includes('erro') || msg.includes('bug') || msg.includes('falhou')) {
    return 'Erro detectado. Próximo passo seguro: parar processos duplicados, limpar .next, rodar build e validar logs antes de alterar código.'
  }

  return null
}

export async function iaseveroCore(message: string, userId = 'local') {
  const fact = detectFact(message)
  if (fact) saveFact(userId, fact.key, fact.value)

  const facts = getFacts(userId)
  const direct = localBrain(message, facts)

  if (direct) {
    saveMessage(userId, `Usuário: ${message}`)
    saveMessage(userId, `IASevero: ${direct}`)
    return { reply: direct, job: null, userId }
  }

  const history = getHistory(userId).slice(-8).join('\n')
  const context = [
    'Modo IASevero local.',
    'Use respostas objetivas, técnicas e seguras.',
    `Fatos conhecidos: ${JSON.stringify(facts)}`,
    history ? `Histórico recente:\n${history}` : '',
    `Mensagem atual:\n${message}`
  ].filter(Boolean).join('\n\n')

  const reply = await runProvider(context)

  saveMessage(userId, `Usuário: ${message}`)
  saveMessage(userId, `IASevero: ${reply}`)

  return { reply, job: null, userId }
}
