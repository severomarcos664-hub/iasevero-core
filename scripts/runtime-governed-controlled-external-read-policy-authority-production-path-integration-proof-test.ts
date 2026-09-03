import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync(
  'app/api/chat/route.ts',
  'utf8',
)

const owner = fs.readFileSync(
  'app/lib/orchestrator/runtime-tool-controlled-external-read-policy-authority.ts',
  'utf8',
)

const count = (needle: string): number =>
  route.split(needle).length - 1

const policyAuthorityImportCount = count(
  'runtime-tool-controlled-external-read-policy-authority',
)

const policyAuthorityCallCount = count(
  'evaluateRuntimeToolControlledExternalReadPolicyAuthority(',
)

const policyAuthorityResponseExposureCount = count(
  'toolControlledExternalReadPolicyAuthority,',
)

const admissionCallCount = count(
  'evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary(',
)

const genericExecutorCallCount = count(
  'evaluateRuntimeToolControlledExecutorBoundary(',
)

const contractCallCount = count(
  'evaluateRuntimeToolControlledExternalReadContract(',
)

const effectCallCount = count(
  'executeRuntimeToolControlledExternalReadEffect(',
)

const fetchCallCount = count('fetch(')

const policyOwnerFailClosed =
  owner.includes('policyAuthorized: false') &&
  owner.includes('allowedHosts: []') &&
  owner.includes('allowedResources: []') &&
  owner.includes('networkAccess: false') &&
  owner.includes('externalReadApplied: false')

console.log({
  architecture:
    'governed-controlled-external-read-policy-authority-production-path-integration',
  policyAuthorityImportCount,
  policyAuthorityCallCount,
  policyAuthorityResponseExposureCount,
  admissionCallCount,
  genericExecutorCallCount,
  policyOwnerFailClosed,
  contractCallCount,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

assert.equal(
  policyAuthorityImportCount,
  1,
  'controlled external-read policy authority import must exist exactly once',
)

assert.equal(
  policyAuthorityCallCount,
  1,
  'controlled external-read policy authority must be evaluated exactly once',
)

assert.equal(
  policyAuthorityResponseExposureCount,
  1,
  'controlled external-read policy authority decision must be audit-visible exactly once',
)

assert.equal(
  admissionCallCount,
  1,
  'controlled external-read executor admission must remain present exactly once',
)

assert.equal(
  genericExecutorCallCount,
  1,
  'generic controlled executor boundary must remain present exactly once',
)

assert.equal(
  policyOwnerFailClosed,
  true,
  'controlled external-read policy authority must remain fail-closed',
)

assert.equal(
  contractCallCount,
  0,
  'external-read contract must not be production-integrated in this version',
)

assert.equal(
  effectCallCount,
  0,
  'external-read effect must not be production-integrated in this version',
)

assert.equal(
  fetchCallCount,
  0,
  'fetch must not exist in the production route in this version',
)

console.log(
  'Runtime governed controlled external.read policy authority production path integration proof passed.',
)
