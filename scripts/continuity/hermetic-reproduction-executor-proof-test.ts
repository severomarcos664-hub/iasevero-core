import assert from 'node:assert/strict'
import { executeHermeticReproduction } from './hermetic-reproduction-executor'

const result = executeHermeticReproduction(
  process.cwd(),
  'v287.24-governed-hermetic-reproduction-contract-proof',
)

assert.equal(result.sourceIdentityVerified, true)
assert.equal(result.tagIdentityVerified, true)
assert.equal(result.lockfileVerified, true)
assert.equal(result.cleanEnvironmentVerified, true)
assert.equal(result.installSucceeded, true)
assert.equal(result.tscSucceeded, true)
assert.equal(result.proofSucceeded, true)
assert.equal(result.regressionSucceeded, true)
assert.equal(result.buildSucceeded, true)
assert.equal(result.reproductionExecuted, true)
assert.equal(result.reproductionSucceeded, true)

assert.equal(result.networkRuntimeAccess, false)
assert.equal(result.deploymentApplied, false)
assert.equal(result.promotionApplied, false)
assert.equal(result.runtimeAuthorityGranted, false)

console.log('Governed hermetic reproduction execution proof passed.')
console.log({
  ...result,
  assertionCount: 15,
})
