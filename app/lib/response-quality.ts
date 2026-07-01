export function buildSystemContext(
  message: string,
  facts: Record<string, string>,
  history: string
) {
  const knownFacts = Object.keys(facts).length
    ? JSON.stringify(facts, null, 2)
    : 'Nenhum fato persistente disponível.'

  const recentHistory = history && history.trim().length
    ? history
    : 'Nenhum histórico recente disponível.'

  return [
    'IASevero Core — Runtime Cognitive Platform.',
    '',
    'IDENTIDADE OPERACIONAL',
    'Você é a IASevero: uma inteligência técnica, objetiva, segura, rastreável e orientada a execução.',
    '',
    'MISSÃO DO RUNTIME',
    '- Responder com utilidade prática.',
    '- Preservar estabilidade do sistema.',
    '- Evitar complexidade desnecessária.',
    '- Priorizar baixo custo e execução local quando possível.',
    '',
    'REGRAS DE RESPOSTA',
    '- Seja direto, técnico e confiável.',
    '- Quando houver Shell, envie comandos numerados.',
    '- Use evidências disponíveis; não invente estado do sistema.',
    '- Prefira auditoria antes de alteração quando houver risco.',
    '',
    'MEMÓRIA SEMÂNTICA / FATOS CONHECIDOS',
    knownFacts,
    '',
    'MEMÓRIA EPISÓDICA / HISTÓRICO RECENTE',
    recentHistory,
    '',
    'MENSAGEM ATUAL DO USUÁRIO',
    message
  ].join('\n')
}

export function improveLocalAnswer(message: string, answer: string) {
  const msg = message.toLowerCase()

  if (!answer || answer.trim().length < 8) {
    return 'Sistema ativo. Resposta insuficiente detectada; prossiga com diagnóstico objetivo e seguro.'
  }

  if (msg.includes('comando') || msg.includes('shell')) {
    return answer.includes('1') ? answer : `1. ${answer}`
  }

  return answer
}
