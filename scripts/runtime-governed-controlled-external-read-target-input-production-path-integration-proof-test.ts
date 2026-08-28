import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const targetInputImportPresent =
  route.includes('evaluateRuntimeToolControlledExternalReadTargetInputBoundary')

const requestTargetPresent =
  route.includes('evaluateRuntimeToolControlledExternalReadRequestTargetContract')

const requestTargetDecisionPresent =
  route.includes('toolControlledExternalReadRequestTarget')

const targetInputDecisionPresent =
  route.includes('toolControlledExternalReadTargetInputBoundary')

const materialCallCount =
  (
    route.match(
      /evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary\s*\(/g,
    ) ?? []
  ).length

const preparationCallCount =
  (
    route.match(
      /evaluateRuntimeToolControlledExternalReadInvocationPreparation\s*\(/g,
    ) ?? []
  ).length

const effectCallCount =
  (
    route.match(
      /evaluateRuntimeToolControlledExternalReadEffect\s*\(/g,
    ) ?? []
  ).length

const fetchCallCount = (route.match(/\bfetch\s*\(/g) ?? []).length

assert.equal(requestTargetPresent, true)
assert.equal(requestTargetDecisionPresent, true)

assert.equal(targetInputImportPresent, true)
assert.equal(targetInputDecisionPresent, true)

assert.equal(materialCallCount, 0)
assert.equal(preparationCallCount, 0)
assert.equal(effectCallCount, 0)
assert.equal(fetchCallCount, 0)

console.log({
  architecture:
    'governed-controlled-external-read-target-input-production-path-integration',
  requestTargetPresent,
  targetInputImportPresent,
  targetInputDecisionPresent,
  materialCallCount,
  preparationCallCount,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})
