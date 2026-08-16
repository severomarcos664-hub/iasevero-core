import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  createReleaseAttestation,
  serializeReleaseAttestation,
  type ReleaseAttestationInput,
} from './release-attestation'

const input: ReleaseAttestationInput = {
  releaseIdentity: 'v287.27-governed-release-attestation-identity-proof',
  sourceCommit: '89d76f48bbef479e343bd3f71acbc665feca3b65c',
  sourceTag: 'v287.26-governed-hermetic-reproduction-provenance-proof',
  provenanceSha256:
    'cfc69cbc4a1cbbb00f49f9ddb993a2da0695e3ac3555e24574f62b6338d7270e',
  provenanceVerified: true,
}

const attestation = createReleaseAttestation(input)

const independentlyCalculated = createHash('sha256')
  .update(serializeReleaseAttestation(input), 'utf8')
  .digest('hex')

assert.equal(attestation.attestationSha256, independentlyCalculated)
assert.equal(attestation.attestationCreated, true)
assert.equal(attestation.attestationVerified, true)
assert.equal(attestation.provenanceVerified, true)

assert.equal(attestation.cryptographicSignatureCreated, false)
assert.equal(attestation.privateKeyAccess, false)
assert.equal(attestation.artifactCreated, false)
assert.equal(attestation.promotionApplied, false)
assert.equal(attestation.deploymentApplied, false)
assert.equal(attestation.runtimeAuthorityGranted, false)

console.log('Governed release attestation identity proof passed.')
console.log({
  releaseIdentity: attestation.releaseIdentity,
  sourceCommit: attestation.sourceCommit,
  sourceTag: attestation.sourceTag,
  provenanceSha256: attestation.provenanceSha256,
  attestationSha256: attestation.attestationSha256,
  attestationCreated: attestation.attestationCreated,
  attestationVerified: attestation.attestationVerified,
  cryptographicSignatureCreated: attestation.cryptographicSignatureCreated,
  privateKeyAccess: attestation.privateKeyAccess,
  artifactCreated: attestation.artifactCreated,
  promotionApplied: attestation.promotionApplied,
  deploymentApplied: attestation.deploymentApplied,
  runtimeAuthorityGranted: attestation.runtimeAuthorityGranted,
  assertionCount: 10,
})
