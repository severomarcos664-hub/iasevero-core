import { buildSystemContext, improveLocalAnswer } from './response-quality'

type DecisionInput = {
  message: string
  facts: Record<string, string>
  history: string
}

export function classifyIntent(message: string) {
  const msg = message.toLowerCase()

  if (msg.includes('erro') || msg.includes('bug') || msg.includes('falhou')) return 'diagnostic'
  if (msg.includes('custo') || msg.includes('api cara') || msg.includes('zero cost')) return 'cost_control'
  if (msg.includes('comando') || msg.includes('shell')) return 'shell_execution'
  if (msg.includes('qual meu nome') || msg.includes('meu nome?')) return 'memory_query'

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
      'Manter foco em zero custo quando aplicável.'
    ]
  }
}

export function validateDecisionAnswer(message: string, answer: string) {
  return improveLocalAnswer(message, answer)
}
