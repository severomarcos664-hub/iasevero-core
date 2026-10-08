import type {
  VerifiedProcessIncarnationReadinessHandoff,
} from './runtime-verified-process-incarnation-readiness-handoff'
import {
  recordGovernedRuntimeReadinessEvidenceFromCandidate,
} from './runtime-readiness-evidence'
import {
  assessGovernedRuntimeReadiness,
} from './runtime-readiness-assessment'

type ReadinessEvidenceRecorder =
  typeof recordGovernedRuntimeReadinessEvidenceFromCandidate

type ReadinessEvidenceInput =
  Parameters<ReadinessEvidenceRecorder>[0]

export type GovernedFirstLaunchReadinessObservationIntegrationInput = {
  candidate: ReadinessEvidenceInput['candidate']
  probe: Omit<ReadinessEvidenceInput, 'candidate'>
  verificationHandoff: VerifiedProcessIncarnationReadinessHandoff
}

export type GovernedFirstLaunchReadinessObservationIntegrationResult = {
  evidence: ReturnType<ReadinessEvidenceRecorder>
  assessment: ReturnType<typeof assessGovernedRuntimeReadiness>
  readinessObservationIntegrated: true
}

export function integrateFirstLaunchReadinessObservation(
  input: GovernedFirstLaunchReadinessObservationIntegrationInput,
): GovernedFirstLaunchReadinessObservationIntegrationResult {
  const { candidate, probe, verificationHandoff } = input

  if (
    verificationHandoff.processId !== candidate.processId ||
    verificationHandoff.processIdentityVerified !== true ||
    verificationHandoff.verificationEvaluated !== true ||
    verificationHandoff.identityMatched !== true ||
    verificationHandoff.processIncarnationEvidenceRecorded !== true ||
    verificationHandoff.processIncarnationVerified !== true ||
    verificationHandoff.readinessEvaluationEligible !== true ||
    verificationHandoff.readinessGranted !== false ||
    verificationHandoff.livenessGranted !== false ||
    verificationHandoff.runtimeAuthorityGranted !== false ||
    verificationHandoff.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'First-launch readiness observation integration requires canonical verified process-incarnation readiness handoff.',
    )
  }

  if (
    candidate.processIdentityVerified !== true ||
    candidate.readinessEvaluationEligible !== true ||
    candidate.readinessGranted !== false ||
    candidate.livenessGranted !== false ||
    candidate.runtimeAuthorityGranted !== false ||
    candidate.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'First-launch readiness observation integration requires an eligible zero-authority readiness candidate.',
    )
  }

  const evidence =
    recordGovernedRuntimeReadinessEvidenceFromCandidate({
      candidate,
      ...probe,
    })

  const assessment =
    assessGovernedRuntimeReadiness(evidence)

  if (
    evidence.processId !== candidate.processId ||
    assessment.processId !== candidate.processId ||
    evidence.runtimeAuthorityGranted !== false ||
    evidence.networkAuthorityGranted !== false ||
    assessment.readinessGranted !== false ||
    assessment.livenessGranted !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'First-launch readiness observation integration must preserve process identity and zero inherited authority.',
    )
  }

  return {
    evidence,
    assessment,
    readinessObservationIntegrated: true,
  }
}
