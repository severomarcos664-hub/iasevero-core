export type IASeveroMode =
  | 'local'
  | 'openai'
  | 'hybrid'
  | 'safe'

export function getIASeveroMode(): IASeveroMode {
  const mode =
    (process.env.IASEVERO_MODE || 'safe').toLowerCase()

  if (
    mode === 'local' ||
    mode === 'openai' ||
    mode === 'hybrid' ||
    mode === 'safe'
  ) {
    return mode
  }

  return 'safe'
}

export function canUseOpenAI(): boolean {
  const mode = getIASeveroMode()

  return mode === 'openai' || mode === 'hybrid'
}
