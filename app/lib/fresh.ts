export function requiresFreshData(msg: string): boolean {
  const m = msg.toLowerCase()

  return (
    m.includes('hoje') ||
    m.includes('agora') ||
    m.includes('atualmente') ||
    m.includes('últimas notícias') ||
    m.includes('recentemente') ||
    m.includes('2025') ||
    m.includes('2026')
  )
}
