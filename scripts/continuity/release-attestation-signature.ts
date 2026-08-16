import {
  createHash,
  generateKeyPairSync,
  sign,
  verify,
  type KeyObject,
} from 'node:crypto'

export type ReleaseAttestationSignatureInput = {
  attestationSha256: string
}

export type ReleaseAttestationSignature = {
  schemaVersion: 1
  kind: 'iasevero-release-attestation-signature'
  algorithm: 'Ed25519'
  attestationSha256: string
  signerKeyId: string
  signerPublicKeySpkiBase64: string
  signatureBase64: string
  signatureCreated: true
  signatureVerified: true
  privateKeyPersisted: false
  artifactCreated: false
  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

function publicKeyId(publicKey: KeyObject): string {
  const der = publicKey.export({
    type: 'spki',
    format: 'der',
  })

  return createHash('sha256')
    .update(der)
    .digest('hex')
}

export function createReleaseAttestationSignature(
  input: ReleaseAttestationSignatureInput,
): ReleaseAttestationSignature {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  const payload = Buffer.from(input.attestationSha256, 'utf8')

  const signature = sign(null, payload, privateKey)

  if (!verify(null, payload, publicKey, signature)) {
    throw new Error('Release attestation signature verification failed.')
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-release-attestation-signature',
    algorithm: 'Ed25519',
    attestationSha256: input.attestationSha256,
    signerKeyId: publicKeyId(publicKey),
    signerPublicKeySpkiBase64: publicKey.export({
      type: 'spki',
      format: 'der',
    }).toString('base64'),
    signatureBase64: signature.toString('base64'),
    signatureCreated: true,
    signatureVerified: true,
    privateKeyPersisted: false,
    artifactCreated: false,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
