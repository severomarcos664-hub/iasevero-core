import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import {
  calculateHermeticReproductionProvenanceSha256,
  createHermeticReproductionProvenance,
  serializeHermeticReproductionProvenance,
  type HermeticReproductionProvenanceInput,
} from './hermetic-reproduction-provenance'

const input: HermeticReproductionProvenanceInput = {
  sourceCommit: '81243df92fa97322278da180dd8caefd6529fa8b',
  sourceTag: 'v287.25-governed-hermetic-reproduction-execution-proof',
  packageLockSha256:
    'f6c9dc2fa883aa7b4ee84ab8b2886975f928cf6bbc8566829734b7b45fa76238',
  observedNodeVersion: 'v24.18.1',
  observedNpmVersion: '12.0.2',

  sourceIdentityVerified: true,
  tagIdentityVerified: true,
  lockfileVerified: true,
  cleanEnvironmentVerified: true,
  installSucceeded: true,
  tscSucceeded: true,
  proofSucceeded: true,
  regressionSucceeded: true,
  buildSucceeded: true,
  reproductionSucceeded: true,
}

const provenance = createHermeticReproductionProvenance(input)

const canonical = serializeHermeticReproductionProvenance(input)

const independentlyCalculatedSha256 = createHash('sha256')
  .update(canonical, 'utf8')
  .digest('hex')

assert.equal(
  provenance.provenanceSha256,
  independentlyCalculatedSha256,
)

assert.equal(
  calculateHermeticReproductionProvenanceSha256(input),
  independentlyCalculatedSha256,
)

assert.equal(provenance.sourceCommit, input.sourceCommit)
assert.equal(provenance.sourceTag, input.sourceTag)
assert.equal(provenance.packageLockSha256, input.packageLockSha256)

assert.equal(provenance.validation.reproductionSucceeded, true)
assert.equal(provenance.provenanceVerified, true)

assert.equal(provenance.attestationCreated, false)
assert.equal(provenance.artifactCreated, false)
assert.equal(provenance.promotionApplied, false)
assert.equal(provenance.deploymentApplied, false)
assert.equal(provenance.runtimeAuthorityGranted, false)

console.log('Governed hermetic reproduction provenance proof passed.')
console.log({
  sourceCommit: provenance.sourceCommit,
  sourceTag: provenance.sourceTag,
  packageLockSha256: provenance.packageLockSha256,
  observedToolchain: provenance.observedToolchain,
  reproductionSucceeded: provenance.validation.reproductionSucceeded,
  provenanceSha256: provenance.provenanceSha256,
  provenanceVerified: provenance.provenanceVerified,
  attestationCreated: provenance.attestationCreated,
  artifactCreated: provenance.artifactCreated,
  promotionApplied: provenance.promotionApplied,
  deploymentApplied: provenance.deploymentApplied,
  runtimeAuthorityGranted: provenance.runtimeAuthorityGranted,
  assertionCount: 12,
})
