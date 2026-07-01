import { buildSystemContext, improveLocalAnswer } from './response-quality'

export type DecisionInput = {
  message: string
  facts: Record<string, string>
  history: string
}

export function classifyIntent(message: string) {
  const msg = message.toLowerCase()

  if (msg.includes('erro') || msg.includes('bug') || msg.includes('falhou')) return 'diagnostic'
  if (msg.includes('custo') || msg.includes('api cara') || msg.includes('zero cost')) return 'cost-control'
  if (msg.includes('comando') || msg.includes('shell') || msg.includes('terminal')) return 'shell-execution'
  if (msg.includes('git') || msg.includes('commit') || msg.includes('tag') || msg.includes('push')) return 'version-control'
  if (msg.includes('arquitetura') || msg.includes('runtime') || msg.includes('módulo')) return 'architecture'
  if (msg.includes('memória') || msg.includes('memory') || msg.includes('qual meu nome') || msg.includes('meu nome?')) return 'memory-query'
  if (msg.includes('planejar') || msg.includes('plano') || msg.includes('roadmap')) return 'planning'

  return 'general'
}

export function buildDecision(input: DecisionInput) {
  const intent = classifyIntent(input.message)

  const context = buildSystemContext(
    input.message,
    input.facts,
    input.history
  )

  return {
    intent,
    context,
    rules: [
      'Responder com precisão.',
      'Priorizar segurança operacional.',
      'Evitar comandos destrutivos.',
      'Usar comandos numerados quando houver Shell.',
      'Manter foco em zero custo quando aplicável.',
      'Preservar arquitetura existente antes de criar novos módulos.'
    ]
  }
}

export function validateDecisionAnswer(message: string, answer: string) {
  return improveLocalAnswer(message, answer)
}
