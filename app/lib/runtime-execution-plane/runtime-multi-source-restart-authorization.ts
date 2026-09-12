import type {
  GovernedRuntimeMultiSourceRecoveryDecision,
} from './runtime-multi-source-recovery-decision'

export type GovernedRuntimeMultiSourceRestartAuthorizationInput = {
  recoveryDecision: GovernedRuntimeMultiSourceRecoveryDecision
  restartAuthorizationRecordId: string
  restartAuthorizationGranted: boolean
}

export type GovernedRuntimeMultiSourceRestartAuthorization = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-multi-source-restart-authorization'

  instanceId: string
  releaseIdentity: string
  livenessAuthorizationRecordId: string
  processId: number

  recoveryDecisionVerified: true
  recoveryRequired: boolean
  recoveryApproved: boolean

  restartAuthorizationRecordId: string
  restartAuthorizationGranted: boolean
  restartAuthorized: boolean

  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function authorizeGovernedRuntimeMultiSourceRestart(
  input: GovernedRuntimeMultiSourceRestartAuthorizationInput,
): GovernedRuntimeMultiSourceRestartAuthorization {
  const {
    recoveryDecision,
    restartAuthorizationRecordId,
    restartAuthorizationGranted,
  } = input

  if (
    recoveryDecision.multiSourceFailureAssessmentVerified !== true ||
    recoveryDecision.recoveryDecisionMade !== true ||
    !Number.isSafeInteger(recoveryDecision.processId) ||
    recoveryDecision.processId <= 0
  ) {
    throw new Error(
      'Governed multi-source restart authorization requires verified recovery decision.',
    )
  }

  if (
    recoveryDecision.restartAuthorized !== false ||
    recoveryDecision.restartApplied !== false ||
    recoveryDecision.deploymentApplied !== false ||
    recoveryDecision.runtimeAuthorityGranted !== false ||
    recoveryDecision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source restart authorization requires zero inherited restart and execution authority.',
    )
  }

  if (
    recoveryDecision.recoveryRequired !==
      recoveryDecision.recoveryApproved
  ) {
    throw new Error(
      'Governed multi-source restart authorization requires internally consistent recovery decision.',
    )
  }

  if (
    typeof restartAuthorizationRecordId !== 'string' ||
    restartAuthorizationRecordId.trim().length === 0
  ) {
    throw new Error(
      'Governed multi-source restart authorization requires authorization record identity.',
    )
  }

  const restartAuthorized =
    recoveryDecision.recoveryRequired === true &&
    recoveryDecision.recoveryApproved === true &&
    restartAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-multi-source-restart-authorization',

    instanceId: recoveryDecision.instanceId,
    releaseIdentity: recoveryDecision.releaseIdentity,
    livenessAuthorizationRecordId:
      recoveryDecision.livenessAuthorizationRecordId,
    processId: recoveryDecision.processId,

    recoveryDecisionVerified: true,
    recoveryRequired:
      recoveryDecision.recoveryRequired,
    recoveryApproved:
      recoveryDecision.recoveryApproved,

    restartAuthorizationRecordId:
      restartAuthorizationRecordId.trim(),
    restartAuthorizationGranted,
    restartAuthorized,

    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
