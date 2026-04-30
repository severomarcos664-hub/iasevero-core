import { logUnknown, tryLearned, teach, listMemory } from '../learning'

export async function localProvider(message: string) {
  const text = message.trim()
  const m = text.toLowerCase()

  if (!text) return 'Entrada vazia.'

  const learned = tryLearned(text)
  if (learned) return learned

  if (m.startsWith('ensinar:')) {
    const [q, r] = text.replace('ensinar:', '').split('=>')

    if (q && r) {
      teach(q.trim(), r.trim())
      return 'Aprendido.'
    }

    return 'Formato: ensinar: pergunta => resposta'
  }

  if (m === 'memoria') {
    return JSON.stringify(listMemory(), null, 2)
  }

  logUnknown(text)

  return 'Não sei ainda.'
}
