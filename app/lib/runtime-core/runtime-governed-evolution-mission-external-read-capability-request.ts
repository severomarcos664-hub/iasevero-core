import type { GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationDecision } from './runtime-governed-evolution-mission-cognitive-kernel-admission-integration'
import {
  evaluateRuntimeToolControlledExternalReadTargetInputBoundary,
  type RuntimeToolControlledExternalReadTargetInputBoundaryInput,
} from '../orchestrator/runtime-tool-controlled-external-read-target-input-boundary'
import { evaluateRuntimeToolControlledExternalReadRequestTargetContract } from '../orchestrator/runtime-tool-controlled-external-read-request-target-contract'

export type GovernedEvolutionMissionExternalReadCapabilityRequestInput = {
  cognitiveKernelAdmissionIntegrationDecision: GovernedEvolutionMissionCognitiveKernelAdmissionIntegrationDecision
  targetInput: RuntimeToolControlledExternalReadTargetInputBoundaryInput
}

export type GovernedEvolutionMissionExternalReadCapabilityRequestDecision = {
  capabilityRequestEvaluated: true
  missionIdentityBound: boolean
  externalReadCapabilityRequested: boolean
  externalReadCapabilityRequestPrepared: boolean
  requestTargetEvaluated: boolean
  requestTargetEligible: boolean
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string
  networkAuthorityGranted: false
  networkAccess: false
  externalReadApplied: false
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false
}

export function prepareGovernedEvolutionMissionExternalReadCapabilityRequest(
  input: GovernedEvolutionMissionExternalReadCapabilityRequestInput,
): GovernedEvolutionMissionExternalReadCapabilityRequestDecision {
  const admission = input.cognitiveKernelAdmissionIntegrationDecision

  const missionIdentityBound =
    admission.missionIdentityBound === true &&
    admission.cognitiveKernelAdmissionPrepared === true &&
    admission.dispatchApplied === false &&
    admission.executionApplied === false &&
    admission.mutationApplied === false &&
    admission.networkAuthorityGranted === false &&
    admission.executionKey.trim().length > 0 &&
    admission.correlationId.trim().length > 0 &&
    admission.traceId.trim().length > 0 &&
    admission.stepId.trim().length > 0

  const targetInputDecision =
    evaluateRuntimeToolControlledExternalReadTargetInputBoundary(input.targetInput)

  const requestTargetDecision =
    evaluateRuntimeToolControlledExternalReadRequestTargetContract({
      externalReadTarget: targetInputDecision.target,
    })

  const externalReadCapabilityRequested =
    missionIdentityBound &&
    targetInputDecision.targetInputEvaluated === true &&
    targetInputDecision.targetInputEligible === true

  const externalReadCapabilityRequestPrepared =
    externalReadCapabilityRequested &&
    requestTargetDecision.requestTargetEvaluated === true &&
    requestTargetDecision.requestTargetEligible === true

  return {
    capabilityRequestEvaluated: true,
    missionIdentityBound,
    externalReadCapabilityRequested,
    externalReadCapabilityRequestPrepared,
    requestTargetEvaluated: requestTargetDecision.requestTargetEvaluated,
    requestTargetEligible: requestTargetDecision.requestTargetEligible,
    executionKey: admission.executionKey,
    correlationId: admission.correlationId,
    traceId: admission.traceId,
    stepId: admission.stepId,
    networkAuthorityGranted: false,
    networkAccess: false,
    externalReadApplied: false,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  }
}
