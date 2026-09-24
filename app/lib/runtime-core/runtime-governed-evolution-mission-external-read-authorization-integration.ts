import type { GovernedEvolutionMissionExternalReadCapabilityRequestDecision } from './runtime-governed-evolution-mission-external-read-capability-request'
import {
  evaluateRuntimeToolControlledExternalReadAuthorizationBoundary,
  type RuntimeToolControlledExternalReadAuthorizationInput,
} from '../orchestrator/runtime-tool-controlled-external-read-authorization-boundary'

export type GovernedEvolutionMissionExternalReadAuthorizationIntegrationInput =
  GovernedEvolutionMissionExternalReadCapabilityRequestDecision & {
    readonly finalAuthorization: boolean
  }

export type GovernedEvolutionMissionExternalReadAuthorizationIntegrationDecision = {
  readonly authorizationIntegrationEvaluated: true
  readonly externalReadAuthorizationEvaluated: true
  readonly externalReadAuthorized: boolean
  readonly networkAccess: false
  readonly externalReadApplied: false
  readonly executionApplied: false
  readonly mutationApplied: false
  readonly providerInvocation: false
}

export function prepareGovernedEvolutionMissionExternalReadAuthorizationIntegration(
  input: GovernedEvolutionMissionExternalReadAuthorizationIntegrationInput,
): GovernedEvolutionMissionExternalReadAuthorizationIntegrationDecision {
  const authorization =
    evaluateRuntimeToolControlledExternalReadAuthorizationBoundary({
      executionKey: input.executionKey,
      correlationId: input.correlationId,
      traceId: input.traceId,
      stepId: input.stepId,
      externalReadBoundaryEvaluated: input.requestTargetEvaluated,
      externalReadEligible: input.requestTargetEligible,
      finalAuthorization: input.finalAuthorization,
    })

  const externalReadAuthorized =
    input.externalReadCapabilityRequested === true &&
    input.externalReadCapabilityRequestPrepared === true &&
    authorization.externalReadAuthorizationEvaluated === true &&
    authorization.externalReadAuthorized === true

  return {
    authorizationIntegrationEvaluated: true,
    externalReadAuthorizationEvaluated:
      authorization.externalReadAuthorizationEvaluated,
    externalReadAuthorized,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  }
}
