import { evaluateRuntimePolicy } from './runtime-policy-engine'
import { executeRuntimeAction } from './runtime-action-engine'
import { emitRuntimeTelemetry } from './runtime-telemetry-fabric'

export type RuntimeExecutionCoordinatorResult = {
  generatedAt: string
  source: 'runtime-execution-coordinator'
  policyLevel: string
  allowed: boolean
  selectedAction: string
  actionExecuted: boolean
  recommendation: string
  reasoning: string[]
}

export function coordinateRuntimeExecution():
RuntimeExecutionCoordinatorResult {

  const policy = evaluateRuntimePolicy()

  const action = executeRuntimeAction(
    policy.requiredAction,
    policy.reason
  )

  const result: RuntimeExecutionCoordinatorResult = {
    generatedAt: new Date().toISOString(),
    source: 'runtime-execution-coordinator',
    policyLevel: policy.policyLevel,
    allowed: policy.allowed,
    selectedAction: policy.requiredAction,
    actionExecuted: action.executed,
    recommendation:
      policy.allowed
        ? `Coordinator executou ação permitida: ${policy.requiredAction}.`
        : `Coordinator executou ação restritiva: ${policy.requiredAction}.`,
    reasoning: [
      ...policy.reasoning,
      ...action.reasoning,
      `coordinator:executed`,
    ],
  }

  emitRuntimeTelemetry({
    source: 'runtime-execution-coordinator',
    type: 'runtime-execution-coordinated',
    severity:
      policy.policyLevel === 'critical'
        ? 'critical'
        : policy.policyLevel === 'restricted'
          ? 'warning'
          : 'info',
    correlationId: `coordinator-${Date.now()}`,
    message: `Runtime execution coordinated with action ${policy.requiredAction}.`,
    payload: result,
  })

  return result
}
