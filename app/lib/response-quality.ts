export function buildSystemContext(message: string, facts: Record<string, string>, history: string) {
  return [
    'IASevero Core: resposta técnica, objetiva, segura e útil.',
    'Prioridades: precisão, zero custo, não quebrar fluxo, comandos numerados quando houver Shell.',
    `Fatos conhecidos: ${JSON.stringify(facts)}`,
    history ? `Histórico recente:\n${history}` : '',
    `Mensagem atual:\n${message}`
  ].filter(Boolean).join('\n\n')
}

export function improveLocalAnswer(message: string, answer: string) {
  const msg = message.toLowerCase()

  if (!answer || answer.trim().length < 8) {
    return 'Sistema ativo. Resposta insuficiente detectada; prossiga com diagnóstico objetivo e seguro.'
  }

  if (msg.includes('comando') || msg.includes('shell')) {
    return answer.includes('1️⃣') ? answer : `1️⃣ ${answer}`
  }

  return answer
}
