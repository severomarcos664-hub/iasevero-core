import {
  createPostRestartRuntimeReadinessCandidate,
} from './runtime-readiness-candidate'

import {
  recordGovernedRuntimeReadinessEvidenceFromCandidate,
} from './runtime-readiness-evidence'

import {
  assessGovernedRuntimeReadiness,
} from './runtime-readiness-assessment'

import {
  decideGovernedRuntimeReadiness,
} from './runtime-readiness-decision'

import type {
  GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult,
} from './runtime-multi-source-process-identity-rebinding-integration'

type GovernedRuntimeReadinessProbe =
  Omit<
    Parameters<
      typeof recordGovernedRuntimeReadinessEvidenceFromCandidate
    >[0],
    'candidate'
  >

type GovernedRuntimeCanonicalReadinessDecision =
  ReturnType<typeof decideGovernedRuntimeReadiness>

export type GovernedRuntimeMultiSourcePostRebindReadinessRevalidationInput = {
  rebinding:
    GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult
  probe: GovernedRuntimeReadinessProbe
}

export type GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult =
  GovernedRuntimeCanonicalReadinessDecision & {
    multiSourceProcessIdentityRebindingVerified: true
    canonicalReadinessCandidateVerified: true
    canonicalReadinessEvidenceVerified: true
    canonicalReadinessAssessmentVerified: true
    canonicalReadinessDecisionVerified: true

    sourceLivenessAuthorizationRecordId: string
  }

export function revalidateGovernedRuntimeMultiSourcePostRebindReadiness(
  input: GovernedRuntimeMultiSourcePostRebindReadinessRevalidationInput,
): GovernedRuntimeMultiSourcePostRebindReadinessRevalidationResult {
  const {
    rebinding,
    probe,
  } = input

  if (
    rebinding.multiSourceRestartExecutionVerified !== true ||
    rebinding.multiSourceAuthorizationVerified !== true ||
    rebinding.authorizationAdapterVerified !== true ||
    rebinding.restartExecutionVerified !== true ||
    rebinding.processIdentityRebound !== true
  ) {
    throw new Error(
      'Governed multi-source post-rebind readiness revalidation requires verified process identity rebinding.',
    )
  }

  if (
    rebinding.readinessGranted !== false ||
    rebinding.livenessGranted !== false ||
    rebinding.deploymentApplied !== false ||
    rebinding.runtimeAuthorityGranted !== false ||
    rebinding.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-rebind readiness revalidation requires zero inherited operational authority.',
    )
  }

  const candidate =
    createPostRestartRuntimeReadinessCandidate(
      rebinding,
    )

  const evidence =
    recordGovernedRuntimeReadinessEvidenceFromCandidate({
      candidate,
      ...probe,
    })

  const assessment =
    assessGovernedRuntimeReadiness(
      evidence,
    )

  const decision =
    decideGovernedRuntimeReadiness(
      assessment,
    )

  if (
    candidate.source !== 'post-restart-rebinding' ||
    candidate.processIdentityVerified !== true ||
    candidate.readinessEvaluationEligible !== true ||
    evidence.processIdentityVerified !== true ||
    evidence.probeEvidenceRecorded !== true ||
    assessment.readinessEvidenceVerified !== true ||
    assessment.assessmentCompleted !== true ||
    decision.readinessAssessmentVerified !== true ||
    decision.readinessDecisionMade !== true
  ) {
    throw new Error(
      'Governed multi-source post-rebind readiness revalidation requires verified canonical readiness chain.',
    )
  }

  if (
    decision.processId !== rebinding.processId ||
    decision.livenessGranted !== false ||
    decision.restartAuthorized !== false ||
    decision.deploymentApplied !== false ||
    decision.runtimeAuthorityGranted !== false ||
    decision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source post-rebind readiness revalidation requires readiness-only authority.',
    )
  }

  return {
    ...decision,

    multiSourceProcessIdentityRebindingVerified: true,
    canonicalReadinessCandidateVerified: true,
    canonicalReadinessEvidenceVerified: true,
    canonicalReadinessAssessmentVerified: true,
    canonicalReadinessDecisionVerified: true,

    sourceLivenessAuthorizationRecordId:
      rebinding.sourceLivenessAuthorizationRecordId,
  }
}
