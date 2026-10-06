import assert from 'node:assert/strict'
import { createRuntimePhysicalProcessSpawner } from '../app/lib/runtime-execution-plane/runtime-physical-process-spawner'
import { materializeGovernedProcess } from '../app/lib/runtime-execution-plane/runtime-process-materialization'
import { createGovernedReleaseRuntimeIdentity } from '../app/lib/runtime-release-identity/runtime-release-identity'
import { createGovernedRuntimeInstanceIdentity } from '../app/lib/runtime-instance-identity/runtime-instance-identity'
import { createGovernedPersistentProcessManifest } from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'
import { evaluateGovernedProcessLaunchAuthorization } from '../app/lib/runtime-execution-plane/runtime-process-launch-authorization'


async function main() {
  const physicalSpawner = createRuntimePhysicalProcessSpawner(
    ((..._args: Parameters<typeof import('node:child_process').spawn>) =>
      ({ pid: 424242 })) as typeof import('node:child_process').spawn,
  )

  assert.equal(typeof physicalSpawner, 'function')
  assert.equal(typeof materializeGovernedProcess, 'function')

  console.log('PHYSICAL_SPAWNER_COMPOSED=TRUE')
  console.log('MATERIALIZER_COMPOSED=TRUE')
  console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
  console.log('GOVERNED_PHYSICAL_COMPOSITION=PROVED')

  const manifest = createGovernedPersistentProcessManifest({
    instanceIdentity: createGovernedRuntimeInstanceIdentity({
      releaseIdentity: createGovernedReleaseRuntimeIdentity({
        releaseIdentity: 'matrix-proof-release',
        sourceCommit: 'a'.repeat(64),
        sourceTag: 'matrix-proof',
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
      }),
      instanceId: 'matrix-proof',
      startedAt: '2026-10-05T00:00:00.000Z',
    }),
    host: '127.0.0.1',
    port: 3000,
    executable: 'node',
    entrypoint: 'node_modules/next/dist/bin/next',
    arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
  })

  const authorization = evaluateGovernedProcessLaunchAuthorization({
    manifest,
    launchAuthorizationGranted: true,
    authorizationRecordId: 'matrix-proof-auth',
  })

  const result = await materializeGovernedProcess(
    { manifest, authorization },
    physicalSpawner,
  )

  assert.equal(result.processStarted, true)
  assert.equal(result.processId, 424242)
  assert.equal(result.runtimeAuthorityGranted, false)
  assert.equal(result.networkAuthorityGranted, false)

  console.log('GOVERNED_MANIFEST_TO_PHYSICAL_SPAWN=PROVED')

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
