import { createHash } from 'node:crypto'

export type ReleaseAttestationInput = {
  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  provenanceSha256: string
  provenanceVerified: true
}

export type ReleaseAttestation = {
  schemaVersion: 1
  kind: 'iasevero-release-attestation'
  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  provenanceSha256: string
  provenanceVerified: true
  attestationSha256: string
  attestationCreated: true
  attestationVerified: true
  cryptographicSignatureCreated: false
  privateKeyAccess: false
  artifactCreated: false
  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export function serializeReleaseAttestation(
  input: ReleaseAttestationInput,
): string {
  return [
    'schemaVersion=1',
    'kind=iasevero-release-attestation',
    `releaseIdentity=${input.releaseIdentity}`,
    `sourceCommit=${input.sourceCommit}`,
    `sourceTag=${input.sourceTag}`,
    `provenanceSha256=${input.provenanceSha256}`,
    `provenanceVerified=${input.provenanceVerified}`,
  ].join('\n')
}

export function calculateReleaseAttestationSha256(
  input: ReleaseAttestationInput,
): string {
  return createHash('sha256')
    .update(serializeReleaseAttestation(input), 'utf8')
    .digest('hex')
}

export function createReleaseAttestation(
  input: ReleaseAttestationInput,
): ReleaseAttestation {
  return {
    schemaVersion: 1,
    kind: 'iasevero-release-attestation',
    releaseIdentity: input.releaseIdentity,
    sourceCommit: input.sourceCommit,
    sourceTag: input.sourceTag,
    provenanceSha256: input.provenanceSha256,
    provenanceVerified: true,
    attestationSha256: calculateReleaseAttestationSha256(input),
    attestationCreated: true,
    attestationVerified: true,
    cryptographicSignatureCreated: false,
    privateKeyAccess: false,
    artifactCreated: false,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
