import type {
  GovernedRuntimeInstanceIdentity,
} from '../runtime-instance-identity/runtime-instance-identity'

export type GovernedPersistentProcessManifestInput = {
  instanceIdentity: GovernedRuntimeInstanceIdentity

  host: '127.0.0.1'
  port: 3000

  executable: 'node'
  entrypoint: 'node_modules/next/dist/bin/next'
  arguments: readonly ['start', '-H', '127.0.0.1', '-p', '3000']
}

export type GovernedPersistentProcessManifest = {
  schemaVersion: 1
  kind: 'iasevero-governed-persistent-process-manifest'

  instanceId: string
  releaseIdentity: string
  sourceCommit: string
  artifactSha256: string

  processType: 'next-production-server'

  host: '127.0.0.1'
  port: 3000

  executable: 'node'
  entrypoint: 'node_modules/next/dist/bin/next'
  arguments: readonly ['start', '-H', '127.0.0.1', '-p', '3000']

  instanceBindingVerified: true
  processSpecificationVerified: true

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
}

function requireExact<T>(
  actual: T,
  expected: T,
  field: string,
): T {
  if (actual !== expected) {
    throw new Error(
      `Governed persistent process manifest requires exact ${field}.`,
    )
  }

  return actual
}

export function createGovernedPersistentProcessManifest(
  input: GovernedPersistentProcessManifestInput,
): GovernedPersistentProcessManifest {
  const identity = input.instanceIdentity

  if (
    identity.releaseBindingVerified !== true ||
    identity.instanceIdentityCreated !== true
  ) {
    throw new Error(
      'Governed persistent process manifest requires verified runtime instance identity.',
    )
  }

  if (
    identity.promotionApplied !== false ||
    identity.deploymentApplied !== false ||
    identity.executionApplied !== false ||
    identity.runtimeAuthorityGranted !== false ||
    identity.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed persistent process manifest requires zero inherited authority.',
    )
  }

  requireExact(input.host, '127.0.0.1', 'host')
  requireExact(input.port, 3000, 'port')
  requireExact(input.executable, 'node', 'executable')
  requireExact(
    input.entrypoint,
    'node_modules/next/dist/bin/next',
    'entrypoint',
  )

  if (
    input.arguments.length !== 5 ||
    input.arguments[0] !== 'start' ||
    input.arguments[1] !== '-H' ||
    input.arguments[2] !== '127.0.0.1' ||
    input.arguments[3] !== '-p' ||
    input.arguments[4] !== '3000'
  ) {
    throw new Error(
      'Governed persistent process manifest requires exact Next.js production arguments.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-persistent-process-manifest',

    instanceId: identity.instanceId,
    releaseIdentity: identity.releaseIdentity,
    sourceCommit: identity.sourceCommit,
    artifactSha256: identity.artifactSha256,

    processType: 'next-production-server',

    host: '127.0.0.1',
    port: 3000,

    executable: 'node',
    entrypoint: 'node_modules/next/dist/bin/next',
    arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],

    instanceBindingVerified: true,
    processSpecificationVerified: true,

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
  }
}
