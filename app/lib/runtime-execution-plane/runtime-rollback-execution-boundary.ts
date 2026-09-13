import type {
  GovernedRuntimeRollbackAuthorization,
} from './runtime-rollback-authorization'

export type GovernedRuntimeRollbackExecutorInput = {
  instanceId: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackAuthorizationRecordId: string
}

export type GovernedRuntimeRollbackExecutorResult = {
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string
  rollbackApplied: true
}

export type GovernedRuntimeRollbackExecutor = (
  input: GovernedRuntimeRollbackExecutorInput,
) => Promise<GovernedRuntimeRollbackExecutorResult>

export type GovernedRuntimeRollbackExecutionBoundaryInput = {
  authorization: GovernedRuntimeRollbackAuthorization
  executor: GovernedRuntimeRollbackExecutor
}

export type GovernedRuntimeRollbackExecutionBoundaryResult = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-execution-boundary'

  instanceId: string
  releaseIdentity: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackAuthorizationRecordId: string

  rollbackAuthorizationVerified: true
  rollbackExecutionVerified: true
  rollbackApplied: true

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export async function executeGovernedRuntimeRollbackBoundary(
  input: GovernedRuntimeRollbackExecutionBoundaryInput,
): Promise<GovernedRuntimeRollbackExecutionBoundaryResult> {
  const {
    authorization,
    executor,
  } = input

  if (
    authorization.rollbackDecisionVerified !== true ||
    authorization.rollbackEligible !== true ||
    authorization.rollbackAuthorizationGranted !== true ||
    authorization.rollbackAuthorized !== true ||
    authorization.rollbackAuthorizationRecordId.trim().length === 0 ||
    !Number.isSafeInteger(authorization.processId) ||
    authorization.processId <= 0
  ) {
    throw new Error(
      'Governed runtime rollback execution boundary requires explicit rollback authorization.',
    )
  }

  if (
    authorization.rollbackApplied !== false ||
    authorization.trafficSwitchAuthorized !== false ||
    authorization.trafficSwitchApplied !== false ||
    authorization.deploymentApplied !== false ||
    authorization.runtimeAuthorityGranted !== false ||
    authorization.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback execution boundary requires zero inherited execution effect.',
    )
  }

  const effect = await executor({
    instanceId: authorization.instanceId,
    processId: authorization.processId,

    rollbackFromReleaseIdentity:
      authorization.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      authorization.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      authorization.rollbackTargetContentAddress,

    rollbackAuthorizationRecordId:
      authorization.rollbackAuthorizationRecordId,
  })

  if (
    effect.rollbackApplied !== true ||
    effect.rollbackTargetReleaseIdentity !==
      authorization.rollbackTargetReleaseIdentity ||
    effect.rollbackTargetContentAddress !==
      authorization.rollbackTargetContentAddress
  ) {
    throw new Error(
      'Governed runtime rollback execution boundary requires verified canonical rollback effect.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-execution-boundary',

    instanceId: authorization.instanceId,
    releaseIdentity: authorization.releaseIdentity,
    processId: authorization.processId,

    rollbackFromReleaseIdentity:
      authorization.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      authorization.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      authorization.rollbackTargetContentAddress,

    rollbackAuthorizationRecordId:
      authorization.rollbackAuthorizationRecordId,

    rollbackAuthorizationVerified: true,
    rollbackExecutionVerified: true,
    rollbackApplied: true,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
