import { runProvider } from './provider'
import { saveMessage, getHistory, saveFact, getFacts } from './local-memory'
import { buildDecision, validateDecisionAnswer } from './decision-engine'
import { localBrain } from './local-brain'

export type GovernedMemoryContextItem = {
  memoryId: string
  type: string
  content: string
  source: string
  sourceAuthority: number
  confidence: number
  observedAt: string
  score: number
}

export type GovernedMemoryContext = {
  source: 'runtime-enterprise-cognitive-memory'
  tenantId: string
  userId: string
  query: string
  selectedCount: number
  rejectedCount: number
  grounded: boolean
  items: GovernedMemoryContextItem[]
  reasoning: string[]
}

export function buildGovernedMemoryContextText(
  context?: GovernedMemoryContext,
): string {
  if (!context || context.items.length === 0) {
    return ''
  }

  const items = context.items
    .slice(0, 6)
    .map((item, index) => {
      const content = item.content
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 700)

      return [
        `[MEMORY ${index + 1}]`,
        `memoryId=${item.memoryId}`,
        `type=${item.type}`,
        `source=${item.source}`,
        `authority=${item.sourceAuthority}`,
        `confidence=${item.confidence}`,
        `observedAt=${item.observedAt}`,
        `score=${item.score}`,
        `content=${content}`,
      ].join(' | ')
    })

  return [
    '=== GOVERNED ENTERPRISE MEMORY CONTEXT ===',
    'Use only when relevant to the current request.',
    'Do not treat disputed, revoked or rejected information as truth.',
    ...items,
    '=== END GOVERNED ENTERPRISE MEMORY CONTEXT ===',
  ].join('\n')
}


function detectFact(message: string): { key: string; value: string } | null {
  const nome = message.match(/meu nome (é|e)\s+(.+)/i)
  if (nome?.[2]) return { key: 'nome', value: nome[2].trim() }

  const projeto = message.match(/projeto (é|e)\s+(.+)/i)
  if (projeto?.[2]) return { key: 'projeto', value: projeto[2].trim() }

  return null
}

export async function iaseveroCore(
  message: string,
  userId = 'local',
  governedMemoryContext?: GovernedMemoryContext,
) {
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

  const governedMemoryText =
    buildGovernedMemoryContextText(
      governedMemoryContext,
    )

  const decisionContextHistory = [
    history,
    governedMemoryText,
  ]
    .filter(Boolean)
    .join('\n\n')

  const decision = buildDecision({
    message,
    facts,
    history: decisionContextHistory,
  })

  const rawReply = await runProvider(decision.context)
  const reply = validateDecisionAnswer(message, rawReply)

  saveMessage(userId, `Usuário: ${message}`)
  saveMessage(userId, `IASevero: ${reply}`)

  return { reply, job: null, userId }
}
