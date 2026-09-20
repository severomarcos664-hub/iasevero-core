export type GovernedEvolutionMissionAuthorizationDecision = {
  integrationEvaluated: true
  proposalIdentityBound: boolean
  sandboxOnlyVerified: boolean
  executionAuthorized: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export type GovernedEvolutionMissionAuthorizationConsumptionInput = {
  missionId: string
  proposalId: string
  authorizationDecision: GovernedEvolutionMissionAuthorizationDecision
}

export type GovernedEvolutionMissionAuthorizationConsumptionDecision = {
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

export function consumeGovernedEvolutionMissionAuthorization(
  input: GovernedEvolutionMissionAuthorizationConsumptionInput,
): GovernedEvolutionMissionAuthorizationConsumptionDecision {
  const missionId = input.missionId.trim()
  const proposalId = input.proposalId.trim()
  const missionIdentityBound =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    input.authorizationDecision.integrationEvaluated === true &&
    input.authorizationDecision.proposalIdentityBound === true &&
    input.authorizationDecision.sandboxOnlyVerified === true

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
    input.authorizationDecision.executionAuthorized === true

  return {
    authorizationConsumed,
    missionIdentityBound,
    executionAuthorized: authorizationConsumed,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
