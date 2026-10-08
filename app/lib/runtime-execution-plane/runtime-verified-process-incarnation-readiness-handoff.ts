import type {
  ControlledProcessIncarnationVerificationDecision,
} from './runtime-controlled-process-incarnation-verification-decision'

import type {
  GovernedRuntimeReadinessCandidate,
} from './runtime-readiness-candidate'

export type VerifiedProcessIncarnationReadinessHandoffInput = {
  verification: ControlledProcessIncarnationVerificationDecision
  candidate: GovernedRuntimeReadinessCandidate
}

export type VerifiedProcessIncarnationReadinessHandoff = {
  schemaVersion: 1
  kind: 'iasevero-verified-process-incarnation-readiness-handoff'

  processId: number

  processIdentityVerified: true
  verificationEvaluated: true
  identityMatched: true
  processIncarnationEvidenceRecorded: true
  processIncarnationVerified: true

  readinessEvaluationEligible: true

  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createVerifiedProcessIncarnationReadinessHandoff(
  input: VerifiedProcessIncarnationReadinessHandoffInput,
): VerifiedProcessIncarnationReadinessHandoff {
  const { verification, candidate } = input

  if (
    verification.verificationEvaluated !== true ||
    verification.identityMatched !== true ||
    verification.processIncarnationEvidenceRecorded !== true ||
    verification.processIncarnationVerified !== true ||
    verification.readinessGranted !== false ||
    verification.livenessGranted !== false ||
    verification.runtimeAuthorityGranted !== false ||
    verification.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Verified process incarnation readiness handoff requires canonical verified zero-authority process incarnation.',
    )
  }

  if (
    candidate.processIdentityVerified !== true ||
    candidate.readinessEvaluationEligible !== true ||
    candidate.readinessGranted !== false ||
    candidate.livenessGranted !== false ||
    candidate.runtimeAuthorityGranted !== false ||
    candidate.networkAuthorityGranted !== false ||
    !Number.isSafeInteger(candidate.processId) ||
    candidate.processId <= 0
  ) {
    throw new Error(
      'Verified process incarnation readiness handoff requires eligible zero-authority readiness candidate.',
    )
  }

  if (verification.processId !== candidate.processId) {
    throw new Error(
      'Verified process incarnation readiness handoff requires exact process identity continuity.',
    )
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    kind: 'iasevero-verified-process-incarnation-readiness-handoff' as const,

    processId: candidate.processId,

    processIdentityVerified: true as const,
    verificationEvaluated: true as const,
    identityMatched: true as const,
    processIncarnationEvidenceRecorded: true as const,
    processIncarnationVerified: true as const,

    readinessEvaluationEligible: true as const,

    readinessGranted: false as const,
    livenessGranted: false as const,
    runtimeAuthorityGranted: false as const,
    networkAuthorityGranted: false as const,
  })
}
