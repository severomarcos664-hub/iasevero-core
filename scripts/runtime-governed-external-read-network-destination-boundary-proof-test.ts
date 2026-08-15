import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolNetworkDestination,
} from '../app/lib/orchestrator/runtime-tool-external-read-network-destination-boundary'

function expectBlocked(address: string) {
  const result = evaluateRuntimeToolNetworkDestination(address)
  assert.equal(result.destinationEligible, false, `${address} must be blocked`)
  assert.equal(result.destinationStatus, 'blocked', `${address} must be blocked`)
  return result
}

function expectEligible(address: string) {
  const result = evaluateRuntimeToolNetworkDestination(address)
  assert.equal(result.destinationEligible, true, `${address} must be eligible`)
  assert.equal(result.destinationStatus, 'eligible', `${address} must be eligible`)
  assert.equal(
    result.reason,
    'Resolved network destination is eligible public IPv4 address space.',
    `${address} must be classified as public IPv4`,
  )
  return result
}

function main() {
  const blockedAddresses = [
    '127.0.0.1',
    '10.0.0.1',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.1.1',
    '100.64.0.0',
    '100.127.255.255',
    '192.0.2.1',
    '198.51.100.1',
    '203.0.113.1',
    '198.18.0.1',
    '198.19.255.254',
    '0.0.0.0',
    '224.0.0.1',
    '239.255.255.255',
    '240.0.0.1',
    '255.255.255.255',
    '::1',
    '::',
    'fc00::1',
    'fdff::1',
    'fe80::1',
    'febf::1',
    'ff02::1',
  ]

  for (const address of blockedAddresses) {
    expectBlocked(address)
  }

  const eligibleAddresses = [
    '8.8.8.8',
    '1.1.1.1',
    '100.63.255.255',
    '100.128.0.0',
    '172.15.255.255',
    '172.32.0.0',
    '223.255.255.255',
  ]

  const eligibleCases = eligibleAddresses.map(expectEligible)

  console.log('Runtime governed external-read network destination boundary proof passed.')
  console.log({
    architecture:
      'resolved-address -> destination-boundary -> fail-closed classification',
    blockedCount: blockedAddresses.length,
    eligibleCases,
    assertionCount: blockedAddresses.length * 2 + eligibleAddresses.length * 3,
  })
}

main()
