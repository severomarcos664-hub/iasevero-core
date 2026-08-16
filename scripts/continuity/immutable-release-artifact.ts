import { createHash } from 'node:crypto'

export type ImmutableReleaseArtifactInput = {
  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  provenanceSha256: string
  attestationSha256: string
  signerKeyId: string
  signatureBase64: string
}

export type ImmutableReleaseArtifact = {
  schemaVersion: 1
  kind: 'iasevero-immutable-release-artifact'
  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  provenanceSha256: string
  attestationSha256: string
  signerKeyId: string
  signatureBase64: string
  artifactSha256: string
  contentAddress: string
  artifactCreated: true
  artifactDigestVerified: true
  contentAddressDerived: true
  filesystemArtifactPersisted: false
  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export function serializeImmutableReleaseArtifact(
  input: ImmutableReleaseArtifactInput,
): string {
  return [
    'schemaVersion=1',
    'kind=iasevero-immutable-release-artifact',
    `releaseIdentity=${input.releaseIdentity}`,
    `sourceCommit=${input.sourceCommit}`,
    `sourceTag=${input.sourceTag}`,
    `provenanceSha256=${input.provenanceSha256}`,
    `attestationSha256=${input.attestationSha256}`,
    `signerKeyId=${input.signerKeyId}`,
    `signatureBase64=${input.signatureBase64}`,
  ].join('\n')
}

export function calculateImmutableReleaseArtifactSha256(
  input: ImmutableReleaseArtifactInput,
): string {
  return createHash('sha256')
    .update(serializeImmutableReleaseArtifact(input), 'utf8')
    .digest('hex')
}

export function createImmutableReleaseArtifact(
  input: ImmutableReleaseArtifactInput,
): ImmutableReleaseArtifact {
  const artifactSha256 =
    calculateImmutableReleaseArtifactSha256(input)

  return {
    schemaVersion: 1,
    kind: 'iasevero-immutable-release-artifact',
    ...input,
    artifactSha256,
    contentAddress: `sha256:${artifactSha256}`,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,
    filesystemArtifactPersisted: false,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
