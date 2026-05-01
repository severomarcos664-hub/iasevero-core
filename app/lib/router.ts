export type Intent =
  | 'learn'
  | 'approve'
  | 'memory'
  | 'security'
  | 'cost'
  | 'deploy'
  | 'diagnostic'
  | 'general'

export function detectIntent(message: string): Intent {
  const m = (message || '').toLowerCase()

  if (m.startsWith('ensinar:')) return 'learn'
  if (m.startsWith('aprovar:')) return 'approve'
  if (m.includes('memoria') || m.includes('memória')) return 'memory'
  if (m.includes('token') || m.includes('chave') || m.includes('secret') || m.includes('segurança')) return 'security'
  if (m.includes('custo') || m.includes('gratis') || m.includes('zero')) return 'cost'
  if (m.includes('deploy') || m.includes('cloud run') || m.includes('subir')) return 'deploy'
  if (m.includes('erro') || m.includes('bug') || m.includes('falha')) return 'diagnostic'

  return 'general'
}
