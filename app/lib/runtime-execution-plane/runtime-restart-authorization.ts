import type {
  GovernedRuntimeRecoveryDecision,
} from './runtime-recovery-decision'

export type GovernedRuntimeRestartAuthorizationInput = {
  recoveryDecision: GovernedRuntimeRecoveryDecision
  restartAuthorizationRecordId: string
  restartAuthorizationGranted: boolean
}

export type GovernedRuntimeRestartAuthorization = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-restart-authorization'

  instanceId: string
  releaseIdentity: string
  recoveryAuthorizationRecordId: string
  restartAuthorizationRecordId: string
  processId: number

  recoveryDecisionVerified: true
  restartEligible: boolean
  restartAuthorizationGranted: boolean
  restartAuthorized: boolean

  restartApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function authorizeGovernedRuntimeRestart(
  input: GovernedRuntimeRestartAuthorizationInput,
): GovernedRuntimeRestartAuthorization {
  const { recoveryDecision } = input

  if (
    recoveryDecision.failureAssessmentVerified !== true ||
    recoveryDecision.recoveryDecisionMade !== true ||
    !Number.isSafeInteger(recoveryDecision.processId) ||
    recoveryDecision.processId <= 0
  ) {
    throw new Error(
      'Governed runtime restart authorization requires verified recovery decision.',
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
      'Governed runtime restart authorization requires zero inherited restart authority.',
    )
  }

  if (input.restartAuthorizationRecordId.trim().length === 0) {
    throw new Error(
      'Governed runtime restart authorization requires explicit authorization record.',
    )
  }

  const restartEligible =
    recoveryDecision.recoveryRequired === true &&
    recoveryDecision.recoveryApproved === true

  const restartAuthorized =
    restartEligible &&
    input.restartAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-restart-authorization',

    instanceId: recoveryDecision.instanceId,
    releaseIdentity: recoveryDecision.releaseIdentity,
    recoveryAuthorizationRecordId:
      recoveryDecision.authorizationRecordId,
    restartAuthorizationRecordId:
      input.restartAuthorizationRecordId,
    processId: recoveryDecision.processId,

    recoveryDecisionVerified: true,
    restartEligible,
    restartAuthorizationGranted:
      input.restartAuthorizationGranted,
    restartAuthorized,

    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
