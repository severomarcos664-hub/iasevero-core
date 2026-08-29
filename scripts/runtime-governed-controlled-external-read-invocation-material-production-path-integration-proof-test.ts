import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const targetInputPresent =
  route.includes(
    'evaluateRuntimeToolControlledExternalReadTargetInputBoundary',
  )

const materialImportPresent =
  route.includes(
    'evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary',
  )

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

assert.equal(targetInputPresent, true)
assert.equal(materialImportPresent, true)
assert.equal(materialCallCount, 1)

assert.equal(preparationCallCount, 0)
assert.equal(effectCallCount, 0)
assert.equal(fetchCallCount, 0)

console.log({
  architecture:
    'governed-controlled-external-read-invocation-material-production-path-integration',
  targetInputPresent,
  materialImportPresent,
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
