import {
  recordGovernedRuntimeLivenessEvidence,
} from './runtime-liveness-evidence'

import {
  assessGovernedRuntimeLiveness,
} from './runtime-liveness-assessment'

import {
  decideGovernedRuntimeLiveness,
} from './runtime-liveness-decision'

import type {
  GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult,
} from './runtime-multi-source-post-rebind-readiness-revalidation-integration'

type GovernedRuntimeLivenessObservation =
  Omit<
    Parameters<typeof recordGovernedRuntimeLivenessEvidence>[0],
    'readinessDecision'
  >

type GovernedRuntimeCanonicalLivenessDecision =
  ReturnType<typeof decideGovernedRuntimeLiveness>

export type GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationInput = {
  readiness:
    GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult
  observation: GovernedRuntimeLivenessObservation
}

export type GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationResult =
  GovernedRuntimeCanonicalLivenessDecision & {
    multiSourceReadinessRevalidationVerified: true
    canonicalLivenessEvidenceVerified: true
    canonicalLivenessAssessmentVerified: true
    canonicalLivenessDecisionVerified: true

    sourceLivenessAuthorizationRecordId: string
  }

export function revalidateGovernedRuntimeMultiSourcePostReadinessLiveness(
  input: GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationInput,
): GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationResult {
  const {
    readiness,
    observation,
  } = input

  if (
    readiness.multiSourceProcessIdentityRebindingVerified !== true ||
    readiness.canonicalReadinessCandidateVerified !== true ||
    readiness.canonicalReadinessEvidenceVerified !== true ||
    readiness.canonicalReadinessAssessmentVerified !== true ||
    readiness.canonicalReadinessDecisionVerified !== true ||
    readiness.readinessDecisionMade !== true ||
    readiness.readinessGranted !== true ||
    readiness.livenessGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-readiness liveness revalidation requires verified readiness decision.',
    )
  }

  if (
    readiness.restartAuthorized !== false ||
    readiness.deploymentApplied !== false ||
    readiness.runtimeAuthorityGranted !== false ||
    readiness.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-readiness liveness revalidation requires zero inherited operational authority.',
    )
  }

  const evidence =
    recordGovernedRuntimeLivenessEvidence({
      readinessDecision: readiness,
      ...observation,
    })

  const assessment =
    assessGovernedRuntimeLiveness(
      evidence,
    )

  const decision =
    decideGovernedRuntimeLiveness(
      assessment,
    )

  if (
    evidence.livenessEvidenceRecorded !== true ||
    assessment.livenessEvidenceVerified !== true ||
    assessment.assessmentCompleted !== true ||
    decision.livenessAssessmentVerified !== true ||
    decision.livenessDecisionMade !== true
  ) {
    throw new Error(
      'Governed multi-source post-readiness liveness revalidation requires verified canonical liveness chain.',
    )
  }

  if (
    decision.processId !== readiness.processId ||
    decision.readinessGranted !== true ||
    decision.restartAuthorized !== false ||
    decision.deploymentApplied !== false ||
    decision.runtimeAuthorityGranted !== false ||
    decision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-readiness liveness revalidation requires liveness-only authority.',
    )
  }

  return {
    ...decision,

    multiSourceReadinessRevalidationVerified: true,
    canonicalLivenessEvidenceVerified: true,
    canonicalLivenessAssessmentVerified: true,
    canonicalLivenessDecisionVerified: true,

    sourceLivenessAuthorizationRecordId:
      readiness.sourceLivenessAuthorizationRecordId,
  }
}
