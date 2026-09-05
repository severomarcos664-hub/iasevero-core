import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const sourceCalls =
  route.match(/evaluateRuntimeToolControlledExternalReadAllowlistSource\s*\(/g)?.length ?? 0

const policyWithSource =
  /evaluateRuntimeToolControlledExternalReadPolicyAuthority\s*\(\s*toolControlledExternalReadAllowlistSource\s*,?\s*\)/.test(route)

const sourceResponseExposure =
  /toolControlledExternalReadExecutorAdmissionBoundary,\s*toolControlledExternalReadAllowlistSource,\s*toolControlledExternalReadPolicyAuthority,/.test(route)

const contractCalls =
  route.match(/evaluateRuntimeToolControlledExternalReadContract\s*\(/g)?.length ?? 0

const effectCalls =
  route.match(/executeRuntimeToolControlledExternalReadEffect\s*\(/g)?.length ?? 0

const fetchCalls = route.match(/\bfetch\s*\(/g)?.length ?? 0

console.log({
  architecture: 'governed-controlled-external-read-allowlist-source-production-path-integration',
  sourceCalls,
  policyWithSource,
  sourceResponseExposure,
  contractCalls,
  effectCalls,
  fetchCalls,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

assert.equal(sourceCalls, 1)
assert.equal(policyWithSource, true)
assert.equal(sourceResponseExposure, true)
assert.equal(contractCalls, 0)
assert.equal(effectCalls, 0)
assert.equal(fetchCalls, 0)
