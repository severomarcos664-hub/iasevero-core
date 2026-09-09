import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
  type GovernedReleaseRuntimeIdentityInput,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

const artifactSha256 = 'a'.repeat(64)
const attestationSha256 = 'b'.repeat(64)

const validInput: GovernedReleaseRuntimeIdentityInput = {
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
}

const identity = createGovernedReleaseRuntimeIdentity(validInput)

assert.equal(identity.schemaVersion, 1)
assert.equal(identity.kind, 'iasevero-governed-release-runtime-identity')
assert.equal(identity.releaseIdentity, validInput.releaseIdentity)
assert.equal(identity.sourceCommit, validInput.sourceCommit)
assert.equal(identity.sourceTag, validInput.sourceTag)
assert.equal(identity.artifactSha256, artifactSha256)
assert.equal(identity.attestationSha256, attestationSha256)
assert.equal(identity.contentAddress, `sha256:${artifactSha256}`)
assert.equal(identity.signerKeyId, validInput.signerKeyId)

assert.equal(identity.evidenceVerified, true)
assert.equal(identity.bindingVerified, true)

assert.equal(identity.promotionApplied, false)
assert.equal(identity.deploymentApplied, false)
assert.equal(identity.runtimeAuthorityGranted, false)
assert.equal(identity.networkAuthorityGranted, false)

function expectBlocked(
  name: string,
  candidate: unknown,
  expectedMessage: RegExp,
): void {
  assert.throws(
    () =>
      createGovernedReleaseRuntimeIdentity(
        candidate as GovernedReleaseRuntimeIdentityInput,
      ),
    expectedMessage,
    name,
  )
}

expectBlocked(
  'provenance false',
  { ...validInput, provenanceVerified: false },
  /requires verified provenanceVerified/,
)

expectBlocked(
  'attestation false',
  { ...validInput, attestationVerified: false },
  /requires verified attestationVerified/,
)

expectBlocked(
  'signature false',
  { ...validInput, signatureVerified: false },
  /requires verified signatureVerified/,
)

expectBlocked(
  'artifact not created',
  { ...validInput, artifactCreated: false },
  /requires verified artifactCreated/,
)

expectBlocked(
  'artifact digest unverified',
  { ...validInput, artifactDigestVerified: false },
  /requires verified artifactDigestVerified/,
)

expectBlocked(
  'content address not derived',
  { ...validInput, contentAddressDerived: false },
  /requires verified contentAddressDerived/,
)

expectBlocked(
  'invalid artifact sha256',
  { ...validInput, artifactSha256: 'tampered' },
  /requires valid SHA-256 artifactSha256/,
)

expectBlocked(
  'invalid attestation sha256',
  { ...validInput, attestationSha256: 'tampered' },
  /requires valid SHA-256 attestationSha256/,
)

expectBlocked(
  'content address mismatch',
  { ...validInput, contentAddress: `sha256:${'c'.repeat(64)}` },
  /contentAddress does not match artifactSha256/,
)

expectBlocked(
  'promotion authority already applied',
  { ...validInput, promotionApplied: true },
  /requires promotionApplied=false/,
)

expectBlocked(
  'deployment already applied',
  { ...validInput, deploymentApplied: true },
  /requires deploymentApplied=false/,
)

expectBlocked(
  'runtime authority already granted',
  { ...validInput, runtimeAuthorityGranted: true },
  /requires runtimeAuthorityGranted=false/,
)

console.log({
  architecture:
    'verified-release-evidence -> governed-release-runtime-identity -> no-authority-binding',
  evidenceVerified: identity.evidenceVerified,
  bindingVerified: identity.bindingVerified,
  promotionApplied: identity.promotionApplied,
  deploymentApplied: identity.deploymentApplied,
  runtimeAuthorityGranted: identity.runtimeAuthorityGranted,
  networkAuthorityGranted: identity.networkAuthorityGranted,
  negativeCases: 12,
})

console.log(
  'Runtime governed release runtime identity foundation proof passed.',
)
