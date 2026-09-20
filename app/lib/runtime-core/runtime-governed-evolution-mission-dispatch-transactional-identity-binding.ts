import type { GovernedEvolutionMissionDispatchPreparationBindingDecision } from './runtime-governed-evolution-mission-dispatch-preparation-binding'

export type GovernedEvolutionMissionDispatchTransactionalIdentityBindingInput = {
  missionId: string
  proposalId: string
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  preparationDecision: GovernedEvolutionMissionDispatchPreparationBindingDecision
}

export type GovernedEvolutionMissionDispatchTransactionalIdentityBindingDecision = {
  bindingEvaluated: true
  missionIdentityBound: boolean
  transactionalIdentityBound: boolean
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  dispatchEligible: boolean
  dispatchPrepared: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export function bindGovernedEvolutionMissionDispatchTransactionalIdentity(
  input: GovernedEvolutionMissionDispatchTransactionalIdentityBindingInput,
): GovernedEvolutionMissionDispatchTransactionalIdentityBindingDecision {
  const missionId = input.missionId.trim()
  const proposalId = input.proposalId.trim()
  const executionKey = input.executionKey.trim()
  const correlationId = input.correlationId.trim()
  const traceId = input.traceId.trim()
  const stepId = input.stepId.trim()

  const missionIdentityBound =
    missionId.length > 0 &&
    proposalId.length > 0 &&
    missionId === proposalId &&
    input.preparationDecision.missionIdentityBound === true

  const inheritedAuthorityIsZero =
    input.preparationDecision.dispatchApplied === false &&
    input.preparationDecision.executionApplied === false &&
    input.preparationDecision.mutationApplied === false &&
    input.preparationDecision.networkAuthorityGranted === false &&
    input.preparationDecision.productionMutationApplied === false &&
    input.preparationDecision.selfPromotionApplied === false

  const transactionalIdentityBound =
    missionIdentityBound &&
    inheritedAuthorityIsZero &&
    executionKey.length > 0 &&
    correlationId.length > 0 &&
    traceId.length > 0 &&
    stepId.length > 0

  const dispatchEligible =
    transactionalIdentityBound &&
    input.preparationDecision.dispatchEligible === true

  return {
    bindingEvaluated: true,
    missionIdentityBound,
    transactionalIdentityBound,
    executionKey,
    correlationId,
    traceId,
    stepId,
    dispatchEligible,
    dispatchPrepared: dispatchEligible,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
