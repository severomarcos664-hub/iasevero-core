import {
  prepareGovernedEvolutionMissionExternalReadAuthorizationIntegration,
} from '../app/lib/runtime-core/runtime-governed-evolution-mission-external-read-authorization-integration'

const decision =
  prepareGovernedEvolutionMissionExternalReadAuthorizationIntegration({
    executionKey: 'v287.74.23-execution',
    correlationId: 'v287.74.23-correlation',
    traceId: 'v287.74.23-trace',
    stepId: 'v287.74.23-step',
    capabilityRequestEvaluated: true,
    missionIdentityBound: true,
    externalReadCapabilityRequested: true,
    externalReadCapabilityRequestPrepared: true,
    requestTargetEvaluated: true,
    requestTargetEligible: true,
    networkAuthorityGranted: false,
    dispatchApplied: false,
    finalAuthorization: true,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  })

if (
  decision.authorizationIntegrationEvaluated !== true ||
  decision.externalReadAuthorizationEvaluated !== true ||
  decision.externalReadAuthorized !== true ||
  decision.networkAccess !== false ||
  decision.externalReadApplied !== false ||
  decision.executionApplied !== false ||
  decision.mutationApplied !== false ||
  decision.providerInvocation !== false
) {
  throw new Error('V287_74_23_AUTHORIZATION_INTEGRATION_INVARIANT_FAILED')
}

console.log(
  'V287_74_23_GOVERNED_EVOLUTION_MISSION_EXTERNAL_READ_AUTHORIZATION_INTEGRATION_FOUNDATION_PROOF=PASS',
)
