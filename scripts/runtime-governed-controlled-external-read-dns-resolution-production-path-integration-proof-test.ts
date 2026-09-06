import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

const resolverModule =
  '@/app/lib/orchestrator/runtime-tool-external-read-dns-resolver-adapter'

const boundaryModule =
  '@/app/lib/orchestrator/runtime-tool-external-read-dns-resolution-boundary'

const resolverImportPresent =
  route.includes(resolverModule) &&
  route.includes('createRuntimeToolDnsResolverAdapter')

const boundaryImportPresent =
  route.includes(boundaryModule) &&
  route.includes('evaluateRuntimeToolDnsResolutionBoundary')

const resolverCallCount =
  route.split('createRuntimeToolDnsResolverAdapter(').length - 1

const boundaryCallCount =
  route.split('evaluateRuntimeToolDnsResolutionBoundary(').length - 1

const dnsDecisionPresent =
  route.includes('toolControlledExternalReadDnsResolution')

const resolvedAddressesPreserved =
  route.includes('resolvedAddresses')

const destinationDecisionsPreserved =
  route.includes('destinationDecisions')

const effectCallCount =
  (route.match(/executeRuntimeToolControlledExternalReadEffect\s*\(/g) ?? [])
    .length

const fetchCallCount =
  (route.match(/\bfetch\s*\(/g) ?? [])
    .length

assert.equal(
  resolverImportPresent,
  true,
  'production route must import the canonical governed DNS resolver adapter',
)

assert.equal(
  boundaryImportPresent,
  true,
  'production route must import the canonical DNS resolution boundary',
)

assert.equal(
  resolverCallCount,
  1,
  'production route must create the governed DNS resolver adapter exactly once',
)

assert.equal(
  boundaryCallCount,
  1,
  'production route must evaluate the governed DNS resolution boundary exactly once',
)

assert.equal(
  dnsDecisionPresent,
  true,
  'production route must retain the governed DNS resolution decision',
)

assert.equal(
  resolvedAddressesPreserved,
  true,
  'production path must preserve governed resolved addresses for audit/binding',
)

assert.equal(
  destinationDecisionsPreserved,
  true,
  'production path must preserve destination classification decisions',
)

assert.equal(
  effectCallCount,
  0,
  'DNS production-path integration must not execute the external-read effect',
)

assert.equal(
  fetchCallCount,
  0,
  'DNS production-path integration must not introduce fetch into /api/chat',
)

console.log(
  'Runtime governed controlled external read DNS resolution production path integration proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-dns-resolution-production-path-integration',
  resolverImportPresent,
  boundaryImportPresent,
  resolverCallCount,
  boundaryCallCount,
  dnsDecisionPresent,
  resolvedAddressesPreserved,
  destinationDecisionsPreserved,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  providerInvocation: false,
  executionApplied: false,
  mutationApplied: false,
})
