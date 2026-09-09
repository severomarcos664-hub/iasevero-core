export type GovernedReleaseRuntimeIdentityInput = {
  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  artifactSha256: string
  attestationSha256: string
  contentAddress: string
  signerKeyId: string

  provenanceVerified: true
  attestationVerified: true
  signatureVerified: true
  artifactCreated: true
  artifactDigestVerified: true
  contentAddressDerived: true

  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export type GovernedReleaseRuntimeIdentity = {
  schemaVersion: 1
  kind: 'iasevero-governed-release-runtime-identity'

  releaseIdentity: string
  sourceCommit: string
  sourceTag: string
  artifactSha256: string
  attestationSha256: string
  contentAddress: string
  signerKeyId: string

  evidenceVerified: true
  bindingVerified: true

  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`Governed release runtime identity requires ${field}.`)
  }

  return normalized
}

function requireSha256(value: string, field: string): string {
  const normalized = requireNonEmpty(value, field)

  if (!/^[a-f0-9]{64}$/i.test(normalized)) {
    throw new Error(
      `Governed release runtime identity requires valid SHA-256 ${field}.`,
    )
  }

  return normalized.toLowerCase()
}

function requireVerifiedSignal(
  value: boolean,
  field: string,
): true {
  if (value !== true) {
    throw new Error(
      `Governed release runtime identity requires verified ${field}.`,
    )
  }

  return true
}

function requireAuthorityAbsent(
  value: boolean,
  field: string,
): false {
  if (value !== false) {
    throw new Error(
      `Governed release runtime identity requires ${field}=false.`,
    )
  }

  return false
}

export function createGovernedReleaseRuntimeIdentity(
  input: GovernedReleaseRuntimeIdentityInput,
): GovernedReleaseRuntimeIdentity {
  requireVerifiedSignal(input.provenanceVerified, 'provenanceVerified')
  requireVerifiedSignal(input.attestationVerified, 'attestationVerified')
  requireVerifiedSignal(input.signatureVerified, 'signatureVerified')
  requireVerifiedSignal(input.artifactCreated, 'artifactCreated')
  requireVerifiedSignal(input.artifactDigestVerified, 'artifactDigestVerified')
  requireVerifiedSignal(input.contentAddressDerived, 'contentAddressDerived')

  requireAuthorityAbsent(input.promotionApplied, 'promotionApplied')
  requireAuthorityAbsent(input.deploymentApplied, 'deploymentApplied')
  requireAuthorityAbsent(
    input.runtimeAuthorityGranted,
    'runtimeAuthorityGranted',
  )

  const artifactSha256 = requireSha256(input.artifactSha256, 'artifactSha256')
  const attestationSha256 = requireSha256(
    input.attestationSha256,
    'attestationSha256',
  )
  const contentAddress = requireNonEmpty(input.contentAddress, 'contentAddress')
  const expectedContentAddress = `sha256:${artifactSha256}`

  if (contentAddress !== expectedContentAddress) {
    throw new Error(
      'Governed release runtime identity contentAddress does not match artifactSha256.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-release-runtime-identity',

    releaseIdentity: requireNonEmpty(input.releaseIdentity, 'releaseIdentity'),
    sourceCommit: requireNonEmpty(input.sourceCommit, 'sourceCommit'),
    sourceTag: requireNonEmpty(input.sourceTag, 'sourceTag'),
    artifactSha256,
    attestationSha256,
    contentAddress,
    signerKeyId: requireNonEmpty(input.signerKeyId, 'signerKeyId'),

    evidenceVerified: true,
    bindingVerified: true,

    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
