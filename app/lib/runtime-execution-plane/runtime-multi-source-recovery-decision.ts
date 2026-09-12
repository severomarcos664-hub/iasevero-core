import type {
  GovernedRuntimeMultiSourceFailureAssessment,
  GovernedRuntimeMultiSourceFailureClassification,
} from './runtime-multi-source-failure-assessment'

export type GovernedRuntimeMultiSourceRecoveryDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-multi-source-recovery-decision'

  instanceId: string
  releaseIdentity: string
  livenessAuthorizationRecordId: string
  processId: number

  multiSourceFailureAssessmentVerified: true
  recoveryDecisionMade: true

  observedFailureSignalCount: number
  failureClassification: GovernedRuntimeMultiSourceFailureClassification

  recoveryRequired: boolean
  recoveryApproved: boolean

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function decideGovernedRuntimeMultiSourceRecovery(
  assessment: GovernedRuntimeMultiSourceFailureAssessment,
): GovernedRuntimeMultiSourceRecoveryDecision {
  if (
    assessment.failureEvidenceAggregationVerified !== true ||
    assessment.failureAssessmentCompleted !== true ||
    assessment.failureClassified !== true ||
    assessment.evidenceSourceCount !== 2 ||
    !Number.isSafeInteger(assessment.processId) ||
    assessment.processId <= 0
  ) {
    throw new Error(
      'Governed multi-source recovery decision requires verified multi-source failure assessment.',
    )
  }

  if (
    assessment.recoveryDecisionMade !== false ||
    assessment.restartAuthorized !== false ||
    assessment.restartApplied !== false ||
    assessment.deploymentApplied !== false ||
    assessment.runtimeAuthorityGranted !== false ||
    assessment.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source recovery decision requires zero inherited recovery and execution authority.',
    )
  }

  if (
    assessment.failureDetected !== assessment.recoveryRequired ||
    (
      assessment.failureClassification === 'none' &&
      assessment.failureDetected !== false
    ) ||
    (
      assessment.failureClassification !== 'none' &&
      assessment.failureDetected !== true
    )
  ) {
    throw new Error(
      'Governed multi-source recovery decision requires internally consistent failure assessment.',
    )
  }

  const recoveryRequired =
    assessment.recoveryRequired === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-multi-source-recovery-decision',

    instanceId: assessment.instanceId,
    releaseIdentity: assessment.releaseIdentity,
    livenessAuthorizationRecordId:
      assessment.livenessAuthorizationRecordId,
    processId: assessment.processId,

    multiSourceFailureAssessmentVerified: true,
    recoveryDecisionMade: true,

    observedFailureSignalCount:
      assessment.observedFailureSignalCount,
    failureClassification:
      assessment.failureClassification,

    recoveryRequired,
    recoveryApproved: recoveryRequired,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
