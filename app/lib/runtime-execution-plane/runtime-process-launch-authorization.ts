import type {
  GovernedPersistentProcessManifest,
} from './runtime-persistent-process-manifest'

export type GovernedProcessLaunchAuthorizationInput = {
  manifest: GovernedPersistentProcessManifest

  launchAuthorizationGranted: boolean
  authorizationRecordId: string
}

export type GovernedProcessLaunchAuthorizationDecision = {
  schemaVersion: 1
  kind: 'iasevero-governed-process-launch-authorization-decision'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string

  manifestVerified: true

  launchEligible: boolean
  launchAuthorizationGranted: boolean
  launchAuthorized: boolean

  processStarted: false
  processIdAssigned: false
  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false

  promotionApplied: false
  deploymentApplied: false
  executionApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false

  reason: string
}

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(
      `Governed process launch authorization requires ${field}.`,
    )
  }

  return normalized
}

export function evaluateGovernedProcessLaunchAuthorization(
  input: GovernedProcessLaunchAuthorizationInput,
): GovernedProcessLaunchAuthorizationDecision {
  const manifest = input.manifest

  if (
    manifest.instanceBindingVerified !== true ||
    manifest.processSpecificationVerified !== true
  ) {
    throw new Error(
      'Governed process launch authorization requires verified process manifest.',
    )
  }

  if (
    manifest.processStarted !== false ||
    manifest.processIdAssigned !== false ||
    manifest.readinessGranted !== false ||
    manifest.livenessGranted !== false ||
    manifest.restartAuthorized !== false ||
    manifest.promotionApplied !== false ||
    manifest.deploymentApplied !== false ||
    manifest.executionApplied !== false ||
    manifest.runtimeAuthorityGranted !== false ||
    manifest.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed process launch authorization requires pristine zero-authority manifest.',
    )
  }

  const authorizationRecordId = requireNonEmpty(
    input.authorizationRecordId,
    'authorizationRecordId',
  )

  const launchEligible = true
  const launchAuthorizationGranted =
    input.launchAuthorizationGranted === true

  const launchAuthorized =
    launchEligible &&
    launchAuthorizationGranted

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-process-launch-authorization-decision',

    instanceId: manifest.instanceId,
    releaseIdentity: manifest.releaseIdentity,
    authorizationRecordId,

    manifestVerified: true,

    launchEligible,
    launchAuthorizationGranted,
    launchAuthorized,

    processStarted: false,
    processIdAssigned: false,
    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,

    promotionApplied: false,
    deploymentApplied: false,
    executionApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,

    reason: launchAuthorized
      ? 'Governed process launch explicitly authorized; no process materialization applied yet.'
      : 'Governed process launch remains blocked pending explicit authorization.',
  }
}
