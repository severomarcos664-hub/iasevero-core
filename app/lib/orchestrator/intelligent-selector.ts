import { getProviderReputation } from './provider-reputation'

export function selectBestProvider() {
  const providers = getProviderReputation()

  const ranked = Object.entries(providers)
    .map(([name, stats]) => {
      const score =
        (stats.safe * 2) - stats.risky

      return {
        provider: name,
        score
      }
    })
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) {
    return {
      provider: 'local',
      reason: 'Nenhum provider analisado.'
    }
  }

  return {
    provider: ranked[0].provider,
    reason: 'Provider selecionado por reputação operacional.'
  }
}
