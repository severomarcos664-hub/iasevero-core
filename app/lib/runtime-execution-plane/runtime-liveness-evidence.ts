import type {
  GovernedRuntimeReadinessDecision,
} from './runtime-readiness-decision'

export type GovernedRuntimeLivenessEvidenceInput = {
  readinessDecision: GovernedRuntimeReadinessDecision

  observedProcessId: number
  observationSequence: number

  processResponsive: boolean
  eventLoopResponsive: boolean
}

export type GovernedRuntimeLivenessEvidence = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-liveness-evidence'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  readinessDecisionVerified: true
  processIdentityVerified: true
  livenessEvidenceRecorded: true

  observationSequence: number
  processResponsive: boolean
  eventLoopResponsive: boolean

  readinessGranted: true
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function recordGovernedRuntimeLivenessEvidence(
  input: GovernedRuntimeLivenessEvidenceInput,
): GovernedRuntimeLivenessEvidence {
  const { readinessDecision } = input

  if (
    readinessDecision.readinessAssessmentVerified !== true ||
    readinessDecision.readinessDecisionMade !== true ||
    readinessDecision.readinessGranted !== true ||
    !Number.isSafeInteger(readinessDecision.processId) ||
    readinessDecision.processId <= 0
  ) {
    throw new Error(
      'Governed runtime liveness evidence requires granted verified readiness decision.',
    )
  }

  if (
    readinessDecision.livenessGranted !== false ||
    readinessDecision.restartAuthorized !== false ||
    readinessDecision.deploymentApplied !== false ||
    readinessDecision.runtimeAuthorityGranted !== false ||
    readinessDecision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime liveness evidence requires zero inherited extended runtime authority.',
    )
  }

  if (
    input.observedProcessId !== readinessDecision.processId ||
    !Number.isSafeInteger(input.observationSequence) ||
    input.observationSequence <= 0
  ) {
    throw new Error(
      'Governed runtime liveness evidence requires identity-bound ordered observation.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-liveness-evidence',

    instanceId: readinessDecision.instanceId,
    releaseIdentity: readinessDecision.releaseIdentity,
    authorizationRecordId: readinessDecision.authorizationRecordId,
    processId: readinessDecision.processId,

    readinessDecisionVerified: true,
    processIdentityVerified: true,
    livenessEvidenceRecorded: true,

    observationSequence: input.observationSequence,
    processResponsive: input.processResponsive,
    eventLoopResponsive: input.eventLoopResponsive,

    readinessGranted: true,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
