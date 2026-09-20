import type { GovernedEvolutionMissionDispatchTransactionalIdentityBindingDecision } from "./runtime-governed-evolution-mission-dispatch-transactional-identity-binding"

export type GovernedEvolutionMissionDispatchExecutiveAuthorityHandoffInput = {
  missionId: string
  proposalId: string
  transactionalDecision: GovernedEvolutionMissionDispatchTransactionalIdentityBindingDecision
}

export type GovernedEvolutionMissionDispatchExecutiveAuthorityHandoffDecision = {
  handoffEvaluated: true
  missionIdentityBound: boolean
  transactionalIdentityBound: boolean
  dispatchPrepared: boolean
  handoffEligible: boolean
  handoffPrepared: boolean
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export function prepareGovernedEvolutionMissionDispatchExecutiveAuthorityHandoff(
  input: GovernedEvolutionMissionDispatchExecutiveAuthorityHandoffInput,
): GovernedEvolutionMissionDispatchExecutiveAuthorityHandoffDecision {
  const missionId = input.missionId.trim()
  const proposalId = input.proposalId.trim()
  const decision = input.transactionalDecision

  const missionIdentityBound =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    decision.missionIdentityBound === true

  const inheritedAuthorityIsZero =
    decision.dispatchApplied === false &&
    decision.executionApplied === false &&
    decision.mutationApplied === false &&
    decision.networkAuthorityGranted === false &&
    decision.productionMutationApplied === false &&
    decision.selfPromotionApplied === false

  const handoffEligible =
    missionIdentityBound &&
    decision.transactionalIdentityBound === true &&
    decision.dispatchPrepared === true &&
    inheritedAuthorityIsZero

  return {
    handoffEvaluated: true,
    missionIdentityBound,
    transactionalIdentityBound: decision.transactionalIdentityBound,
    dispatchPrepared: decision.dispatchPrepared,
    handoffEligible,
    handoffPrepared: handoffEligible,
    executionKey: decision.executionKey,
    correlationId: decision.correlationId,
    traceId: decision.traceId,
    stepId: decision.stepId,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
