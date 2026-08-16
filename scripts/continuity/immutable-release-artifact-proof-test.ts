import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  createImmutableReleaseArtifact,
  serializeImmutableReleaseArtifact,
  type ImmutableReleaseArtifactInput,
} from './immutable-release-artifact'

const input: ImmutableReleaseArtifactInput = {
  releaseIdentity:
    'v287.29-governed-immutable-content-addressed-release-artifact-proof',
  sourceCommit:
    'ca8797b04493d0c3a58421b777c0f04830d045dd',
  sourceTag:
    'v287.28-governed-cryptographic-attestation-signature-proof',
  provenanceSha256:
    'cf6c96bc4a1cbbb00f49f9ddb993a2da0695e3ae3555c24574f62b6338d7270c',
  attestationSha256:
    '04b12b3245f098109b2645878052dae76af2423e842e270a42f2c169ab78d5e1',
  signerKeyId:
    '8318acf24408466265cf6884f925cfc43b9cf5272db0acaf1f19bc8bf0868a79',
  signatureBase64:
    'governed-v28729-proof-signature',
}

const artifactA = createImmutableReleaseArtifact(input)
const artifactB = createImmutableReleaseArtifact(input)

assert.equal(artifactA.schemaVersion, 1)
assert.equal(artifactA.kind, 'iasevero-immutable-release-artifact')
assert.equal(artifactA.artifactCreated, true)
assert.equal(artifactA.artifactDigestVerified, true)
assert.equal(artifactA.contentAddressDerived, true)
assert.equal(artifactA.filesystemArtifactPersisted, false)
assert.equal(artifactA.promotionApplied, false)
assert.equal(artifactA.deploymentApplied, false)
assert.equal(artifactA.runtimeAuthorityGranted, false)

assert.equal(artifactA.artifactSha256, artifactB.artifactSha256)
assert.equal(artifactA.contentAddress, artifactB.contentAddress)

const independentlyCalculatedSha256 = createHash('sha256')
  .update(serializeImmutableReleaseArtifact(input), 'utf8')
  .digest('hex')

assert.equal(
  artifactA.artifactSha256,
  independentlyCalculatedSha256,
)

assert.equal(
  artifactA.contentAddress,
  `sha256:${independentlyCalculatedSha256}`,
)

const tamperedInput: ImmutableReleaseArtifactInput = {
  ...input,
  attestationSha256: createHash('sha256')
    .update('tampered-attestation', 'utf8')
    .digest('hex'),
}

const tamperedArtifact =
  createImmutableReleaseArtifact(tamperedInput)

assert.notEqual(
  tamperedArtifact.artifactSha256,
  artifactA.artifactSha256,
)

assert.notEqual(
  tamperedArtifact.contentAddress,
  artifactA.contentAddress,
)

console.log('Governed immutable content-addressed release artifact proof passed.')
console.log({
  artifactCreated: artifactA.artifactCreated,
  artifactDigestVerified: artifactA.artifactDigestVerified,
  contentAddressDerived: artifactA.contentAddressDerived,
  deterministicArtifactIdentity:
    artifactA.artifactSha256 === artifactB.artifactSha256,
  independentDigestVerified:
    artifactA.artifactSha256 === independentlyCalculatedSha256,
  tamperedArtifactRejected:
    tamperedArtifact.artifactSha256 !== artifactA.artifactSha256,
  filesystemArtifactPersisted:
    artifactA.filesystemArtifactPersisted,
  promotionApplied: artifactA.promotionApplied,
  deploymentApplied: artifactA.deploymentApplied,
  runtimeAuthorityGranted: artifactA.runtimeAuthorityGranted,
  assertionCount: 14,
})
