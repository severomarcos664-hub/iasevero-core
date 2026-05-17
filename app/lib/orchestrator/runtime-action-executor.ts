export type RuntimeAction = {
  id: string
  type:
    | 'build'
    | 'regression'
    | 'analysis'
    | 'recovery'
    | 'audit'

  payload?: Record<string, unknown>
}

export type RuntimeActionResult = {
  success: boolean
  actionId: string
  executedAt: string
  message: string
}

export async function executeRuntimeAction(
  action: RuntimeAction
): Promise<RuntimeActionResult> {

  const allowed = [
    'build',
    'regression',
    'analysis',
    'recovery',
    'audit'
  ]

  if (!allowed.includes(action.type)) {
    return {
      success: false,
      actionId: action.id,
      executedAt: new Date().toISOString(),
      message: 'Ação bloqueada pela governança.'
    }
  }

  return {
    success: true,
    actionId: action.id,
    executedAt: new Date().toISOString(),
    message: `Ação ${action.type} executada com sucesso.`
  }
}
