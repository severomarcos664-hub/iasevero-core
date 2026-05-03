export function normalizeText(text: string) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(text: string) {
  return normalizeText(text)
    .split(' ')
    .filter(w => w.length > 2)
}

function similarity(a: string, b: string) {
  const A = new Set(tokens(a))
  const B = new Set(tokens(b))

  if (!A.size || !B.size) return 0

  let common = 0
  for (const x of A) {
    if (B.has(x)) common++
  }

  return common / Math.max(A.size, B.size)
}

const INTENTS: Record<string, string[]> = {
  'identity.creator': [
    'quem te criou',
    'quem criou voce',
    'quem desenvolveu voce',
    'qual seu criador',
    'quem e seu criador',
    'quem fez voce',
    'quem criou a iasevero'
  ],

  'concept.humility': [
    'o que e humildade',
    'explique humildade',
    'ser humilde',
    'defina humildade'
  ],

  'ops.cost': [
    'reduzir custo',
    'custo zero',
    'gastar menos',
    'economizar api',
    'api cara',
    'api ta cara',
    'ta caro usar api',
    'gastando muito',
    'custo alto',
    'diminuir gastos',
    'evitar cobranca'
  ],

  'ops.security': [
    'token vazou',
    'chave vazou',
    'secret vazou',
    'vazou minha chave',
    'vazou token',
    'problema de seguranca',
    'proteger sistema',
    'expor token'
  ],

  'ops.deploy': [
    'fazer deploy',
    'subir sistema',
    'publicar sistema',
    'cloud run',
    'colocar online',
    'subir para producao'
  ],

  'ops.diagnostic': [
    'erro no build',
    'build quebrou',
    'erro next',
    'bug no sistema',
    'deu erro',
    'falha no sistema',
    'sistema travou'
  ]
}

export function detectSemanticIntent(text: string): string | null {
  let bestIntent: string | null = null
  let bestScore = 0

  for (const [intent, examples] of Object.entries(INTENTS)) {
    for (const example of examples) {
      const score = similarity(text, example)
      if (score > bestScore) {
        bestScore = score
        bestIntent = intent
      }
    }
  }

  return bestScore >= 0.34 ? bestIntent : null
}
