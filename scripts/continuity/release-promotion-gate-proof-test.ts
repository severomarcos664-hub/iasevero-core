import assert from 'node:assert/strict'

import {
  createImmutableReleaseArtifact,
} from './immutable-release-artifact'

import {
  createGovernedRuntimePromotionAuthorizationRecord,
} from '../../app/lib/runtime-execution-plane/runtime-promotion-authorization-record'

import {
  evaluateReleasePromotionGate,
} from './release-promotion-gate'

const artifact =
  createImmutableReleaseArtifact({
    releaseIdentity: 'v287.73.61-promotion-gate-proof',
    sourceCommit:
      '0123456789abcdef0123456789abcdef01234567',
    sourceTag:
      'v287.73.61-promotion-gate-proof',
    provenanceSha256:
      '1'.repeat(64),
    attestationSha256:
      '2'.repeat(64),
    signerKeyId:
      'iasevero-proof-key',
    signatureBase64:
      'c2lnbmF0dXJl',
  })

const authorizedRecord =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity:
      artifact.releaseIdentity,
    artifactSha256:
      artifact.artifactSha256,
    contentAddress:
      artifact.contentAddress,
    promotionAuthorizationRecordId:
      'promotion-auth-v2877361-authorized',
    promotionAuthorizationGranted: true,
  })

const authorizedDecision =
  evaluateReleasePromotionGate({
    artifact,
    promotionAuthorizationRecord:
      authorizedRecord,
  })

assert.equal(
  authorizedDecision.promotionEligible,
  true,
)

assert.equal(
  authorizedDecision
    .promotionAuthorizationRecordVerified,
  true,
)

assert.equal(
  authorizedDecision
    .promotionAuthorizationGranted,
  true,
)

assert.equal(
  authorizedDecision.promotionAuthorized,
  true,
)

assert.equal(
  authorizedDecision.promotionApplied,
  false,
)

assert.equal(
  authorizedDecision.deploymentApplied,
  false,
)

assert.equal(
  authorizedDecision.runtimeAuthorityGranted,
  false,
)

/*
 * Negative:
 * valid record, explicit denial.
 */
const deniedRecord =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity:
      artifact.releaseIdentity,
    artifactSha256:
      artifact.artifactSha256,
    contentAddress:
      artifact.contentAddress,
    promotionAuthorizationRecordId:
      'promotion-auth-v2877361-denied',
    promotionAuthorizationGranted: false,
  })

const deniedDecision =
  evaluateReleasePromotionGate({
    artifact,
    promotionAuthorizationRecord:
      deniedRecord,
  })

assert.equal(
  deniedDecision
    .promotionAuthorizationRecordVerified,
  true,
)

assert.equal(
  deniedDecision
    .promotionAuthorizationGranted,
  false,
)

assert.equal(
  deniedDecision.promotionAuthorized,
  false,
)

/*
 * Fail closed:
 * authorization record bound to a different release.
 */
const mismatchedRecord =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity:
      'v287.73.61-different-release',
    artifactSha256:
      artifact.artifactSha256,
    contentAddress:
      artifact.contentAddress,
    promotionAuthorizationRecordId:
      'promotion-auth-v2877361-mismatch',
    promotionAuthorizationGranted: true,
  })

const mismatchedDecision =
  evaluateReleasePromotionGate({
    artifact,
    promotionAuthorizationRecord:
      mismatchedRecord,
  })

assert.equal(
  mismatchedDecision
    .promotionAuthorizationRecordVerified,
  false,
)

assert.equal(
  mismatchedDecision
    .promotionAuthorizationGranted,
  false,
)

assert.equal(
  mismatchedDecision.promotionAuthorized,
  false,
)

assert.equal(
  mismatchedDecision.promotionApplied,
  false,
)

assert.equal(
  mismatchedDecision.deploymentApplied,
  false,
)

assert.equal(
  mismatchedDecision.runtimeAuthorityGranted,
  false,
)

console.log({
  architecture:
    'immutable-release-artifact -> canonical-promotion-authorization-record -> identity-revalidation -> promotion-gate -> zero-effect',

  promotionEligible:
    authorizedDecision.promotionEligible,

  authorizationRecordVerified:
    authorizedDecision
      .promotionAuthorizationRecordVerified,

  promotionAuthorizationGranted:
    authorizedDecision
      .promotionAuthorizationGranted,

  promotionAuthorized:
    authorizedDecision.promotionAuthorized,

  deniedRecordVerified:
    deniedDecision
      .promotionAuthorizationRecordVerified,

  deniedPromotionAuthorized:
    deniedDecision.promotionAuthorized,

  mismatchedRecordRejected:
    mismatchedDecision
      .promotionAuthorizationRecordVerified === false,

  promotionApplied:
    authorizedDecision.promotionApplied,

  deploymentApplied:
    authorizedDecision.deploymentApplied,

  runtimeAuthorityGranted:
    authorizedDecision.runtimeAuthorityGranted,
})

console.log(
  'Governed release promotion authorization record integration proof passed.',
)
