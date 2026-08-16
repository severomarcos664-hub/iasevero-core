import type {
  ImmutableReleaseArtifact,
} from './immutable-release-artifact'

export type ReleasePromotionGateInput = {
  artifact: ImmutableReleaseArtifact
  promotionAuthorizationGranted: boolean
}

export type ReleasePromotionGateDecision = {
  schemaVersion: 1
  kind: 'iasevero-release-promotion-gate-decision'
  releaseIdentity: string
  artifactSha256: string
  contentAddress: string
  artifactCreated: true
  artifactDigestVerified: true
  contentAddressDerived: true
  promotionEligible: boolean
  promotionAuthorizationGranted: boolean
  promotionAuthorized: boolean
  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export function evaluateReleasePromotionGate(
  input: ReleasePromotionGateInput,
): ReleasePromotionGateDecision {
  const { artifact } = input
  const expectedContentAddress = `sha256:${artifact.artifactSha256}`

  const promotionEligible =
    artifact.artifactCreated === true &&
    artifact.artifactDigestVerified === true &&
    artifact.contentAddressDerived === true &&
    artifact.contentAddress === expectedContentAddress &&
    artifact.promotionApplied === false &&
    artifact.deploymentApplied === false &&
    artifact.runtimeAuthorityGranted === false

  const promotionAuthorized =
    promotionEligible &&
    input.promotionAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-release-promotion-gate-decision',
    releaseIdentity: artifact.releaseIdentity,
    artifactSha256: artifact.artifactSha256,
    contentAddress: artifact.contentAddress,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,
    promotionEligible,
    promotionAuthorizationGranted:
      input.promotionAuthorizationGranted,
    promotionAuthorized,
    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
