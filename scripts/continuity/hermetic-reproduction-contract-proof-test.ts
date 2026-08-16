import assert from 'node:assert/strict'
import {
  HERMETIC_REPRODUCTION_CONTRACT,
  validateHermeticReproductionContract,
} from './hermetic-reproduction-contract'

const c = HERMETIC_REPRODUCTION_CONTRACT

assert.equal(validateHermeticReproductionContract(c), true)
assert.equal(c.sourceIdentityRequired, true)
assert.equal(c.tagIdentityRequired, true)
assert.equal(c.lockfileRequired, true)
assert.equal(c.cleanEnvironmentRequired, true)
assert.equal(c.toolchainIdentityRequired, true)

assert.equal(c.networkRuntimeAccess, false)
assert.equal(c.reproductionExecuted, false)
assert.equal(c.deploymentApplied, false)
assert.equal(c.promotionApplied, false)
assert.equal(c.runtimeAuthorityGranted, false)

assert.equal(
  c.boundary,
  'SOURCE_CONTINUITY_NE_REPRODUCTION_EXECUTION',
)

console.log('Governed hermetic reproduction contract proof passed.')
console.log({
  sourceIdentityRequired: c.sourceIdentityRequired,
  tagIdentityRequired: c.tagIdentityRequired,
  lockfileRequired: c.lockfileRequired,
  cleanEnvironmentRequired: c.cleanEnvironmentRequired,
  toolchainIdentityRequired: c.toolchainIdentityRequired,
  networkRuntimeAccess: c.networkRuntimeAccess,
  reproductionExecuted: c.reproductionExecuted,
  deploymentApplied: c.deploymentApplied,
  promotionApplied: c.promotionApplied,
  runtimeAuthorityGranted: c.runtimeAuthorityGranted,
  boundary: c.boundary,
  assertionCount: 11,
})
