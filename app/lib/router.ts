export type IASeveroIntent =
  | 'identidade'
  | 'saudacao'
  | 'diagnostico'
  | 'arquitetura'
  | 'codigo'
  | 'seguranca'
  | 'geral'

export function detectIntentAdvanced(message: string): IASeveroIntent {
  const msg = String(message || '').toLowerCase().trim()

  if (
    msg.includes('quem te criou') ||
    msg.includes('quem criou você') ||
    msg.includes('quem criou voce') ||
    msg.includes('criador')
  ) {
    return 'identidade'
  }

  if (
    msg === 'oi' ||
    msg === 'olá' ||
    msg === 'ola' ||
    msg === 'boa noite' ||
    msg === 'bom dia' ||
    msg === 'boa tarde' ||
    msg === 'teste'
  ) {
    return 'saudacao'
  }

  if (
    msg.includes('erro') ||
    msg.includes('error') ||
    msg.includes('500') ||
    msg.includes('falha') ||
    msg.includes('bug') ||
    msg.includes('crash') ||
    msg.includes('quebrou')
  ) {
    return 'diagnostico'
  }

  if (
    msg.includes('arquitetura') ||
    msg.includes('estrutura') ||
    msg.includes('escalar') ||
    msg.includes('produção') ||
    msg.includes('producao') ||
    msg.includes('deploy') ||
    msg.includes('rollback') ||
    msg.includes('canary')
  ) {
    return 'arquitetura'
  }

  if (
    msg.includes('código') ||
    msg.includes('codigo') ||
    msg.includes('função') ||
    msg.includes('funcao') ||
    msg.includes('typescript') ||
    msg.includes('javascript') ||
    msg.includes('next') ||
    msg.includes('node') ||
    msg.includes('api') ||
    msg.includes('manda os códigos') ||
    msg.includes('mande os códigos') ||
    msg.includes('manda os codigos') ||
    msg.includes('mande os codigos') ||
    msg.includes('me manda os códigos') ||
    msg.includes('me manda os codigos') ||
    msg.includes('me envie o código') ||
    msg.includes('me envie o codigo')
  ) {
    return 'codigo'
  }

  if (
    msg.includes('segurança') ||
    msg.includes('seguranca') ||
    msg.includes('api key') ||
    msg.includes('token') ||
    msg.includes('auth') ||
    msg.includes('rate limit') ||
    msg.includes('blindar') ||
    msg.includes('proteger')
  ) {
    return 'seguranca'
  }

  return 'geral'
}
