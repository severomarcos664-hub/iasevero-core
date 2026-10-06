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
}

export type GovernedFirstLaunchReadinessObservationIntegrationResult = {
  evidence: ReturnType<ReadinessEvidenceRecorder>
  assessment: ReturnType<typeof assessGovernedRuntimeReadiness>
  readinessObservationIntegrated: true
}

export function integrateFirstLaunchReadinessObservation(
  input: GovernedFirstLaunchReadinessObservationIntegrationInput,
): GovernedFirstLaunchReadinessObservationIntegrationResult {
  const { candidate, probe } = input

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
