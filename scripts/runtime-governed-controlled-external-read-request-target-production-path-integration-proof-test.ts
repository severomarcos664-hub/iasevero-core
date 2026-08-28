import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const ownerModule =
  '@/app/lib/orchestrator/runtime-tool-controlled-external-read-request-target-contract'

const ownerImportPresent =
  route.includes(ownerModule) &&
  route.includes('evaluateRuntimeToolControlledExternalReadRequestTargetContract')

const ownerCall =
  'evaluateRuntimeToolControlledExternalReadRequestTargetContract('

const ownerCallCount =
  route.split(ownerCall).length - 1

const requestTargetDecisionPresent =
  route.includes('toolControlledExternalReadRequestTarget')

const responseExposurePresent =
  route.includes('toolControlledExternalReadRequestTarget,')

const effectCallCount =
  (
    route.match(
      /executeRuntimeToolControlledExternalReadEffect\s*\(/g,
    ) ?? []
  ).length

const fetchCallCount =
  (
    route.match(/\bfetch\s*\(/g) ?? []
  ).length

assert.equal(
  ownerImportPresent,
  true,
  'production route must import the canonical controlled external read request target owner',
)

assert.equal(
  ownerCallCount,
  1,
  'production route must evaluate the canonical request target contract exactly once',
)

assert.equal(
  requestTargetDecisionPresent,
  true,
  'production route must retain the governed request target decision',
)

assert.equal(
  responseExposurePresent,
  true,
  'production response must expose the governed request target decision for proof/audit',
)

assert.equal(
  effectCallCount,
  0,
  'request target integration must not execute the controlled external read effect',
)

assert.equal(
  fetchCallCount,
  0,
  'request target integration must not introduce fetch into the production route',
)

console.log(
  'Runtime governed controlled external read request target production path integration proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-request-target-production-path-integration',
  ownerImportPresent,
  ownerCallCount,
  requestTargetDecisionPresent,
  responseExposurePresent,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})
