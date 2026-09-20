import assert from 'node:assert/strict'
import { prepareGovernedEvolutionMissionDispatchBinding } from '../app/lib/runtime-core/runtime-governed-evolution-mission-dispatch-preparation-binding'

const authorizedDecision = {
  authorizationConsumed: true,
  missionIdentityBound: true,
  executionAuthorized: true,
  dispatchApplied: false as const,
  executionApplied: false as const,
  mutationApplied: false as const,
  networkAuthorityGranted: false as const,
  productionMutationApplied: false as const,
  selfPromotionApplied: false as const,
}

const allowed = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-001',
  proposalId: 'mission-001',
  authorizationDecision: authorizedDecision,
})

assert.equal(allowed.bindingEvaluated, true)
assert.equal(allowed.missionIdentityBound, true)
assert.equal(allowed.authorizationConsumed, true)
assert.equal(allowed.dispatchEligible, true)
assert.equal(allowed.dispatchPrepared, true)
assert.equal(allowed.dispatchApplied, false)
assert.equal(allowed.executionApplied, false)
assert.equal(allowed.mutationApplied, false)
assert.equal(allowed.networkAuthorityGranted, false)
assert.equal(allowed.productionMutationApplied, false)
assert.equal(allowed.selfPromotionApplied, false)

const identityMismatch = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-001',
  proposalId: 'proposal-other',
  authorizationDecision: authorizedDecision,
})
assert.equal(identityMismatch.missionIdentityBound, false)
assert.equal(identityMismatch.dispatchPrepared, false)

const authorizationNotConsumed = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-001',
  proposalId: 'mission-001',
  authorizationDecision: { ...authorizedDecision, authorizationConsumed: false },
})
assert.equal(authorizationNotConsumed.authorizationConsumed, false)
assert.equal(authorizationNotConsumed.dispatchPrepared, false)

const executionNotAuthorized = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-001',
  proposalId: 'mission-001',
  authorizationDecision: { ...authorizedDecision, executionAuthorized: false },
})
assert.equal(executionNotAuthorized.authorizationConsumed, false)
assert.equal(executionNotAuthorized.dispatchPrepared, false)

const inheritedDispatchAuthority = prepareGovernedEvolutionMissionDispatchBinding({
  missionId: 'mission-001',
  proposalId: 'mission-001',
  authorizationDecision: { ...authorizedDecision, dispatchApplied: true as never },
})
assert.equal(inheritedDispatchAuthority.authorizationConsumed, false)
assert.equal(inheritedDispatchAuthority.dispatchPrepared, false)
assert.equal(inheritedDispatchAuthority.dispatchApplied, false)
assert.equal(inheritedDispatchAuthority.executionApplied, false)

console.log('PASS runtime governed evolution mission dispatch preparation binding foundation proof')
