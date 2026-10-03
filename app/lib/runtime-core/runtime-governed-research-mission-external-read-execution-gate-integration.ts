import { evaluateRuntimeToolControlledExternalReadExecutionGate } from '@/app/lib/orchestrator/runtime-tool-controlled-external-read-execution-gate'

export type GovernedResearchMissionExternalReadExecutionGateIntegrationInput = {
  readonly executionKey: string
  readonly correlationId: string
  readonly traceId: string
  readonly stepId: string
  readonly externalReadAuthorizationEvaluated: true
  readonly externalReadAuthorized: boolean
  readonly networkAccess: false
  readonly externalReadApplied: false
  readonly executionApplied: false
  readonly mutationApplied: false
  readonly providerInvocation: false
}

export type GovernedResearchMissionExternalReadExecutionGateIntegrationDecision = {
  readonly executionKey: string
  readonly correlationId: string
  readonly traceId: string
  readonly stepId: string
  readonly executionGateIntegrationEvaluated: true
  readonly externalReadAuthorizationEvaluated: true
  readonly externalReadAuthorized: boolean
  readonly externalReadExecutionEligible: boolean
  readonly executionGateStatus: 'eligible' | 'blocked'
  readonly networkAccess: false
  readonly externalReadApplied: false
  readonly executionApplied: false
  readonly mutationApplied: false
  readonly providerInvocation: false
  readonly reason: string
}

export function prepareGovernedResearchMissionExternalReadExecutionGateIntegration(
  input: GovernedResearchMissionExternalReadExecutionGateIntegrationInput,
): GovernedResearchMissionExternalReadExecutionGateIntegrationDecision {
  const executionGate =
    evaluateRuntimeToolControlledExternalReadExecutionGate({
      executionKey: input.executionKey,
      correlationId: input.correlationId,
      traceId: input.traceId,
      stepId: input.stepId,
      externalReadAuthorizationEvaluated:
        input.externalReadAuthorizationEvaluated,
      externalReadAuthorized: input.externalReadAuthorized,
      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
      providerInvocation: false,
    })

  return {
    executionKey: executionGate.executionKey,
    correlationId: executionGate.correlationId,
    traceId: executionGate.traceId,
    stepId: executionGate.stepId,
    executionGateIntegrationEvaluated: true,
    externalReadAuthorizationEvaluated:
      executionGate.externalReadAuthorizationEvaluated,
    externalReadAuthorized: executionGate.externalReadAuthorized,
    externalReadExecutionEligible:
      executionGate.externalReadExecutionEligible,
    executionGateStatus: executionGate.executionGateStatus,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
    reason: executionGate.reason,
  }
}
