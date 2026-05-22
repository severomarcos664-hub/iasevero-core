import { getRuntimeRegistry } from '../orchestrator/runtime-state-registry'
import { evaluateRuntimeAdaptiveResponse } from './runtime-adaptive-response'

export type RuntimeExecutionAction =
  | 'normal-operation'
  | 'throttle-runtime'
  | 'containment-mode'
  | 'recovery-cycle'

export type RuntimeExecutionPlan = {
  generatedAt: string
  source: 'runtime-execution-orchestrator'
  action: RuntimeExecutionAction
  providerMode: 'local' | 'hybrid' | 'openai'
  cooldownMs: number
  telemetryRequired: boolean
  snapshotRequired: boolean
  reasoning: string[]
}

export function evaluateRuntimeExecutionOrchestrator():
  RuntimeExecutionPlan {

  const registry = getRuntimeRegistry()

  const adaptive = evaluateRuntimeAdaptiveResponse()

  const action: RuntimeExecutionAction =
    adaptive.action === 'operate-normally'
      ? 'normal-operation'
      : adaptive.action === 'increase-observation'
      ? 'throttle-runtime'
      : adaptive.action === 'enter-containment'
      ? 'containment-mode'
      : 'recovery-cycle'

  return {
    generatedAt: new Date().toISOString(),
    source: 'runtime-execution-orchestrator',

    action,

    providerMode: adaptive.providerMode,

    cooldownMs: adaptive.cooldownMs,

    telemetryRequired: true,

    snapshotRequired: true,

    reasoning: [
      ...adaptive.reasoning,
      `runtimeHealth:${registry.runtimeHealth}`,
      `recovery:${registry.recoveryMode}`
    ]
  }
}
