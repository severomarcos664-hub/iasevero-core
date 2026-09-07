import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  createRuntimeToolDnsResolutionBinding,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-resolution-binding'

const route = readFileSync('app/api/chat/route.ts', 'utf8')
const effect = readFileSync(
  'app/lib/orchestrator/runtime-tool-controlled-external-read-effect.ts',
  'utf8',
)

const eligibleDecision = {
  hostname: 'example.com',
  resolutionEligible: true,
  resolutionStatus: 'eligible',
  resolvedAddresses: [
    { address: '93.184.216.34', family: 4 },
    { address: '2606:2800:220:1:248:1893:25c8:1946', family: 6 },
  ],
  destinationDecisions: [
    {
      address: '93.184.216.34',
      destinationStatus: 'eligible',
    },
    {
      address: '2606:2800:220:1:248:1893:25c8:1946',
      destinationStatus: 'eligible',
    },
  ],
  reason: 'eligible test fixture',
} as any

const blockedDecision = {
  hostname: 'internal.example',
  resolutionEligible: false,
  resolutionStatus: 'blocked',
  resolvedAddresses: [
    { address: '127.0.0.1', family: 4 },
  ],
  destinationDecisions: [
    {
      address: '127.0.0.1',
      destinationStatus: 'blocked',
    },
  ],
  reason: 'blocked test fixture',
} as any

const boundA = createRuntimeToolDnsResolutionBinding(eligibleDecision)
const boundB = createRuntimeToolDnsResolutionBinding(eligibleDecision)
const blocked = createRuntimeToolDnsResolutionBinding(blockedDecision)

assert.equal(boundA.bindingStatus, 'bound')
assert.equal(boundA.hostname, 'example.com')
assert.equal(boundA.approvedAddresses.length, 2)
assert.equal(boundA.bindingKey !== null, true)

assert.equal(
  boundA.bindingKey,
  boundB.bindingKey,
  'binding identity must be deterministic',
)

for (const approved of boundA.approvedAddresses) {
  assert.equal(
    boundA.resolvedAddresses.some(
      (resolved) => resolved.address === approved.address,
    ),
    true,
    'every approved address must originate from the resolved address set',
  )
}

assert.equal(blocked.bindingStatus, 'blocked')
assert.equal(blocked.approvedAddresses.length, 0)
assert.equal(blocked.bindingKey, null)

assert.equal(
  route.includes(
    "runtime-tool-external-read-dns-resolution-binding",
  ),
  true,
  'production path must import the canonical DNS resolution binding owner',
)

assert.equal(
  route.includes('const toolControlledExternalReadDnsBinding ='),
  true,
  'production path must create the governed DNS binding',
)

assert.equal(
  route.includes('toolControlledExternalReadDnsBinding,'),
  true,
  'production response must preserve the DNS binding for audit/evidence',
)

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
  effectCallCount,
  0,
  'v287.69 production path must not execute the external-read effect',
)

assert.equal(
  fetchCallCount,
  0,
  'v287.69 production path must not introduce fetch into /api/chat',
)

assert.equal(
  effect.includes('input.target.host'),
  true,
  'hostname identity must remain available for future HTTPS/TLS verification',
)

console.log({
  architecture:
    'dns-resolution -> governed-binding/pinning-evidence -> future-effect',
  boundStatus: boundA.bindingStatus,
  approvedAddressCount: boundA.approvedAddresses.length,
  deterministicBindingKey: boundA.bindingKey === boundB.bindingKey,
  blockedStatus: blocked.bindingStatus,
  blockedBindingKey: blocked.bindingKey,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

console.log(
  'Runtime governed controlled external read DNS resolution binding/pinning proof passed.',
)
