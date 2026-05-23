import { runRuntimeMasterOrchestrator } from './runtime-master-orchestrator'
import { emitRuntimeTelemetry } from './runtime-telemetry-fabric'

export function runRuntimeExecutionBridge(message: string, userId: string) {
  const correlationId = `chat-${userId}-${Date.now()}`
  const runtime = runRuntimeMasterOrchestrator()

  const executionAllowed =
    runtime.operationalState === 'stable' ||
    runtime.governance.decision === 'NORMAL_OPERATION' ||
    runtime.governance.decision === 'STABILIZATION_REQUIRED'

  emitRuntimeTelemetry({
    source: 'runtime-execution-bridge',
    type: 'chat-runtime-bridge',
    severity: executionAllowed ? 'info' : 'warning',
    correlationId,
    message: 'Chat request evaluated by runtime execution bridge.',
    payload: {
      userId,
      messageLength: message.length,
      executionAllowed,
      operationalState: runtime.operationalState,
      governance: runtime.governance.decision,
      integrity: runtime.integrity.integrity,
      healing: runtime.healing.decision,
      recovery: runtime.recovery.operationalState,
    },
  })

  return {
    ...runtime,
    correlationId,
    executionAllowed,
    bridge: 'runtime-execution-bridge',
  }
}
