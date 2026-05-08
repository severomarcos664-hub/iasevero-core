export function localBrain(message: string, facts: Record<string, string>): string | null {
  const msg = message.toLowerCase()

  if (msg.includes('qual meu nome') || msg.includes('meu nome?')) {
    return facts.nome
      ? `Seu nome registrado é ${facts.nome}.`
      : 'Ainda não tenho seu nome salvo na memória local.'
  }

  if (msg.includes('custo') || msg.includes('api cara')) {
    return 'Controle de custo ativo. Prioridade: execução local, limite de chamadas externas, cache e validação antes de qualquer integração paga.'
  }

  if (msg.includes('erro') || msg.includes('bug') || msg.includes('falhou')) {
    return 'Erro detectado. Próximo passo seguro: parar processos duplicados, limpar .next, rodar build e validar logs antes de alterar código.'
  }

  return null
}
