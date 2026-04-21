export type AppConfig = {
  openaiApiKey: string
  openaiModel: string
}

export function getAppConfig(): AppConfig {
  const openaiApiKey = process.env.OPENAI_API_KEY || ''
  const openaiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

  return {
    openaiApiKey,
    openaiModel,
  }
}

export function validateAppConfig() {
  const errors: string[] = []
  const config = getAppConfig()

  if (!config.openaiApiKey) {
    errors.push('OPENAI_API_KEY não configurada.')
  }

  return {
    ok: errors.length === 0,
    errors,
    config,
  }
}
