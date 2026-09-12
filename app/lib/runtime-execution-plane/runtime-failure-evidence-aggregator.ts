import type {
  GovernedRuntimeLivenessFailureEvidence,
} from './runtime-liveness-failure-evidence'

import type {
  GovernedRuntimeHeartbeatFailureEvidence,
} from './runtime-heartbeat-failure-evidence'

export type GovernedRuntimeFailureEvidenceAggregationInput = {
  livenessEvidence: GovernedRuntimeLivenessFailureEvidence
  heartbeatEvidence: GovernedRuntimeHeartbeatFailureEvidence
}

export type GovernedRuntimeFailureEvidenceAggregation = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-failure-evidence-aggregation'

  instanceId: string
  releaseIdentity: string
  processId: number

  livenessAuthorizationRecordId: string

  evidenceAggregationCompleted: true
  livenessEvidenceVerified: true
  heartbeatEvidenceVerified: true
  evidenceSourceCount: 2

  livenessFailureSignalObserved: boolean
  heartbeatFailureSignalObserved: boolean
  observedFailureSignalCount: number
  anyFailureSignalObserved: boolean
  allFailureSignalsObserved: boolean

  failureDecisionMade: false
  recoveryDecisionMade: false

  restartAuthorized: false
  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function aggregateGovernedRuntimeFailureEvidence(
  input: GovernedRuntimeFailureEvidenceAggregationInput,
): GovernedRuntimeFailureEvidenceAggregation {
  const {
    livenessEvidence,
    heartbeatEvidence,
  } = input

  if (
    livenessEvidence.livenessDecisionVerified !== true ||
    livenessEvidence.failureEvidenceRecorded !== true ||
    heartbeatEvidence.heartbeatHealthAssessmentVerified !== true ||
    heartbeatEvidence.failureEvidenceRecorded !== true
  ) {
    throw new Error(
      'Governed runtime failure evidence aggregation requires verified evidence sources.',
    )
  }

  if (
    livenessEvidence.instanceId !== heartbeatEvidence.instanceId ||
    livenessEvidence.releaseIdentity !== heartbeatEvidence.releaseIdentity ||
    livenessEvidence.processId !== heartbeatEvidence.processId ||
    !Number.isSafeInteger(livenessEvidence.processId) ||
    livenessEvidence.processId <= 0
  ) {
    throw new Error(
      'Governed runtime failure evidence aggregation requires one continuous runtime identity chain.',
    )
  }

  if (
    livenessEvidence.failureDecisionMade !== false ||
    livenessEvidence.recoveryDecisionMade !== false ||
    livenessEvidence.restartAuthorized !== false ||
    livenessEvidence.restartApplied !== false ||
    livenessEvidence.deploymentApplied !== false ||
    livenessEvidence.runtimeAuthorityGranted !== false ||
    livenessEvidence.networkAuthorityGranted !== false ||
    heartbeatEvidence.failureDecisionMade !== false ||
    heartbeatEvidence.recoveryDecisionMade !== false ||
    heartbeatEvidence.restartAuthorized !== false ||
    heartbeatEvidence.restartApplied !== false ||
    heartbeatEvidence.deploymentApplied !== false ||
    heartbeatEvidence.runtimeAuthorityGranted !== false ||
    heartbeatEvidence.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime failure evidence aggregation requires zero inherited decision and execution authority.',
    )
  }

  const livenessFailureSignalObserved =
    livenessEvidence.failureSignalObserved

  const heartbeatFailureSignalObserved =
    heartbeatEvidence.failureSignalObserved

  const observedFailureSignalCount =
    Number(livenessFailureSignalObserved) +
    Number(heartbeatFailureSignalObserved)

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-failure-evidence-aggregation',

    instanceId: livenessEvidence.instanceId,
    releaseIdentity: livenessEvidence.releaseIdentity,
    processId: livenessEvidence.processId,

    livenessAuthorizationRecordId:
      livenessEvidence.authorizationRecordId,

    evidenceAggregationCompleted: true,
    livenessEvidenceVerified: true,
    heartbeatEvidenceVerified: true,
    evidenceSourceCount: 2,

    livenessFailureSignalObserved,
    heartbeatFailureSignalObserved,
    observedFailureSignalCount,
    anyFailureSignalObserved:
      observedFailureSignalCount > 0,
    allFailureSignalsObserved:
      observedFailureSignalCount === 2,

    failureDecisionMade: false,
    recoveryDecisionMade: false,

    restartAuthorized: false,
    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
