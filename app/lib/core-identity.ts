export function coreIdentity(message: string): string | null {
  const m = (message || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (
    m.includes('quem te criou') ||
    m.includes('quem criou voce') ||
    m.includes('seu criador') ||
    m.includes('qual seu criador')
  ) {
    return 'IASevero foi criada por Marcos Julio Severo.'
  }

  return null
}
