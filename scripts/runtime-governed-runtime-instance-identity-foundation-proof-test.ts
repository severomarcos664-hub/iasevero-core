import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import {
  createGovernedRuntimeInstanceIdentity,
  type GovernedRuntimeInstanceIdentityInput,
} from '../app/lib/runtime-instance-identity/runtime-instance-identity'

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

const validInput: GovernedRuntimeInstanceIdentityInput = {
  releaseIdentity,
  instanceId: 'runtime-instance-v28773-0001',
  startedAt: '2026-09-08T22:35:00.000Z',
}

const identity = createGovernedRuntimeInstanceIdentity(validInput)

assert.equal(identity.schemaVersion, 1)
assert.equal(
  identity.kind,
  'iasevero-governed-runtime-instance-identity',
)

assert.equal(identity.instanceId, validInput.instanceId)
assert.equal(identity.startedAt, validInput.startedAt)

assert.equal(
  identity.releaseIdentity,
  releaseIdentity.releaseIdentity,
)
assert.equal(identity.sourceCommit, releaseIdentity.sourceCommit)
assert.equal(identity.sourceTag, releaseIdentity.sourceTag)
assert.equal(identity.artifactSha256, releaseIdentity.artifactSha256)
assert.equal(
  identity.attestationSha256,
  releaseIdentity.attestationSha256,
)
assert.equal(identity.contentAddress, releaseIdentity.contentAddress)
assert.equal(identity.signerKeyId, releaseIdentity.signerKeyId)

assert.equal(identity.releaseBindingVerified, true)
assert.equal(identity.instanceIdentityCreated, true)

assert.equal(identity.promotionApplied, false)
assert.equal(identity.deploymentApplied, false)
assert.equal(identity.executionApplied, false)
assert.equal(identity.runtimeAuthorityGranted, false)
assert.equal(identity.networkAuthorityGranted, false)

function expectBlocked(
  name: string,
  input: unknown,
  expectedMessage: RegExp,
): void {
  assert.throws(
    () =>
      createGovernedRuntimeInstanceIdentity(
        input as GovernedRuntimeInstanceIdentityInput,
      ),
    expectedMessage,
    name,
  )
}

expectBlocked(
  'empty instanceId',
  {
    ...validInput,
    instanceId: '   ',
  },
  /requires instanceId/,
)

expectBlocked(
  'invalid startedAt',
  {
    ...validInput,
    startedAt: 'not-a-timestamp',
  },
  /requires valid startedAt/,
)

expectBlocked(
  'release evidence unverified',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      evidenceVerified: false,
    },
  },
  /requires verified release binding/,
)

expectBlocked(
  'release binding unverified',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      bindingVerified: false,
    },
  },
  /requires verified release binding/,
)

expectBlocked(
  'promotion authority inherited',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      promotionApplied: true,
    },
  },
  /requires zero inherited authority/,
)

expectBlocked(
  'deployment authority inherited',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      deploymentApplied: true,
    },
  },
  /requires zero inherited authority/,
)

expectBlocked(
  'runtime authority inherited',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      runtimeAuthorityGranted: true,
    },
  },
  /requires zero inherited authority/,
)

expectBlocked(
  'network authority inherited',
  {
    ...validInput,
    releaseIdentity: {
      ...releaseIdentity,
      networkAuthorityGranted: true,
    },
  },
  /requires zero inherited authority/,
)

console.log({
  architecture:
    'verified-release-runtime-identity -> governed-runtime-instance-identity -> zero-authority-instance',
  releaseBindingVerified: identity.releaseBindingVerified,
  instanceIdentityCreated: identity.instanceIdentityCreated,
  promotionApplied: identity.promotionApplied,
  deploymentApplied: identity.deploymentApplied,
  executionApplied: identity.executionApplied,
  runtimeAuthorityGranted: identity.runtimeAuthorityGranted,
  networkAuthorityGranted: identity.networkAuthorityGranted,
  negativeCases: 8,
})

console.log(
  'Runtime governed runtime instance identity foundation proof passed.',
)
