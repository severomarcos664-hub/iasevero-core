import { getRuntimeAwareness } from './awareness-engine'
import { selectBestProvider } from './intelligent-selector'

export function resolveHybridProvider() {
  const awareness = getRuntimeAwareness()

  if (!awareness.awareness.safe) {
    return {
      provider: 'local',
      mode: 'safe',
      reason: 'Runtime inseguro.'
    }
  }

  const selected = selectBestProvider()

  return {
    provider: selected.provider,
    mode: 'hybrid',
    reason: selected.reason
  }
}
