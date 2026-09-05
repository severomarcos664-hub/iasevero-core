import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const contractImportPresent =
  route.includes(
    'evaluateRuntimeToolControlledExternalReadContract',
  )

const contractCalls =
  route.match(
    /evaluateRuntimeToolControlledExternalReadContract\s*\(/g,
  )?.length ?? 0

const contractResponseExposure =
  /toolControlledExternalReadPolicyAuthority,\s*toolControlledExternalReadContract,/.test(route)

const effectCalls =
  route.match(
    /executeRuntimeToolControlledExternalReadEffect\s*\(/g,
  )?.length ?? 0

const fetchCalls =
  route.match(/\bfetch\s*\(/g)?.length ?? 0

console.log({
  architecture:
    'governed-controlled-external-read-contract-production-path-integration',
  contractImportPresent,
  contractCalls,
  contractResponseExposure,
  effectCalls,
  fetchCalls,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

assert.equal(contractImportPresent, true)
assert.equal(contractCalls, 1)
assert.equal(contractResponseExposure, true)
assert.equal(effectCalls, 0)
assert.equal(fetchCalls, 0)

console.log(
  'Runtime governed controlled external read contract production path integration proof passed.',
)
