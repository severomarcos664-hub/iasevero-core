import { contextSummary } from './context'

export function smartContext(userId: string) {
  const raw = contextSummary(userId)

  if (!raw) return ""

  const lower = raw.toLowerCase()

  let insights: string[] = []

  if (lower.includes('api')) {
    insights.push('Usuário preocupado com custo de API')
  }

  if (lower.includes('erro')) {
    insights.push('Usuário enfrentando erro técnico')
  }

  if (lower.includes('memoria') || lower.includes('contexto')) {
    insights.push('Usuário interessado em memória e contexto')
  }

  return insights.join(' | ')
}
