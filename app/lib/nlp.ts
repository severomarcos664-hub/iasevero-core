export function normalizeText(text: string) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasAny(text: string, terms: string[]) {
  const n = normalizeText(text)
  return terms.some(term => n.includes(normalizeText(term)))
}

export function detectSemanticIntent(text: string): string | null {
  const n = normalizeText(text)

  if (
    hasAny(n, ['quem te criou', 'quem criou voce', 'seu criador', 'qual seu criador', 'quem desenvolveu voce'])
  ) return 'identity.creator'

  if (
    hasAny(n, ['humildade', 'ser humilde', 'o que e humildade'])
  ) return 'concept.humility'

  if (
    hasAny(n, ['reduzir custo', 'custo zero', 'gastar menos', 'economizar api', 'api cara'])
  ) return 'ops.cost'

  if (
    hasAny(n, ['token vazou', 'chave vazou', 'secret vazou', 'expor token', 'seguranca'])
  ) return 'ops.security'

  if (
    hasAny(n, ['deploy', 'subir sistema', 'cloud run', 'publicar sistema'])
  ) return 'ops.deploy'

  if (
    hasAny(n, ['erro no build', 'build quebrou', 'erro next', 'bug no sistema', 'falha'])
  ) return 'ops.diagnostic'

  return null
}
