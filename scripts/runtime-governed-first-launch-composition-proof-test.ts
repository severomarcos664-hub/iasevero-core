import assert from 'node:assert/strict'

import { composeGovernedFirstLaunch } from '../app/lib/runtime-execution-plane/runtime-first-launch-composition'
import type { GovernedProcessSpawner } from '../app/lib/runtime-execution-plane/runtime-process-materialization'
import { createGovernedReleaseRuntimeIdentity } from '../app/lib/runtime-release-identity/runtime-release-identity'
import { createGovernedRuntimeInstanceIdentity } from '../app/lib/runtime-instance-identity/runtime-instance-identity'
import { createGovernedPersistentProcessManifest } from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'
import { evaluateGovernedProcessLaunchAuthorization } from '../app/lib/runtime-execution-plane/runtime-process-launch-authorization'

async function main() {
  let spawnCalls = 0

  const controlledSpawner: GovernedProcessSpawner = async () => {
    spawnCalls += 1
    return { pid: 424242 }
  }

  const releaseIdentity = createGovernedReleaseRuntimeIdentity({
    releaseIdentity: 'matrix-first-launch-release',
    sourceCommit: 'a'.repeat(64),
    sourceTag: 'matrix-first-launch',
    artifactSha256: 'b'.repeat(64),
    attestationSha256: 'c'.repeat(64),
    contentAddress: `sha256:${'b'.repeat(64)}`,
    signerKeyId: 'matrix-proof-signer',
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
    instanceId: 'matrix-first-launch',
    startedAt: '2026-10-05T00:00:00.000Z',
  })

  const manifest = createGovernedPersistentProcessManifest({
    instanceIdentity,
    host: '127.0.0.1',
    port: 3000,
    executable: 'node',
    entrypoint: 'node_modules/next/dist/bin/next',
    arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
  })

  const authorization = evaluateGovernedProcessLaunchAuthorization({
    manifest,
    launchAuthorizationGranted: true,
    authorizationRecordId: 'matrix-first-launch-auth',
  })

  const result = await composeGovernedFirstLaunch(
    { manifest, authorization },
    controlledSpawner,
  )

  assert.equal(spawnCalls, 1)
  assert.equal(result.materialization.processStarted, true)
  assert.equal(result.materialization.processId, 424242)
  assert.equal(result.identityBinding.processIdentityBound, true)
  assert.equal(result.persistentLaunch.persistentLaunchPrepared, true)
  assert.equal(result.persistentLaunch.processSpawnedByBoundary, false)
  assert.equal(result.persistentLaunch.runtimeAuthorityGranted, false)
  assert.equal(result.persistentLaunch.networkAuthorityGranted, false)

  console.log('CONTROLLED_SPAWN_CALLS=1')
  console.log('CONTROLLED_PROCESS_ID=424242')
  console.log('PROCESS_IDENTITY_BOUND=TRUE')
  console.log('PERSISTENT_LAUNCH_PREPARED=TRUE')
  console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
  console.log('FIRST_LAUNCH_COMPOSITION=PROVED')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
