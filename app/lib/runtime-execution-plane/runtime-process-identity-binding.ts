import type {
  GovernedProcessMaterializationResult,
} from './runtime-process-materialization'

export type GovernedRuntimeProcessIdentityBinding = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-process-identity-binding'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  processIdentityBound: true
  instanceIdVerified: true
  releaseIdentityVerified: true
  authorizationRecordVerified: true
  processIdVerified: true

  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function bindGovernedRuntimeProcessIdentity(
  materialization: GovernedProcessMaterializationResult,
): GovernedRuntimeProcessIdentityBinding {
  if (
    materialization.authorizationVerified !== true ||
    materialization.processSpecificationVerified !== true ||
    materialization.processStarted !== true ||
    materialization.processIdAssigned !== true ||
    !Number.isSafeInteger(materialization.processId) ||
    materialization.processId <= 0
  ) {
    throw new Error(
      'Governed runtime process identity binding requires verified materialization.',
    )
  }

  if (
    materialization.readinessGranted !== false ||
    materialization.livenessGranted !== false ||
    materialization.restartAuthorized !== false ||
    materialization.deploymentApplied !== false ||
    materialization.runtimeAuthorityGranted !== false ||
    materialization.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime process identity binding requires zero inherited runtime authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-process-identity-binding',

    instanceId: materialization.instanceId,
    releaseIdentity: materialization.releaseIdentity,
    authorizationRecordId: materialization.authorizationRecordId,
    processId: materialization.processId,

    processIdentityBound: true,
    instanceIdVerified: true,
    releaseIdentityVerified: true,
    authorizationRecordVerified: true,
    processIdVerified: true,

    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
