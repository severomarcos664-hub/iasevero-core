import { getRuntimeStatus } from '../env'

export type RuntimeDecision = {
  mode: string
  allowExternal: boolean
  safe: boolean
  reason: string
}

export function resolveRuntimeDecision(): RuntimeDecision {
  const status = getRuntimeStatus()

  if (status.mode === 'openai' && !status.openaiConfigured) {
    return {
      mode: 'local',
      allowExternal: false,
      safe: true,
      reason: 'OpenAI não configurado; fallback local ativado.'
    }
  }

  return {
    mode: status.mode,
    allowExternal: status.mode === 'openai' || status.mode === 'hybrid',
    safe: status.safe,
    reason: status.mode === 'local'
      ? 'Modo local ativo; custo externo bloqueado.'
      : 'Modo externo autorizado por configuração.'
  }
}
