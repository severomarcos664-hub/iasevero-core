import type {
  ImmutableReleaseArtifact,
} from './immutable-release-artifact'

import type {
  GovernedRuntimePromotionAuthorizationRecord,
} from '../../app/lib/runtime-execution-plane/runtime-promotion-authorization-record'

export type ReleasePromotionGateInput = {
  artifact: ImmutableReleaseArtifact
  promotionAuthorizationRecord:
    GovernedRuntimePromotionAuthorizationRecord
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

  promotionAuthorizationRecordId: string
  promotionAuthorizationRecordVerified: boolean
  promotionAuthorizationGranted: boolean

  promotionAuthorized: boolean

  promotionApplied: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
}

export function evaluateReleasePromotionGate(
  input: ReleasePromotionGateInput,
): ReleasePromotionGateDecision {
  const { artifact, promotionAuthorizationRecord } = input

  const expectedContentAddress =
    `sha256:${artifact.artifactSha256}`

  const promotionEligible =
    artifact.artifactCreated === true &&
    artifact.artifactDigestVerified === true &&
    artifact.contentAddressDerived === true &&
    artifact.contentAddress === expectedContentAddress &&
    artifact.promotionApplied === false &&
    artifact.deploymentApplied === false &&
    artifact.runtimeAuthorityGranted === false

  const promotionAuthorizationRecordVerified =
    promotionAuthorizationRecord
      .promotionAuthorizationRecorded === true &&
    promotionAuthorizationRecord
      .releaseIdentityVerified === true &&
    promotionAuthorizationRecord
      .artifactIdentityVerified === true &&
    promotionAuthorizationRecord
      .contentAddressVerified === true &&
    promotionAuthorizationRecord
      .promotionAuthorizationRecordId.trim().length > 0 &&
    promotionAuthorizationRecord.releaseIdentity ===
      artifact.releaseIdentity &&
    promotionAuthorizationRecord.artifactSha256 ===
      artifact.artifactSha256 &&
    promotionAuthorizationRecord.contentAddress ===
      artifact.contentAddress &&
    promotionAuthorizationRecord.promotionApplied === false &&
    promotionAuthorizationRecord.deploymentApplied === false &&
    promotionAuthorizationRecord.runtimeAuthorityGranted === false &&
    promotionAuthorizationRecord.networkAuthorityGranted === false

  const promotionAuthorizationGranted =
    promotionAuthorizationRecordVerified &&
    promotionAuthorizationRecord
      .promotionAuthorizationGranted === true

  const promotionAuthorized =
    promotionEligible &&
    promotionAuthorizationGranted

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

    promotionAuthorizationRecordId:
      promotionAuthorizationRecord
        .promotionAuthorizationRecordId,

    promotionAuthorizationRecordVerified,

    promotionAuthorizationGranted,

    promotionAuthorized,

    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  }
}
