import type {
  GovernedRuntimeRestartAuthorization,
} from './runtime-restart-authorization'

import type {
  GovernedRuntimeMultiSourceRestartAuthorization,
} from './runtime-multi-source-restart-authorization'

export type GovernedRuntimeMultiSourceRestartAuthorizationAdapterResult =
  GovernedRuntimeRestartAuthorization & {
    adapterVerified: true
    sourceKind:
      'iasevero-governed-runtime-multi-source-restart-authorization'
    sourceLivenessAuthorizationRecordId: string
    sourceRecoveryDecisionVerified: true
  }

export function adaptGovernedRuntimeMultiSourceRestartAuthorization(
  source: GovernedRuntimeMultiSourceRestartAuthorization,
): GovernedRuntimeMultiSourceRestartAuthorizationAdapterResult {
  if (
    source.recoveryDecisionVerified !== true ||
    !Number.isSafeInteger(source.processId) ||
    source.processId <= 0
  ) {
    throw new Error(
      'Governed multi-source restart authorization adapter requires verified source authorization.',
    )
  }

  if (
    source.restartApplied !== false ||
    source.deploymentApplied !== false ||
    source.runtimeAuthorityGranted !== false ||
    source.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source restart authorization adapter requires zero inherited execution authority.',
    )
  }

  const restartEligible =
    source.recoveryRequired === true &&
    source.recoveryApproved === true

  const expectedRestartAuthorized =
    restartEligible &&
    source.restartAuthorizationGranted === true

  if (
    source.restartAuthorized !== expectedRestartAuthorized
  ) {
    throw new Error(
      'Governed multi-source restart authorization adapter requires internally consistent restart authorization.',
    )
  }

  if (
    typeof source.livenessAuthorizationRecordId !== 'string' ||
    source.livenessAuthorizationRecordId.trim().length === 0 ||
    typeof source.restartAuthorizationRecordId !== 'string' ||
    source.restartAuthorizationRecordId.trim().length === 0
  ) {
    throw new Error(
      'Governed multi-source restart authorization adapter requires complete authorization provenance.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-restart-authorization',

    instanceId: source.instanceId,
    releaseIdentity: source.releaseIdentity,

    recoveryAuthorizationRecordId:
      source.livenessAuthorizationRecordId.trim(),

    restartAuthorizationRecordId:
      source.restartAuthorizationRecordId.trim(),

    processId: source.processId,

    recoveryDecisionVerified: true,
    restartEligible,

    restartAuthorizationGranted:
      source.restartAuthorizationGranted,

    restartAuthorized:
      source.restartAuthorized,

    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,

    adapterVerified: true,
    sourceKind:
      'iasevero-governed-runtime-multi-source-restart-authorization',

    sourceLivenessAuthorizationRecordId:
      source.livenessAuthorizationRecordId.trim(),

    sourceRecoveryDecisionVerified: true,
  }
}
