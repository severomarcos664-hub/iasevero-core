import assert from 'node:assert/strict'
import { consumeGovernedEvolutionMissionAuthorization } from '../app/lib/runtime-core/runtime-governed-evolution-mission-authorization-consumption'

const decision = consumeGovernedEvolutionMissionAuthorization({
  missionId: 'mission-v287.74.10',
  proposalId: 'mission-v287.74.10',
  authorizationDecision: {
    integrationEvaluated: true,
    proposalIdentityBound: true,
    sandboxOnlyVerified: true,
    executionAuthorized: true,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  },
})

assert.equal(decision.authorizationConsumed, true)
assert.equal(decision.missionIdentityBound, true)
assert.equal(decision.executionAuthorized, true)
assert.equal(decision.dispatchApplied, false)
assert.equal(decision.executionApplied, false)
assert.equal(decision.mutationApplied, false)
assert.equal(decision.networkAuthorityGranted, false)
assert.equal(decision.productionMutationApplied, false)
assert.equal(decision.selfPromotionApplied, false)

console.log('V287_74_10_GOVERNED_EVOLUTION_MISSION_AUTHORIZATION_CONSUMPTION_FOUNDATION_PROOF=PASS')

const mismatchedMission = consumeGovernedEvolutionMissionAuthorization({
  missionId: 'mission-a',
  proposalId: 'mission-b',
  authorizationDecision: { ...decision, authorizationConsumed: undefined } as never,
})
assert.equal(mismatchedMission.authorizationConsumed, false)
assert.equal(mismatchedMission.executionAuthorized, false)

const deniedAuthorization = consumeGovernedEvolutionMissionAuthorization({
  missionId: 'mission-denied',
  proposalId: 'mission-denied',
  authorizationDecision: {
    integrationEvaluated: true,
    proposalIdentityBound: true,
    sandboxOnlyVerified: true,
    executionAuthorized: false,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  },
})
assert.equal(deniedAuthorization.authorizationConsumed, false)
assert.equal(deniedAuthorization.executionAuthorized, false)

const inheritedExecution = consumeGovernedEvolutionMissionAuthorization({
  missionId: 'mission-inherited',
  proposalId: 'mission-inherited',
  authorizationDecision: {
    integrationEvaluated: true,
    proposalIdentityBound: true,
    sandboxOnlyVerified: true,
    executionAuthorized: true,
    dispatchApplied: false,
    executionApplied: true,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  } as never,
})
assert.equal(inheritedExecution.authorizationConsumed, false)
assert.equal(inheritedExecution.executionAuthorized, false)
assert.equal(inheritedExecution.dispatchApplied, false)
assert.equal(inheritedExecution.executionApplied, false)
assert.equal(inheritedExecution.mutationApplied, false)

console.log('V287_74_10_FAIL_CLOSED_PROOF=PASS')
