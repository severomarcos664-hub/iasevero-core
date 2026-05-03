import { detectSemanticIntent } from './nlp'
import { buildAnswer } from './answer'

export function fallbackLocal(text: string): string | null {
  const intent = detectSemanticIntent(text)
  if (!intent) return null
  return buildAnswer(intent, text)
}
