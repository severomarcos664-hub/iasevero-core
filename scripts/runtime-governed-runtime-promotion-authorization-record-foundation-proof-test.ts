import assert from 'node:assert/strict'

import {
  createGovernedRuntimePromotionAuthorizationRecord,
} from '../app/lib/runtime-execution-plane/runtime-promotion-authorization-record'

const artifactSha256 =
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

const contentAddress = `sha256:${artifactSha256}`

const authorized =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity: 'v287.73.60-authorized-proof',
    artifactSha256,
    contentAddress,
    promotionAuthorizationRecordId:
      'promotion-authorization-record-v28773560-authorized',
    promotionAuthorizationGranted: true,
  })

assert.equal(authorized.schemaVersion, 1)
assert.equal(
  authorized.kind,
  'iasevero-governed-runtime-promotion-authorization-record',
)

assert.equal(
  authorized.releaseIdentity,
  'v287.73.60-authorized-proof',
)

assert.equal(
  authorized.artifactSha256,
  artifactSha256,
)

assert.equal(
  authorized.contentAddress,
  contentAddress,
)

assert.equal(
  authorized.promotionAuthorizationRecordId,
  'promotion-authorization-record-v28773560-authorized',
)

assert.equal(
  authorized.promotionAuthorizationRecorded,
  true,
)

assert.equal(
  authorized.promotionAuthorizationGranted,
  true,
)

assert.equal(
  authorized.releaseIdentityVerified,
  true,
)

assert.equal(
  authorized.artifactIdentityVerified,
  true,
)

assert.equal(
  authorized.contentAddressVerified,
  true,
)

assert.equal(
  authorized.promotionApplied,
  false,
)

assert.equal(
  authorized.deploymentApplied,
  false,
)

assert.equal(
  authorized.runtimeAuthorityGranted,
  false,
)

assert.equal(
  authorized.networkAuthorityGranted,
  false,
)

const denied =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity: 'v287.73.60-denied-proof',
    artifactSha256,
    contentAddress,
    promotionAuthorizationRecordId:
      'promotion-authorization-record-v28773560-denied',
    promotionAuthorizationGranted: false,
  })

assert.equal(
  denied.promotionAuthorizationRecorded,
  true,
)

assert.equal(
  denied.promotionAuthorizationGranted,
  false,
)

assert.equal(
  denied.promotionApplied,
  false,
)

assert.equal(
  denied.deploymentApplied,
  false,
)

assert.equal(
  denied.runtimeAuthorityGranted,
  false,
)

assert.equal(
  denied.networkAuthorityGranted,
  false,
)

assert.throws(
  () =>
    createGovernedRuntimePromotionAuthorizationRecord({
      releaseIdentity: 'v287.73.60-invalid-record-proof',
      artifactSha256,
      contentAddress,
      promotionAuthorizationRecordId: '   ',
      promotionAuthorizationGranted: true,
    }),
  /requires promotion authorization record id/,
)

assert.throws(
  () =>
    createGovernedRuntimePromotionAuthorizationRecord({
      releaseIdentity: 'v287.73.60-invalid-content-proof',
      artifactSha256,
      contentAddress: `sha256:${'f'.repeat(64)}`,
      promotionAuthorizationRecordId:
        'promotion-authorization-record-v28773560-invalid-content',
      promotionAuthorizationGranted: true,
    }),
  /requires verified artifact content address/,
)

assert.throws(
  () =>
    createGovernedRuntimePromotionAuthorizationRecord({
      releaseIdentity: 'v287.73.60-invalid-digest-proof',
      artifactSha256: 'invalid',
      contentAddress: 'sha256:invalid',
      promotionAuthorizationRecordId:
        'promotion-authorization-record-v28773560-invalid-digest',
      promotionAuthorizationGranted: true,
    }),
  /requires valid artifact sha256/,
)

console.log({
  architecture:
    'immutable-release-identity -> promotion-authorization-record -> identity-binding -> decision-preserved -> zero-effect',

  releaseIdentity:
    authorized.releaseIdentity,

  promotionAuthorizationRecorded:
    authorized.promotionAuthorizationRecorded,

  promotionAuthorizationGranted:
    authorized.promotionAuthorizationGranted,

  deniedAuthorizationRecorded:
    denied.promotionAuthorizationRecorded,

  deniedAuthorizationGranted:
    denied.promotionAuthorizationGranted,

  artifactIdentityVerified:
    authorized.artifactIdentityVerified,

  contentAddressVerified:
    authorized.contentAddressVerified,

  promotionApplied:
    authorized.promotionApplied,

  deploymentApplied:
    authorized.deploymentApplied,

  runtimeAuthorityGranted:
    authorized.runtimeAuthorityGranted,

  networkAuthorityGranted:
    authorized.networkAuthorityGranted,
})

console.log(
  'Runtime governed promotion authorization record foundation proof passed.',
)
