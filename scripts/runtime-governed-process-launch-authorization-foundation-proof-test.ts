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
  type GovernedProcessLaunchAuthorizationInput,
} from '../app/lib/runtime-execution-plane/runtime-process-launch-authorization'

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
  startedAt: '2026-09-08T22:58:00.000Z',
})

const manifest = createGovernedPersistentProcessManifest({
  instanceIdentity,
  host: '127.0.0.1',
  port: 3000,
  executable: 'node',
  entrypoint: 'node_modules/next/dist/bin/next',
  arguments: ['start', '-H', '127.0.0.1', '-p', '3000'],
})

const deniedInput: GovernedProcessLaunchAuthorizationInput = {
  manifest,
  launchAuthorizationGranted: false,
  authorizationRecordId: 'auth-record-v28773-denied',
}

const denied =
  evaluateGovernedProcessLaunchAuthorization(deniedInput)

assert.equal(denied.manifestVerified, true)
assert.equal(denied.launchEligible, true)
assert.equal(denied.launchAuthorizationGranted, false)
assert.equal(denied.launchAuthorized, false)

assert.equal(denied.processStarted, false)
assert.equal(denied.processIdAssigned, false)
assert.equal(denied.readinessGranted, false)
assert.equal(denied.livenessGranted, false)
assert.equal(denied.restartAuthorized, false)

assert.equal(denied.promotionApplied, false)
assert.equal(denied.deploymentApplied, false)
assert.equal(denied.executionApplied, false)
assert.equal(denied.runtimeAuthorityGranted, false)
assert.equal(denied.networkAuthorityGranted, false)

const authorizedInput: GovernedProcessLaunchAuthorizationInput = {
  manifest,
  launchAuthorizationGranted: true,
  authorizationRecordId: 'auth-record-v28773-explicit-launch',
}

const authorized =
  evaluateGovernedProcessLaunchAuthorization(authorizedInput)

assert.equal(authorized.manifestVerified, true)
assert.equal(authorized.launchEligible, true)
assert.equal(authorized.launchAuthorizationGranted, true)
assert.equal(authorized.launchAuthorized, true)

assert.equal(authorized.processStarted, false)
assert.equal(authorized.processIdAssigned, false)
assert.equal(authorized.readinessGranted, false)
assert.equal(authorized.livenessGranted, false)
assert.equal(authorized.restartAuthorized, false)

assert.equal(authorized.promotionApplied, false)
assert.equal(authorized.deploymentApplied, false)
assert.equal(authorized.executionApplied, false)
assert.equal(authorized.runtimeAuthorityGranted, false)
assert.equal(authorized.networkAuthorityGranted, false)

function expectBlocked(
  name: string,
  candidate: unknown,
  expectedMessage: RegExp,
): void {
  assert.throws(
    () =>
      evaluateGovernedProcessLaunchAuthorization(
        candidate as GovernedProcessLaunchAuthorizationInput,
      ),
    expectedMessage,
    name,
  )
}

expectBlocked(
  'empty authorization record',
  {
    ...authorizedInput,
    authorizationRecordId: '   ',
  },
  /requires authorizationRecordId/,
)

expectBlocked(
  'manifest binding unverified',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      instanceBindingVerified: false,
    },
  },
  /requires verified process manifest/,
)

expectBlocked(
  'manifest specification unverified',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      processSpecificationVerified: false,
    },
  },
  /requires verified process manifest/,
)

expectBlocked(
  'process already started',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      processStarted: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

expectBlocked(
  'pid already assigned',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      processIdAssigned: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

expectBlocked(
  'readiness already granted',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      readinessGranted: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

expectBlocked(
  'restart already authorized',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      restartAuthorized: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

expectBlocked(
  'runtime authority inherited',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      runtimeAuthorityGranted: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

expectBlocked(
  'network authority inherited',
  {
    ...authorizedInput,
    manifest: {
      ...manifest,
      networkAuthorityGranted: true,
    },
  },
  /requires pristine zero-authority manifest/,
)

console.log({
  architecture:
    'verified-process-manifest -> explicit-launch-authorization -> no-materialization',
  deniedLaunchAuthorized: denied.launchAuthorized,
  authorizedLaunchAuthorized: authorized.launchAuthorized,
  processStarted: authorized.processStarted,
  processIdAssigned: authorized.processIdAssigned,
  readinessGranted: authorized.readinessGranted,
  livenessGranted: authorized.livenessGranted,
  restartAuthorized: authorized.restartAuthorized,
  executionApplied: authorized.executionApplied,
  runtimeAuthorityGranted: authorized.runtimeAuthorityGranted,
  networkAuthorityGranted: authorized.networkAuthorityGranted,
  negativeCases: 9,
})

console.log(
  'Runtime governed process launch authorization foundation proof passed.',
)
