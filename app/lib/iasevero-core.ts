function clean(message: string) {
  return String(message || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function detectIntent(message: string) {
  const msg = clean(message)

  if (msg.includes('erro') || msg.includes('bug') || msg.includes('falha'))
    return 'diagnostico'

  if (msg.includes('custo') || msg.includes('gasto') || msg.includes('zero'))
    return 'custo'

  if (msg.includes('seguranca') || msg.includes('token') || msg.includes('chave'))
    return 'seguranca'

  if (msg.includes('deploy') || msg.includes('cloud'))
    return 'deploy'

  if (msg.includes('quem te criou') || msg.includes('criador'))
    return 'identidade'

  return 'geral'
}

export function iaseveroCore(message: string, memory: string[] = []) {
  const msg = clean(message)
  const intent = detectIntent(msg)

  const contextoArray = (memory || []).slice(-5)

  // 🔥 CONTAR ERROS NO HISTÓRICO
  const eventosErro = contextoArray.filter(m =>
    m.includes('erro') || m.includes('bug') || m.includes('falha')
  ).length

  // 🔥 CONTAR REPETIÇÃO NA MENSAGEM ATUAL
  const palavrasErro = (msg.match(/erro/g) || []).length

  let reply = ''

  if (intent === 'diagnostico') {

    // ✅ CASO 1 — usuário só repetiu palavra
    if (palavrasErro >= 3 && eventosErro === 0) {
      reply = 'Entrada repetitiva detectada. Nenhum erro real identificado.'
    }

    // ✅ CASO 2 — pouco histórico
    else if (eventosErro === 0) {
      reply = 'Diagnóstico: erro isolado. Ação: verificar logs e entrada.'
    }

    // ✅ CASO 3 — recorrente leve
    else if (eventosErro <= 2) {
      reply = 'Erro recorrente leve. Ação: revisar última alteração.'
    }

    // ✅ CASO 4 — recorrente real
    else if (eventosErro <= 4) {
      reply = 'Erro recorrente. Ação: revisar fluxo e dependências.'
    }

    // ✅ CASO 5 — só aqui vira estrutural
    else {
      reply = 'Falha estrutural confirmada. Ação: rollback + análise completa.'
    }
  }

  else if (intent === 'custo') {
    reply = 'Modo custo zero ativo: execução local.'
  }

  else if (intent === 'seguranca') {
    reply = 'Segurança ativa: nunca exponha tokens.'
  }

  else if (intent === 'deploy') {
    reply = 'Deploy bloqueado até validação completa.'
  }

  else if (intent === 'identidade') {
    reply = 'IASevero foi criada por Marcos Julio Severo.'
  }

  else {
    reply = 'IASevero analisando: ' + message
  }

  return {
    intent,
    reply
  }
}
