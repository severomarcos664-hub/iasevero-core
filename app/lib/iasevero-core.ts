import { runProvider } from './provider'
import { saveMessage, getHistory, saveFact, getFacts } from './local-memory'
import { buildDecision, validateDecisionAnswer } from './decision-engine'
import { localBrain } from './local-brain'

function detectFact(message: string): { key: string; value: string } | null {
  const nome = message.match(/meu nome (é|e)\s+(.+)/i)
  if (nome?.[2]) return { key: 'nome', value: nome[2].trim() }

  const projeto = message.match(/projeto (é|e)\s+(.+)/i)
  if (projeto?.[2]) return { key: 'projeto', value: projeto[2].trim() }

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
  const decision = buildDecision({ message, facts, history })

  const rawReply = await runProvider(decision.context)
  const reply = validateDecisionAnswer(message, rawReply)

  saveMessage(userId, `Usuário: ${message}`)
  saveMessage(userId, `IASevero: ${reply}`)

  return { reply, job: null, userId }
}
