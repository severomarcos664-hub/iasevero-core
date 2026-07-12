import { runRuntimeCognitiveKernel } from './runtime-cognitive-kernel-integration'

export type RuntimeDecisionGateReport = {
  allowed: boolean
  reason: string
  operationalState: string
  governance: string
  integrity: string
  healing: string
  recovery: string
  correlationId: string
  kernel: ReturnType<typeof runRuntimeCognitiveKernel>
}

export function evaluateRuntimeDecisionGate(
  message: string,
  userId: string,
): RuntimeDecisionGateReport {
  const kernel = runRuntimeCognitiveKernel({
    message,
    userId,
  })

  const execution = kernel.stages.execution

  if (!kernel.executionAllowed || execution === null) {
    return {
      allowed: false,
      reason: 'runtime execution blocked by governed cognitive kernel',
      operationalState: 'blocked-by-authority',
      governance: kernel.stages.authority.executionPolicy,
      integrity: 'not-executed',
      healing: 'not-executed',
      recovery: 'not-executed',
      correlationId: kernel.kernelId,
      kernel,
    }
  }

  const blocked =
    execution.governance.decision !== 'NORMAL_OPERATION' ||
    execution.integrity.integrity !== 'healthy' ||
    execution.healing.decision === 'CONTAINMENT_REQUIRED'

  return {
    allowed: !blocked,
    reason: blocked
      ? 'runtime execution blocked by governance'
      : 'runtime execution approved by governed cognitive kernel',

    operationalState: execution.operationalState,
    governance: execution.governance.decision,
    integrity: execution.integrity.integrity,
    healing: execution.healing.decision,
    recovery: execution.recovery.operationalState,
    correlationId: execution.correlationId,
    kernel,
  }
}
