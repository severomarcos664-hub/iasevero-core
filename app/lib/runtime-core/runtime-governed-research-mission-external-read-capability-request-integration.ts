import type {
  GovernedResearchMissionCognitiveKernelAdmissionIntegrationDecision,
} from './runtime-governed-research-mission-cognitive-kernel-admission-integration'

import {
  prepareGovernedEvolutionMissionExternalReadCapabilityRequest,
  type GovernedEvolutionMissionExternalReadCapabilityRequestDecision,
} from './runtime-governed-evolution-mission-external-read-capability-request'

import type {
  RuntimeToolControlledExternalReadTargetInputBoundaryInput,
} from '../orchestrator/runtime-tool-controlled-external-read-target-input-boundary'

export type GovernedResearchMissionExternalReadCapabilityRequestIntegrationInput = {
  cognitiveKernelAdmissionIntegrationDecision:
    GovernedResearchMissionCognitiveKernelAdmissionIntegrationDecision
  targetInput: RuntimeToolControlledExternalReadTargetInputBoundaryInput
}

export type GovernedResearchMissionExternalReadCapabilityRequestIntegrationDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-research-mission-external-read-capability-request-integration'
  researchMissionCognitiveKernelAdmissionVerified: boolean
  researchMissionExternalReadCapabilityRequestEligible: boolean
  externalReadCapabilityRequestDecision:
    GovernedEvolutionMissionExternalReadCapabilityRequestDecision | null
  missionId: string
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

export function prepareGovernedResearchMissionExternalReadCapabilityRequestIntegration(
  input: GovernedResearchMissionExternalReadCapabilityRequestIntegrationInput,
): GovernedResearchMissionExternalReadCapabilityRequestIntegrationDecision {
  const admission = input.cognitiveKernelAdmissionIntegrationDecision

  const researchMissionCognitiveKernelAdmissionVerified =
    admission.researchMissionContractVerified === true &&
    admission.researchMissionContractEligible === true &&
    admission.missionIdentityBound === true &&
    admission.correlationIdentityBound === true &&
    admission.researchMissionCognitiveKernelAdmissionEligible === true &&
    admission.researchAuthorityGranted === false &&
    admission.networkAuthorityGranted === false &&
    admission.networkAccess === false &&
    admission.externalReadApplied === false &&
    admission.executionApplied === false &&
    admission.mutationApplied === false

  const externalReadCapabilityRequestDecision =
    researchMissionCognitiveKernelAdmissionVerified
      ? prepareGovernedEvolutionMissionExternalReadCapabilityRequest({
          cognitiveKernelAdmissionIntegrationDecision: {
            integrationEvaluated: true,
            missionIdentityBound: admission.missionIdentityBound,
            cognitiveKernelAdmissionPrepared: true,
            permanentMissionIntegrationEligible:
              admission.researchMissionCognitiveKernelAdmissionEligible,
            permanentMissionIntegrationPrepared:
              admission.researchMissionCognitiveKernelAdmissionEligible,
            executionKey: admission.executionKey,
            correlationId: admission.correlationId,
            traceId: admission.traceId,
            stepId: admission.stepId,
            dispatchApplied: false,
            executionApplied: false,
            mutationApplied: false,
            networkAuthorityGranted: false,
            productionMutationApplied: false,
            selfPromotionApplied: false,
          },
          targetInput: input.targetInput,
        })
      : null

  const researchMissionExternalReadCapabilityRequestEligible =
    researchMissionCognitiveKernelAdmissionVerified &&
    externalReadCapabilityRequestDecision?.capabilityRequestEvaluated === true &&
    externalReadCapabilityRequestDecision.externalReadCapabilityRequested === true &&
    externalReadCapabilityRequestDecision.externalReadCapabilityRequestPrepared === true &&
    externalReadCapabilityRequestDecision.requestTargetEvaluated === true &&
    externalReadCapabilityRequestDecision.requestTargetEligible === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-research-mission-external-read-capability-request-integration',
    researchMissionCognitiveKernelAdmissionVerified,
    researchMissionExternalReadCapabilityRequestEligible,
    externalReadCapabilityRequestDecision,
    missionId: admission.missionId,
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
