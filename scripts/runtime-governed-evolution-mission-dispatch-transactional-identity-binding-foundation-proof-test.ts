import { prepareGovernedEvolutionMissionDispatchBinding } from '../app/lib/runtime-core/runtime-governed-evolution-mission-dispatch-preparation-binding'
import { bindGovernedEvolutionMissionDispatchTransactionalIdentity } from '../app/lib/runtime-core/runtime-governed-evolution-mission-dispatch-transactional-identity-binding'

function assert(condition: boolean, message: string): void {
  if (condition === false) throw new Error(message)
}

const authorizationDecision = {
  authorizationConsumed: true as const,
  missionIdentityBound: true,
  executionAuthorized: true,
  dispatchApplied: false as const,
  executionApplied: false as const,
  mutationApplied: false as const,
  networkAuthorityGranted: false as const,
  productionMutationApplied: false as const,
  selfPromotionApplied: false as const,
}

const preparationDecision = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-transaction-1',
  proposalId: 'mission-transaction-1',
  authorizationDecision,
})

const decision = bindGovernedEvolutionMissionDispatchTransactionalIdentity({
  missionId: 'mission-transaction-1',
  proposalId: 'mission-transaction-1',
  executionKey: 'execution-transaction-1',
  correlationId: 'correlation-transaction-1',
  traceId: 'trace-transaction-1',
  stepId: 'step-transaction-1',
  preparationDecision,
})

assert(decision.bindingEvaluated === true, 'binding must be evaluated')
assert(decision.missionIdentityBound === true, 'mission identity must remain bound')
assert(decision.transactionalIdentityBound === true, 'transactional identity must be bound')
assert(decision.executionKey === 'execution-transaction-1', 'executionKey must be preserved')
assert(decision.correlationId === 'correlation-transaction-1', 'correlationId must be preserved')
assert(decision.traceId === 'trace-transaction-1', 'traceId must be preserved')
assert(decision.stepId === 'step-transaction-1', 'stepId must be preserved')
assert(decision.dispatchEligible === true, 'dispatch must be eligible after complete binding')
assert(decision.dispatchPrepared === true, 'dispatch must be prepared after complete binding')
assert(decision.dispatchApplied === false, 'dispatch must not be applied')
assert(decision.executionApplied === false, 'execution must not be applied')
assert(decision.mutationApplied === false, 'mutation must not be applied')
assert(decision.networkAuthorityGranted === false, 'network authority must remain false')
assert(decision.productionMutationApplied === false, 'production mutation must remain false')
assert(decision.selfPromotionApplied === false, 'self promotion must remain false')

const incomplete = bindGovernedEvolutionMissionDispatchTransactionalIdentity({
  missionId: 'mission-transaction-1',
  proposalId: 'mission-transaction-1',
  executionKey: '',
  correlationId: 'correlation-transaction-1',
  traceId: 'trace-transaction-1',
  stepId: 'step-transaction-1',
  preparationDecision,
})

assert(incomplete.transactionalIdentityBound === false, 'incomplete transactional identity must fail closed')
assert(incomplete.dispatchEligible === false, 'incomplete identity must block dispatch eligibility')
assert(incomplete.dispatchPrepared === false, 'incomplete identity must block dispatch preparation')
assert(incomplete.dispatchApplied === false, 'blocked preparation must not apply dispatch')

console.log('V287_74_12_GOVERNED_EVOLUTION_MISSION_DISPATCH_TRANSACTIONAL_IDENTITY_BINDING_FOUNDATION_PROOF_PASS')
