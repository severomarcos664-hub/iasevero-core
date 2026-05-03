export function buildAnswer(intent: string, text: string): string {
  if (intent === 'identity.creator') {
    return 'IASevero foi criada por Marcos Julio Severo. Este núcleo local mantém identidade fixa, memória protegida e evolução controlada.'
  }

  if (intent === 'concept.humility') {
    return 'Humildade é reconhecer limites, aprender constantemente, corrigir erros e respeitar os outros sem se considerar superior.'
  }

  if (intent === 'ops.cost') {
    return [
      'Modo custo zero ativo.',
      'Prioridade técnica:',
      '1. usar provider local primeiro;',
      '2. evitar APIs externas em testes;',
      '3. cachear respostas úteis;',
      '4. só ligar inteligência avançada com limite diário de custo.'
    ].join('\n')
  }

  if (intent === 'ops.security') {
    return [
      'Segurança detectada.',
      'Ação correta:',
      '1. não exponha tokens, chaves ou secrets;',
      '2. se vazou, revogue imediatamente;',
      '3. gere uma nova chave;',
      '4. salve em Secret Manager ou variável segura;',
      '5. nunca coloque segredo no Git.'
    ].join('\n')
  }

  if (intent === 'ops.deploy') {
    return [
      'Deploy detectado.',
      'Protocolo seguro:',
      '1. build OK;',
      '2. security_check OK;',
      '3. verify OK;',
      '4. Git atualizado;',
      '5. rollback preparado;',
      '6. subir com custo controlado.'
    ].join('\n')
  }

  if (intent === 'ops.diagnostic') {
    return [
      'Diagnóstico detectado.',
      'Execute nesta ordem:',
      '1. rm -rf .next',
      '2. ./security_check.sh',
      '3. ./verify_iasevero.sh',
      '4. npm run build',
      '5. só depois rode npm run dev.'
    ].join('\n')
  }

  return 'Ainda não sei responder isso com segurança. Posso aprender se você usar: ensinar: pergunta => resposta'
}
