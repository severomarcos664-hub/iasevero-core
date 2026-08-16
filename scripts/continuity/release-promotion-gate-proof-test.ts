import assert from 'node:assert/strict'

import {
  createImmutableReleaseArtifact,
  type ImmutableReleaseArtifactInput,
} from './immutable-release-artifact'

import {
  evaluateReleasePromotionGate,
} from './release-promotion-gate'

const input: ImmutableReleaseArtifactInput = {
  releaseIdentity:
    'v287.30-governed-release-promotion-gate-proof',
  sourceCommit:
    'd9ab33f0f1373f8485258787fc6bc36c12e5ca1',
  sourceTag:
    'v287.29-governed-immutable-content-addressed-release-artifact-proof',
  provenanceSha256:
    'cfc69cbc4a1cbbb00f49f9ddb993a2da0695e3ac3555c24574f62b6338d7270c',
  attestationSha256:
    '04b12b3245f098109b2645878052dae76af2423e842e270a42f2c169ab78d5e1',
  signerKeyId:
    '8318acf24408466265cf6884f925cfc43b9cf5272db0acaf1f19bc8bf0868a79',
  signatureBase64:
    'governed-v28730-proof-signature',
}

const artifact = createImmutableReleaseArtifact(input)

/*
 * Positive:
 * valid artifact + explicit promotion authorization.
 */
const authorizedDecision = evaluateReleasePromotionGate({
  artifact,
  promotionAuthorizationGranted: true,
})

assert.equal(authorizedDecision.schemaVersion, 1)
assert.equal(
  authorizedDecision.kind,
  'iasevero-release-promotion-gate-decision',
)
assert.equal(authorizedDecision.artifactCreated, true)
assert.equal(authorizedDecision.artifactDigestVerified, true)
assert.equal(authorizedDecision.contentAddressDerived, true)
assert.equal(authorizedDecision.promotionEligible, true)
assert.equal(
  authorizedDecision.promotionAuthorizationGranted,
  true,
)
assert.equal(authorizedDecision.promotionAuthorized, true)
assert.equal(authorizedDecision.promotionApplied, false)
assert.equal(authorizedDecision.deploymentApplied, false)
assert.equal(authorizedDecision.runtimeAuthorityGranted, false)

/*
 * Negative:
 * valid artifact alone MUST NOT imply authorization.
 */
const unauthorizedDecision = evaluateReleasePromotionGate({
  artifact,
  promotionAuthorizationGranted: false,
})

assert.equal(unauthorizedDecision.promotionEligible, true)
assert.equal(
  unauthorizedDecision.promotionAuthorizationGranted,
  false,
)
assert.equal(unauthorizedDecision.promotionAuthorized, false)

/*
 * Fail closed:
 * explicit authorization cannot override invalid artifact identity.
 */
const tamperedArtifact = {
  ...artifact,
  contentAddress: 'sha256:tampered',
}

const tamperedDecision = evaluateReleasePromotionGate({
  artifact: tamperedArtifact,
  promotionAuthorizationGranted: true,
})

assert.equal(tamperedDecision.promotionEligible, false)
assert.equal(tamperedDecision.promotionAuthorized, false)
assert.equal(tamperedDecision.promotionApplied, false)
assert.equal(tamperedDecision.deploymentApplied, false)
assert.equal(tamperedDecision.runtimeAuthorityGranted, false)

console.log(
  'Governed release promotion gate proof passed.',
)

console.log({
  validPromotionEligible:
    authorizedDecision.promotionEligible,
  explicitPromotionAuthorization:
    authorizedDecision.promotionAuthorizationGranted,
  validPromotionAuthorized:
    authorizedDecision.promotionAuthorized,
  eligibleWithoutAuthorization:
    unauthorizedDecision.promotionEligible,
  unauthorizedPromotionAuthorized:
    unauthorizedDecision.promotionAuthorized,
  tamperedPromotionEligible:
    tamperedDecision.promotionEligible,
  tamperedPromotionAuthorized:
    tamperedDecision.promotionAuthorized,
  promotionApplied:
    authorizedDecision.promotionApplied,
  deploymentApplied:
    authorizedDecision.deploymentApplied,
  runtimeAuthorityGranted:
    authorizedDecision.runtimeAuthorityGranted,
  assertionCount: 19,
})
