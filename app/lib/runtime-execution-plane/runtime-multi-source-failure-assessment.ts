import type {
  GovernedRuntimeFailureEvidenceAggregation,
} from './runtime-failure-evidence-aggregator'

export type GovernedRuntimeMultiSourceFailureClassification =
  | 'none'
  | 'liveness-failure'
  | 'multi-source-failure'

export type GovernedRuntimeMultiSourceFailureAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-multi-source-failure-assessment'

  instanceId: string
  releaseIdentity: string
  livenessAuthorizationRecordId: string
  processId: number

  failureEvidenceAggregationVerified: true
  failureAssessmentCompleted: true

  evidenceSourceCount: 2
  observedFailureSignalCount: number

  livenessFailureSignalObserved: boolean
  heartbeatFailureSignalObserved: boolean
  heartbeatDegradationObserved: boolean

  failureDetected: boolean
  failureClassified: true
  failureClassification: GovernedRuntimeMultiSourceFailureClassification
  recoveryRequired: boolean

  recoveryDecisionMade: false
  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeMultiSourceFailure(
  aggregation: GovernedRuntimeFailureEvidenceAggregation,
): GovernedRuntimeMultiSourceFailureAssessment {
  if (
    aggregation.evidenceAggregationCompleted !== true ||
    aggregation.livenessEvidenceVerified !== true ||
    aggregation.heartbeatEvidenceVerified !== true ||
    aggregation.evidenceSourceCount !== 2 ||
    !Number.isSafeInteger(aggregation.processId) ||
    aggregation.processId <= 0
  ) {
    throw new Error(
      'Governed multi-source failure assessment requires verified evidence aggregation.',
    )
  }

  if (
    aggregation.failureDecisionMade !== false ||
    aggregation.recoveryDecisionMade !== false ||
    aggregation.restartAuthorized !== false ||
    aggregation.restartApplied !== false ||
    aggregation.deploymentApplied !== false ||
    aggregation.runtimeAuthorityGranted !== false ||
    aggregation.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source failure assessment requires zero inherited decision and execution authority.',
    )
  }

  const expectedSignalCount =
    Number(aggregation.livenessFailureSignalObserved) +
    Number(aggregation.heartbeatFailureSignalObserved)

  if (
    aggregation.observedFailureSignalCount !== expectedSignalCount ||
    aggregation.anyFailureSignalObserved !== (expectedSignalCount > 0) ||
    aggregation.allFailureSignalsObserved !== (expectedSignalCount === 2)
  ) {
    throw new Error(
      'Governed multi-source failure assessment requires internally consistent aggregated evidence.',
    )
  }

  const livenessFailure =
    aggregation.livenessFailureSignalObserved

  const heartbeatDegradation =
    aggregation.heartbeatFailureSignalObserved

  const failureDetected = livenessFailure

  const failureClassification:
    GovernedRuntimeMultiSourceFailureClassification =
    !failureDetected
      ? 'none'
      : heartbeatDegradation
        ? 'multi-source-failure'
        : 'liveness-failure'

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-multi-source-failure-assessment',

    instanceId: aggregation.instanceId,
    releaseIdentity: aggregation.releaseIdentity,
    livenessAuthorizationRecordId:
      aggregation.livenessAuthorizationRecordId,
    processId: aggregation.processId,

    failureEvidenceAggregationVerified: true,
    failureAssessmentCompleted: true,

    evidenceSourceCount: 2,
    observedFailureSignalCount:
      aggregation.observedFailureSignalCount,

    livenessFailureSignalObserved:
      aggregation.livenessFailureSignalObserved,
    heartbeatFailureSignalObserved:
      aggregation.heartbeatFailureSignalObserved,
    heartbeatDegradationObserved:
      heartbeatDegradation,

    failureDetected,
    failureClassified: true,
    failureClassification,
    recoveryRequired: failureDetected,

    recoveryDecisionMade: false,
    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
