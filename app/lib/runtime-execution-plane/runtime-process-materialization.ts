import type {
  GovernedPersistentProcessManifest,
} from './runtime-persistent-process-manifest'

import type {
  GovernedProcessLaunchAuthorizationDecision,
} from './runtime-process-launch-authorization'

export type GovernedProcessSpawnRequest = {
  executable: 'node'
  entrypoint: 'node_modules/next/dist/bin/next'
  arguments: readonly ['start', '-H', '127.0.0.1', '-p', '3000']
}

export type GovernedProcessSpawnResult = {
  pid: number
}

export type GovernedProcessSpawner = (
  request: GovernedProcessSpawnRequest,
) => Promise<GovernedProcessSpawnResult>

export type GovernedProcessMaterializationInput = {
  manifest: GovernedPersistentProcessManifest
  authorization: GovernedProcessLaunchAuthorizationDecision
}

export type GovernedProcessMaterializationResult = {
  schemaVersion: 1
  kind: 'iasevero-governed-process-materialization-result'

  instanceId: string
  releaseIdentity: string
  authorizationRecordId: string

  authorizationVerified: true
  processSpecificationVerified: true

  processStarted: true
  processIdAssigned: true
  processId: number

  readinessGranted: false
  livenessGranted: false
  restartAuthorized: false

  promotionApplied: false
  deploymentApplied: false
  executionApplied: true
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function requireValidPid(pid: number): number {
  if (!Number.isSafeInteger(pid) || pid <= 0) {
    throw new Error(
      'Governed process materialization requires a valid positive process id.',
    )
  }

  return pid
}

export async function materializeGovernedProcess(
  input: GovernedProcessMaterializationInput,
  spawnProcess: GovernedProcessSpawner,
): Promise<GovernedProcessMaterializationResult> {
  const { manifest, authorization } = input

  if (
    manifest.instanceBindingVerified !== true ||
    manifest.processSpecificationVerified !== true
  ) {
    throw new Error(
      'Governed process materialization requires verified process manifest.',
    )
  }

  if (
    authorization.manifestVerified !== true ||
    authorization.launchEligible !== true ||
    authorization.launchAuthorizationGranted !== true ||
    authorization.launchAuthorized !== true
  ) {
    throw new Error(
      'Governed process materialization requires explicit launch authorization.',
    )
  }

  if (
    authorization.instanceId !== manifest.instanceId ||
    authorization.releaseIdentity !== manifest.releaseIdentity
  ) {
    throw new Error(
      'Governed process materialization requires authorization identity binding.',
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
      'Governed process materialization requires pristine zero-effect manifest.',
    )
  }

  const spawnResult = await spawnProcess({
    executable: manifest.executable,
    entrypoint: manifest.entrypoint,
    arguments: manifest.arguments,
  })

  const processId = requireValidPid(spawnResult.pid)

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-process-materialization-result',

    instanceId: manifest.instanceId,
    releaseIdentity: manifest.releaseIdentity,
    authorizationRecordId: authorization.authorizationRecordId,

    authorizationVerified: true,
    processSpecificationVerified: true,

    processStarted: true,
    processIdAssigned: true,
    processId,

    readinessGranted: false,
    livenessGranted: false,
    restartAuthorized: false,

    promotionApplied: false,
    deploymentApplied: false,
    executionApplied: true,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
