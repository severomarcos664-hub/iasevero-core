import { getIASeveroMode } from '../mode'
export async function hybridProvider(message: string): Promise<string | null> {
  const mode = getIASeveroMode()

  // 🔒 MODO LOCAL (ATUAL)
  if (mode === 'local') {
    return null
  }

  // ⚠️ MODO HÍBRIDO (DESLIGADO POR ENQUANTO)
  if (mode === 'hybrid') {
    // aqui no futuro entra OpenAI ou outro provider
    return null
  }

  return null
}
