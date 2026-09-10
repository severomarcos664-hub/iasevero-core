import type {
  GovernedRuntimeRestartAuthorization,
} from './runtime-restart-authorization'

export type GovernedRuntimeRestartExecutionRequest = {
  instanceId: string
  releaseIdentity: string
  restartAuthorizationRecordId: string
  previousProcessId: number
}

export type GovernedRuntimeRestartExecutionEffect = {
  newProcessId: number
}

export type GovernedRuntimeRestartExecutor = (
  request: GovernedRuntimeRestartExecutionRequest,
) => Promise<GovernedRuntimeRestartExecutionEffect>

export type GovernedRuntimeRestartExecutionResult = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-restart-execution-result'

  instanceId: string
  releaseIdentity: string
  restartAuthorizationRecordId: string

  previousProcessId: number
  newProcessId: number

  restartAuthorizationVerified: true
  restartExecutionPrepared: true
  restartApplied: true

  processIdentityRebindingRequired: true
  readinessGranted: false
  livenessGranted: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function requireValidReplacementProcessId(
  previousProcessId: number,
  newProcessId: number,
): void {
  if (
    !Number.isSafeInteger(newProcessId) ||
    newProcessId <= 0 ||
    newProcessId === previousProcessId
  ) {
    throw new Error(
      'Governed runtime restart execution requires a distinct valid replacement process id.',
    )
  }
}

export async function executeGovernedRuntimeRestart(
  authorization: GovernedRuntimeRestartAuthorization,
  restartExecutor: GovernedRuntimeRestartExecutor,
): Promise<GovernedRuntimeRestartExecutionResult> {
  if (
    authorization.recoveryDecisionVerified !== true ||
    authorization.restartEligible !== true ||
    authorization.restartAuthorizationGranted !== true ||
    authorization.restartAuthorized !== true ||
    !Number.isSafeInteger(authorization.processId) ||
    authorization.processId <= 0
  ) {
    throw new Error(
      'Governed runtime restart execution requires explicit verified restart authorization.',
    )
  }

  if (
    authorization.restartApplied !== false ||
    authorization.deploymentApplied !== false ||
    authorization.runtimeAuthorityGranted !== false ||
    authorization.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime restart execution requires zero inherited execution authority.',
    )
  }

  const effect = await restartExecutor({
    instanceId: authorization.instanceId,
    releaseIdentity: authorization.releaseIdentity,
    restartAuthorizationRecordId:
      authorization.restartAuthorizationRecordId,
    previousProcessId: authorization.processId,
  })

  requireValidReplacementProcessId(
    authorization.processId,
    effect.newProcessId,
  )

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-restart-execution-result',

    instanceId: authorization.instanceId,
    releaseIdentity: authorization.releaseIdentity,
    restartAuthorizationRecordId:
      authorization.restartAuthorizationRecordId,

    previousProcessId: authorization.processId,
    newProcessId: effect.newProcessId,

    restartAuthorizationVerified: true,
    restartExecutionPrepared: true,
    restartApplied: true,

    processIdentityRebindingRequired: true,
    readinessGranted: false,
    livenessGranted: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
