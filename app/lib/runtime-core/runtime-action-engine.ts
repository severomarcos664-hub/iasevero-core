import { publishRuntimeEvent } from './runtime-event-bus'
import { emitRuntimeTelemetry } from './runtime-telemetry-fabric'

export type RuntimeActionType =
  | 'observe'
  | 'throttle'
  | 'stabilize'
  | 'contain'
  | 'recover'

export type RuntimeActionResult = {
  generatedAt: string
  source: 'runtime-action-engine'
  action: RuntimeActionType
  executed: boolean
  severity: 'info' | 'warning' | 'critical'
  recommendation: string
  reasoning: string[]
}

export function executeRuntimeAction(
  action: RuntimeActionType,
  reason: string
): RuntimeActionResult {
  const severity =
    action === 'contain' || action === 'recover'
      ? 'critical'
      : action === 'throttle' || action === 'stabilize'
        ? 'warning'
        : 'info'

  const result: RuntimeActionResult = {
    generatedAt: new Date().toISOString(),
    source: 'runtime-action-engine',
    action,
    executed: true,
    severity,
    recommendation:
      action === 'contain'
        ? 'Executar contenção operacional.'
        : action === 'recover'
          ? 'Executar ciclo de recuperação.'
          : action === 'throttle'
            ? 'Reduzir pressão operacional.'
            : action === 'stabilize'
              ? 'Aplicar estabilização preventiva.'
              : 'Manter observação operacional.',
    reasoning: [
      `action:${action}`,
      `reason:${reason}`,
      `severity:${severity}`,
    ],
  }

  publishRuntimeEvent({
    source: 'runtime-action-engine',
    type: 'runtime-action-executed',
    priority:
      severity === 'critical'
        ? 'critical'
        : severity === 'warning'
          ? 'high'
          : 'normal',
    payload: result,
  })

  emitRuntimeTelemetry({
    source: 'runtime-action-engine',
    type: 'runtime-action-executed',
    severity,
    correlationId: `action-${Date.now()}`,
    message: `Runtime action executed: ${action}.`,
    payload: result,
  })

  return result
}
