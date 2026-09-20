export type GovernedEvolutionMissionDispatchPreparationAuthorizationDecision = {
  authorizationConsumed: boolean
  missionIdentityBound: boolean
  executionAuthorized: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export type GovernedEvolutionMissionDispatchPreparationBindingInput = {
  missionId: string
  proposalId: string
  authorizationDecision: GovernedEvolutionMissionDispatchPreparationAuthorizationDecision
}

export type GovernedEvolutionMissionDispatchPreparationBindingDecision = {
  bindingEvaluated: true
  missionIdentityBound: boolean
  authorizationConsumed: boolean
  dispatchEligible: boolean
  dispatchPrepared: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export function prepareGovernedEvolutionMissionDispatchBinding(
  input: GovernedEvolutionMissionDispatchPreparationBindingInput,
): GovernedEvolutionMissionDispatchPreparationBindingDecision {
  const missionId = input.missionId.trim()
  const proposalId = input.proposalId.trim()

  const missionIdentityBound =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    input.authorizationDecision.missionIdentityBound === true

  const inheritedAuthorityIsZero =
    input.authorizationDecision.dispatchApplied === false &&
    input.authorizationDecision.executionApplied === false &&
    input.authorizationDecision.mutationApplied === false &&
    input.authorizationDecision.networkAuthorityGranted === false &&
    input.authorizationDecision.productionMutationApplied === false &&
    input.authorizationDecision.selfPromotionApplied === false

  const authorizationConsumed =
    missionIdentityBound &&
    inheritedAuthorityIsZero &&
    input.authorizationDecision.authorizationConsumed === true &&
    input.authorizationDecision.executionAuthorized === true

  const dispatchEligible = authorizationConsumed
  const dispatchPrepared = dispatchEligible

  return {
    bindingEvaluated: true,
    missionIdentityBound,
    authorizationConsumed,
    dispatchEligible,
    dispatchPrepared,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
