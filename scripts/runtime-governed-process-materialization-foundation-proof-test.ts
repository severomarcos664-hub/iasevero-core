import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import {
  createGovernedRuntimeInstanceIdentity,
} from '../app/lib/runtime-instance-identity/runtime-instance-identity'

import {
  createGovernedPersistentProcessManifest,
} from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'

import {
  evaluateGovernedProcessLaunchAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-process-launch-authorization'

import {
  materializeGovernedProcess,
  type GovernedProcessSpawner,
} from '../app/lib/runtime-execution-plane/runtime-process-materialization'

const artifactSha256 = 'a'.repeat(64)
const attestationSha256 = 'b'.repeat(64)

const releaseIdentity = createGovernedReleaseRuntimeIdentity({
  releaseIdentity: 'v287.73.1-governed-release-runtime-identity',
  sourceCommit: '0123456789abcdef0123456789abcdef01234567',
  sourceTag: 'v287.73.1-governed-release-runtime-identity-foundation-proof',
  artifactSha256,
  attestationSha256,
  contentAddress: `sha256:${artifactSha256}`,
  signerKeyId: 'ed25519:test-release-signer',

  provenanceVerified: true,
  attestationVerified: true,
  signatureVerified: true,
  artifactCreated: true,
  artifactDigestVerified: true,
  contentAddressDerived: true,

  promotionApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
})

const instanceIdentity = createGovernedRuntimeInstanceIdentity({
  releaseIdentity,
  instanceId: 'runtime-instance-v28773-materialization-0001',
  startedAt: '2026-09-08T23:27:00.000Z',
})

const manifest = createGovernedPersistentProcessManifest({
  instanceIdentity,
  host: '127.0.0.1',
  port: 3000,
  executable: 'node',
  entrypoint: 'node_modules/next/dist/bin/next',
  arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
})

const authorization =
  evaluateGovernedProcessLaunchAuthorization({
    manifest,
    launchAuthorizationGranted: true,
    authorizationRecordId: 'auth-record-v28773-materialization',
  })

let spawnCallCount = 0

const controlledSpawner: GovernedProcessSpawner = async (request) => {
  spawnCallCount += 1

  assert.equal(request.executable, 'node')
  assert.equal(
    request.entrypoint,
    'node_modules/next/dist/bin/next',
  )
  assert.deepEqual(
    request.arguments,
    ['start', '-H', '127.0.0.1', '-p', '3000'],
  )

  return {
    pid: 424242,
  }
}

const result = await materializeGovernedProcess(
  {
    manifest,
    authorization,
  },
  controlledSpawner,
)

assert.equal(spawnCallCount, 1)

assert.equal(result.authorizationVerified, true)
assert.equal(result.processSpecificationVerified, true)

assert.equal(result.processStarted, true)
assert.equal(result.processIdAssigned, true)
assert.equal(result.processId, 424242)

assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.restartAuthorized, false)

assert.equal(result.promotionApplied, false)
assert.equal(result.deploymentApplied, false)
assert.equal(result.executionApplied, true)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

let deniedSpawnCallCount = 0

const deniedSpawner: GovernedProcessSpawner = async () => {
  deniedSpawnCallCount += 1
  return { pid: 999999 }
}

const deniedAuthorization =
  evaluateGovernedProcessLaunchAuthorization({
    manifest,
    launchAuthorizationGranted: false,
    authorizationRecordId: 'auth-record-v28773-denied',
  })

await assert.rejects(
  () =>
    materializeGovernedProcess(
      {
        manifest,
        authorization: deniedAuthorization,
      },
      deniedSpawner,
    ),
  /requires explicit launch authorization/,
)

assert.equal(deniedSpawnCallCount, 0)

const invalidPidSpawner: GovernedProcessSpawner = async () => ({
  pid: 0,
})

await assert.rejects(
  () =>
    materializeGovernedProcess(
      {
        manifest,
        authorization,
      },
      invalidPidSpawner,
    ),
  /requires a valid positive process id/,
)

await assert.rejects(
  () =>
    materializeGovernedProcess(
      {
        manifest,
        authorization: {
          ...authorization,
          instanceId: 'different-instance',
        },
      },
      controlledSpawner,
    ),
  /requires authorization identity binding/,
)

console.log({
  architecture:
    'verified-manifest -> explicit-launch-authorization -> controlled-materialization -> pid-binding',
  spawnCallCount,
  processStarted: result.processStarted,
  processIdAssigned: result.processIdAssigned,
  processId: result.processId,
  readinessGranted: result.readinessGranted,
  livenessGranted: result.livenessGranted,
  restartAuthorized: result.restartAuthorized,
  executionApplied: result.executionApplied,
  runtimeAuthorityGranted: result.runtimeAuthorityGranted,
  networkAuthorityGranted: result.networkAuthorityGranted,
  realProcessStarted: false,
})

console.log(
  'Runtime governed process materialization foundation proof passed.',
)
