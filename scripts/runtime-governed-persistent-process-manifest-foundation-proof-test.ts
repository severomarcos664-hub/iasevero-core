import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import {
  createGovernedRuntimeInstanceIdentity,
} from '../app/lib/runtime-instance-identity/runtime-instance-identity'

import {
  createGovernedPersistentProcessManifest,
  type GovernedPersistentProcessManifestInput,
} from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'

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
  instanceId: 'runtime-instance-v28773-0001',
  startedAt: '2026-09-08T22:52:00.000Z',
})

const validInput: GovernedPersistentProcessManifestInput = {
  instanceIdentity,
  host: '127.0.0.1',
  port: 3000,
  executable: 'node',
  entrypoint: 'node_modules/next/dist/bin/next',
  arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
}

const manifest = createGovernedPersistentProcessManifest(validInput)

assert.equal(manifest.schemaVersion, 1)
assert.equal(
  manifest.kind,
  'iasevero-governed-persistent-process-manifest',
)

assert.equal(manifest.instanceId, instanceIdentity.instanceId)
assert.equal(manifest.releaseIdentity, instanceIdentity.releaseIdentity)
assert.equal(manifest.sourceCommit, instanceIdentity.sourceCommit)
assert.equal(manifest.artifactSha256, instanceIdentity.artifactSha256)

assert.equal(manifest.processType, 'next-production-server')
assert.equal(manifest.host, '127.0.0.1')
assert.equal(manifest.port, 3000)
assert.equal(manifest.executable, 'node')
assert.equal(
  manifest.entrypoint,
  'node_modules/next/dist/bin/next',
)
assert.deepEqual(
  manifest.arguments,
  ['start', '-H', '127.0.0.1', '-p', '3000'],
)

assert.equal(manifest.instanceBindingVerified, true)
assert.equal(manifest.processSpecificationVerified, true)

assert.equal(manifest.processStarted, false)
assert.equal(manifest.processIdAssigned, false)
assert.equal(manifest.readinessGranted, false)
assert.equal(manifest.livenessGranted, false)
assert.equal(manifest.restartAuthorized, false)

assert.equal(manifest.promotionApplied, false)
assert.equal(manifest.deploymentApplied, false)
assert.equal(manifest.executionApplied, false)
assert.equal(manifest.runtimeAuthorityGranted, false)
assert.equal(manifest.networkAuthorityGranted, false)

function expectBlocked(
  name: string,
  candidate: unknown,
  expectedMessage: RegExp,
): void {
  assert.throws(
    () =>
      createGovernedPersistentProcessManifest(
        candidate as GovernedPersistentProcessManifestInput,
      ),
    expectedMessage,
    name,
  )
}

expectBlocked(
  'unverified release binding',
  {
    ...validInput,
    instanceIdentity: {
      ...instanceIdentity,
      releaseBindingVerified: false,
    },
  },
  /requires verified runtime instance identity/,
)

expectBlocked(
  'instance identity not created',
  {
    ...validInput,
    instanceIdentity: {
      ...instanceIdentity,
      instanceIdentityCreated: false,
    },
  },
  /requires verified runtime instance identity/,
)

expectBlocked(
  'execution authority inherited',
  {
    ...validInput,
    instanceIdentity: {
      ...instanceIdentity,
      executionApplied: true,
    },
  },
  /requires zero inherited authority/,
)

expectBlocked(
  'runtime authority inherited',
  {
    ...validInput,
    instanceIdentity: {
      ...instanceIdentity,
      runtimeAuthorityGranted: true,
    },
  },
  /requires zero inherited authority/,
)

expectBlocked(
  'wrong host',
  {
    ...validInput,
    host: '0.0.0.0',
  },
  /requires exact host/,
)

expectBlocked(
  'wrong port',
  {
    ...validInput,
    port: 8080,
  },
  /requires exact port/,
)

expectBlocked(
  'wrong executable',
  {
    ...validInput,
    executable: 'bash',
  },
  /requires exact executable/,
)

expectBlocked(
  'wrong entrypoint',
  {
    ...validInput,
    entrypoint: 'dist/index.js',
  },
  /requires exact entrypoint/,
)

expectBlocked(
  'wrong arguments',
  {
    ...validInput,
    arguments: ['start', '-H', '0.0.0.0', '-p', '3000'],
  },
  /requires exact Next\.js production arguments/,
)

console.log({
  architecture:
    'runtime-instance-identity -> governed-persistent-process-manifest -> no-process-start',
  processType: manifest.processType,
  instanceBindingVerified: manifest.instanceBindingVerified,
  processSpecificationVerified: manifest.processSpecificationVerified,
  processStarted: manifest.processStarted,
  processIdAssigned: manifest.processIdAssigned,
  readinessGranted: manifest.readinessGranted,
  livenessGranted: manifest.livenessGranted,
  restartAuthorized: manifest.restartAuthorized,
  runtimeAuthorityGranted: manifest.runtimeAuthorityGranted,
  networkAuthorityGranted: manifest.networkAuthorityGranted,
  negativeCases: 9,
})

console.log(
  'Runtime governed persistent process manifest foundation proof passed.',
)
