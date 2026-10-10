import { getIASeveroMode } from '../mode'
import { geminiProvider } from './gemini'

export async function hybridProvider(message: string): Promise<string | null> {
  const mode = getIASeveroMode()

  if (
    mode === 'hybrid' &&
    process.env.IASEVERO_GEMINI_ENABLED === 'true'
  ) {
    return geminiProvider(message)
  }

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
