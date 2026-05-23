import { runRuntimeExecutionBridge } from './runtime-execution-bridge'

export type RuntimeDecisionGateReport = {
  allowed: boolean
  reason: string
  operationalState: string
  governance: string
  integrity: string
  healing: string
  recovery: string
  correlationId: string
}

export function evaluateRuntimeDecisionGate(
  message: string,
  userId: string,
): RuntimeDecisionGateReport {

  const runtime = runRuntimeExecutionBridge(message, userId)

  const blocked =
    runtime.governance.decision !== 'NORMAL_OPERATION' ||
    runtime.integrity.integrity !== 'healthy' ||
    runtime.healing.decision === 'CONTAINMENT_REQUIRED'

  return {
    allowed: !blocked,

    reason: blocked
      ? 'runtime execution blocked by governance'
      : 'runtime execution approved',

    operationalState: runtime.operationalState,

    governance: runtime.governance.decision,

    integrity: runtime.integrity.integrity,

    healing: runtime.healing.decision,

    recovery: runtime.recovery.operationalState,

    correlationId: runtime.correlationId,
  }
}
