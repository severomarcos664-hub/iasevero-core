import type {
  GovernedRuntimeProcessIdentityBinding,
} from './runtime-process-identity-binding'

export type GovernedPersistentRuntimeLaunchBoundary = {
  schemaVersion: 1
  kind: 'iasevero-governed-persistent-runtime-launch-boundary'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string
  processId: number

  processIdentityVerified: true
  persistentLaunchEligible: true
  persistentLaunchPrepared: true

  processSpawnedByBoundary: false
  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function prepareGovernedPersistentRuntimeLaunch(
  binding: GovernedRuntimeProcessIdentityBinding,
): GovernedPersistentRuntimeLaunchBoundary {
  if (
    binding.processIdentityBound !== true ||
    binding.instanceIdVerified !== true ||
    binding.releaseIdentityVerified !== true ||
    binding.authorizationRecordVerified !== true ||
    binding.processIdVerified !== true ||
    !Number.isSafeInteger(binding.processId) ||
    binding.processId <= 0
  ) {
    throw new Error(
      'Governed persistent runtime launch requires verified process identity binding.',
    )
  }

  if (
    binding.readinessGranted !== false ||
    binding.livenessGranted !== false ||
    binding.restartAuthorized !== false ||
    binding.deploymentApplied !== false ||
    binding.runtimeAuthorityGranted !== false ||
    binding.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed persistent runtime launch requires zero inherited runtime authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-persistent-runtime-launch-boundary',

    instanceId: binding.instanceId,
    releaseIdentity: binding.releaseIdentity,
    authorizationRecordId: binding.authorizationRecordId,
    processId: binding.processId,

    processIdentityVerified: true,
    persistentLaunchEligible: true,
    persistentLaunchPrepared: true,

    processSpawnedByBoundary: false,
    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
