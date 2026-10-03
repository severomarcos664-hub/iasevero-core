import {
  prepareGovernedResearchMissionExternalReadExecutionGateIntegration,
} from '../app/lib/runtime-core/runtime-governed-research-mission-external-read-execution-gate-integration'

const decision =
  prepareGovernedResearchMissionExternalReadExecutionGateIntegration({
    executionKey: 'v287.81-execution',
    correlationId: 'v287.81-correlation',
    traceId: 'v287.81-trace',
    stepId: 'v287.81-step',
    externalReadAuthorizationEvaluated: true,
    externalReadAuthorized: true,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  })

if (
  decision.executionGateIntegrationEvaluated !== true ||
  decision.externalReadAuthorizationEvaluated !== true ||
  decision.externalReadAuthorized !== true ||
  decision.externalReadExecutionEligible !== true ||
  decision.executionGateStatus !== 'eligible' ||
  decision.networkAccess !== false ||
  decision.externalReadApplied !== false ||
  decision.executionApplied !== false ||
  decision.mutationApplied !== false ||
  decision.providerInvocation !== false
) {
  throw new Error(
    'V287_81_EXTERNAL_READ_EXECUTION_GATE_INTEGRATION_INVARIANT_FAILED',
  )
}


const blockedDecision =
  prepareGovernedResearchMissionExternalReadExecutionGateIntegration({
    executionKey: 'v287.81-blocked-execution',
    correlationId: 'v287.81-blocked-correlation',
    traceId: 'v287.81-blocked-trace',
    stepId: 'v287.81-blocked-step',
    externalReadAuthorizationEvaluated: true,
    externalReadAuthorized: false,
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  });

if (
  blockedDecision.executionGateIntegrationEvaluated !== true ||
  blockedDecision.externalReadAuthorizationEvaluated !== true ||
  blockedDecision.externalReadAuthorized !== false ||
  blockedDecision.externalReadExecutionEligible !== false ||
  blockedDecision.executionGateStatus !== 'blocked' ||
  blockedDecision.networkAccess !== false ||
  blockedDecision.externalReadApplied !== false ||
  blockedDecision.executionApplied !== false ||
  blockedDecision.mutationApplied !== false ||
  blockedDecision.providerInvocation !== false ||
  blockedDecision.reason !==
    'Governed controlled external read was blocked before effect invocation.'
) {
  throw new Error(
    'V287_81_EXTERNAL_READ_EXECUTION_GATE_BLOCKED_PATH_INVARIANT_FAILED',
  );
}


console.log(
  'V287_81_GOVERNED_EVOLUTION_MISSION_EXTERNAL_READ_EXECUTION_GATE_INTEGRATION_FOUNDATION_PROOF=PASS',
)
