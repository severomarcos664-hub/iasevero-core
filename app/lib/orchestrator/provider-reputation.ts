type ProviderStats = {
  safe: number
  risky: number
}

const providers: Record<string, ProviderStats> = {}

export function registerProviderResult(
  provider: string,
  safe: boolean
) {
  if (!providers[provider]) {
    providers[provider] = {
      safe: 0,
      risky: 0
    }
  }

  if (safe) {
    providers[provider].safe++
  } else {
    providers[provider].risky++
  }

  return providers[provider]
}

export function getProviderReputation() {
  return providers
}
