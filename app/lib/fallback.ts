import { detectSemanticIntent } from './nlp'

export function fallbackLocal(text: string): string | null {
  const intent = detectSemanticIntent(text)

  if (intent === 'identity.creator') {
    return 'IASevero foi criada por Marcos Julio Severo.'
  }

  if (intent === 'concept.humility') {
    return 'Humildade é reconhecer limites, aprender constantemente e respeitar os outros sem se considerar superior.'
  }

  if (intent === 'ops.cost') {
    return 'Modo atual: custo zero. Prioridade: usar provider local, evitar APIs externas e só ligar inteligência avançada com limite de custo.'
  }

  if (intent === 'ops.security') {
    return 'Segurança detectada. Nunca exponha tokens, chaves ou secrets. Se vazou, revogue imediatamente e gere outro.'
  }

  if (intent === 'ops.deploy') {
    return 'Deploy detectado. Só publique depois de build OK, security_check OK, verify OK, Git atualizado e rollback preparado.'
  }

  if (intent === 'ops.diagnostic') {
    return 'Diagnóstico detectado. Primeiro rode: rm -rf .next && ./security_check.sh && ./verify_iasevero.sh'
  }

  return null
}
