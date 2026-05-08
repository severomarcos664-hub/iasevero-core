const VALID_MODES = ['local', 'openai', 'hybrid'] as const

export type IASeveroMode = typeof VALID_MODES[number]

export function getEnvMode(): IASeveroMode {
  const mode = (process.env.IASEVERO_MODE || 'local').toLowerCase()

  if (!VALID_MODES.includes(mode as IASeveroMode)) {
    return 'local'
  }

  if (mode === 'openai' && !process.env.OPENAI_API_KEY) {
    return 'local'
  }

  return mode as IASeveroMode
}

export function getRuntimeStatus() {
  const mode = getEnvMode()

  return {
    mode,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'development',
    safe: mode !== 'openai' || Boolean(process.env.OPENAI_API_KEY)
  }
}
