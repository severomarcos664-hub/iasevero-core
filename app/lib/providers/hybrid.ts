export async function hybridProvider(message: string): Promise<string | null> {
  const mode = process.env.AISEVERO_MODE || 'local'

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
