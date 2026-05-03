export function extractRelevantContext(history: any[]) {
  return history
    .slice(-10)
    .filter(item =>
      item.user.toLowerCase().includes('api') ||
      item.user.toLowerCase().includes('erro') ||
      item.user.toLowerCase().includes('deploy')
    )
    .map(item => item.user)
    .join(' | ')
}
