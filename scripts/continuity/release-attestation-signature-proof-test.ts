import assert from 'node:assert/strict'
import { createHash, createPublicKey, verify } from 'node:crypto'
import {
  createReleaseAttestationSignature,
} from './release-attestation-signature'

const attestationSha256 =
  '04b12b3245f098109b2645878052dae76af2423e842e270a42f2c169ab78d5e1'

const result = createReleaseAttestationSignature({
  attestationSha256,
})

assert.equal(result.schemaVersion, 1)
assert.equal(result.kind, 'iasevero-release-attestation-signature')
assert.equal(result.algorithm, 'Ed25519')
assert.equal(result.attestationSha256, attestationSha256)
assert.equal(result.signatureCreated, true)
assert.equal(result.signatureVerified, true)
assert.equal(result.privateKeyPersisted, false)
assert.equal(result.artifactCreated, false)
assert.equal(result.promotionApplied, false)
assert.equal(result.deploymentApplied, false)
assert.equal(result.runtimeAuthorityGranted, false)

assert.match(result.signerKeyId, /^[a-f0-9]{64}$/)
assert.ok(Buffer.from(result.signatureBase64, 'base64').length > 0)

const tamperedAttestationSha256 = createHash('sha256')
  .update('tampered-attestation', 'utf8')
  .digest('hex')

assert.notEqual(tamperedAttestationSha256, result.attestationSha256)

const publicKeyDer = Buffer.from(
  result.signerPublicKeySpkiBase64,
  'base64',
)

const publicKey = createPublicKey({
  key: publicKeyDer,
  format: 'der',
  type: 'spki',
})

const signature = Buffer.from(result.signatureBase64, 'base64')

const validSignatureVerified = verify(
  null,
  Buffer.from(result.attestationSha256, 'utf8'),
  publicKey,
  signature,
)

const tamperedAttestationVerified = verify(
  null,
  Buffer.from(tamperedAttestationSha256, 'utf8'),
  publicKey,
  signature,
)

const independentlyCalculatedSignerKeyId = createHash('sha256')
  .update(publicKeyDer)
  .digest('hex')

assert.equal(validSignatureVerified, true)
assert.equal(tamperedAttestationVerified, false)
assert.equal(
  result.signerKeyId,
  independentlyCalculatedSignerKeyId,
)

console.log('Governed cryptographic attestation signature proof passed.')
console.log({
  algorithm: result.algorithm,
  attestationSha256: result.attestationSha256,
  signerKeyId: result.signerKeyId,
  signatureCreated: result.signatureCreated,
  signatureVerified: result.signatureVerified,
  validSignatureVerified,
  tamperedAttestationVerified,
  signerKeyIdentityVerified:
    result.signerKeyId === independentlyCalculatedSignerKeyId,
  privateKeyPersisted: result.privateKeyPersisted,
  artifactCreated: result.artifactCreated,
  promotionApplied: result.promotionApplied,
  deploymentApplied: result.deploymentApplied,
  runtimeAuthorityGranted: result.runtimeAuthorityGranted,
})
