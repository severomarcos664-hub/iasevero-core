export type GovernedRuntimePromotionAuthorizationRecordInput = {
  releaseIdentity: string
  artifactSha256: string
  contentAddress: string
  promotionAuthorizationRecordId: string
  promotionAuthorizationGranted: boolean
}

export type GovernedRuntimePromotionAuthorizationRecord = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-promotion-authorization-record'

  releaseIdentity: string
  artifactSha256: string
  contentAddress: string

  promotionAuthorizationRecordId: string
  promotionAuthorizationRecorded: true
  promotionAuthorizationGranted: boolean

  releaseIdentityVerified: true
  artifactIdentityVerified: true
  contentAddressVerified: true

  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createGovernedRuntimePromotionAuthorizationRecord(
  input: GovernedRuntimePromotionAuthorizationRecordInput,
): GovernedRuntimePromotionAuthorizationRecord {
  const releaseIdentity = input.releaseIdentity.trim()
  const artifactSha256 = input.artifactSha256.trim().toLowerCase()
  const contentAddress = input.contentAddress.trim()
  const promotionAuthorizationRecordId =
    input.promotionAuthorizationRecordId.trim()

  if (releaseIdentity.length === 0) {
    throw new Error(
      'Governed runtime promotion authorization record requires release identity.',
    )
  }

  if (!/^[a-f0-9]{64}$/.test(artifactSha256)) {
    throw new Error(
      'Governed runtime promotion authorization record requires valid artifact sha256.',
    )
  }

  const expectedContentAddress = `sha256:${artifactSha256}`

  if (contentAddress !== expectedContentAddress) {
    throw new Error(
      'Governed runtime promotion authorization record requires verified artifact content address.',
    )
  }

  if (promotionAuthorizationRecordId.length === 0) {
    throw new Error(
      'Governed runtime promotion authorization record requires promotion authorization record id.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-promotion-authorization-record',

    releaseIdentity,
    artifactSha256,
    contentAddress,

    promotionAuthorizationRecordId,
    promotionAuthorizationRecorded: true,
    promotionAuthorizationGranted:
      input.promotionAuthorizationGranted,

    releaseIdentityVerified: true,
    artifactIdentityVerified: true,
    contentAddressVerified: true,

    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
