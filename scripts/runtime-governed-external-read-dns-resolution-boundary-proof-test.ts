import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolDnsResolutionBoundary,
  type RuntimeToolDnsResolver,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-resolution-boundary'

async function main() {
  let assertionCount = 0

  const assertBlocked = async (
    hostname: string,
    resolver: RuntimeToolDnsResolver,
    expectedReason: string
  ) => {
    const result = await evaluateRuntimeToolDnsResolutionBoundary(
      hostname,
      resolver
    )

    assert.equal(
      result.resolutionEligible,
      false,
      `${hostname || '<empty>'} must be blocked`
    )
    assertionCount++

    assert.equal(
      result.resolutionStatus,
      'blocked',
      `${hostname || '<empty>'} must have blocked status`
    )
    assertionCount++

    assert.equal(result.reason, expectedReason)
    assertionCount++

    return result
  }

  const publicResolver: RuntimeToolDnsResolver = async hostname => {
    assert.equal(hostname, 'example.com')
    assertionCount++

    return [
      { address: '8.8.8.8', family: 4 },
      { address: '1.1.1.1', family: 4 },
    ]
  }

  const eligible = await evaluateRuntimeToolDnsResolutionBoundary(
    ' Example.COM ',
    publicResolver
  )

  assert.equal(eligible.hostname, 'example.com')
  assertionCount++

  assert.equal(eligible.resolutionEligible, true)
  assertionCount++

  assert.equal(eligible.resolutionStatus, 'eligible')
  assertionCount++

  assert.equal(eligible.resolvedAddresses.length, 2)
  assertionCount++

  assert.equal(eligible.destinationDecisions.length, 2)
  assertionCount++

  assert.equal(
    eligible.destinationDecisions.every(
      decision =>
        decision.destinationEligible === true &&
        decision.destinationStatus === 'eligible'
    ),
    true
  )
  assertionCount++

  await assertBlocked(
    '',
    async () => {
      throw new Error('resolver must not run for empty hostname')
    },
    'DNS resolution boundary requires a non-empty hostname.'
  )

  await assertBlocked(
    '127.0.0.1',
    async () => {
      throw new Error('resolver must not run for literal IP')
    },
    'DNS resolution boundary accepts hostnames only; literal IP destinations require direct network destination classification.'
  )

  await assertBlocked(
    'failure.example',
    async () => {
      throw new Error('simulated DNS failure')
    },
    'DNS resolution failed closed.'
  )

  await assertBlocked(
    'empty.example',
    async () => [],
    'DNS resolution returned no destinations.'
  )

  const mixed = await assertBlocked(
    'mixed.example',
    async () => [
      { address: '8.8.8.8', family: 4 },
      { address: '127.0.0.1', family: 4 },
    ],
    'DNS resolution produced one or more non-eligible network destinations.'
  )

  assert.equal(mixed.resolvedAddresses.length, 2)
  assertionCount++

  assert.equal(
    mixed.destinationDecisions.some(
      decision => decision.destinationEligible === false
    ),
    true
  )
  assertionCount++

  const privateOnly = await assertBlocked(
    'private.example',
    async () => [{ address: '10.0.0.1', family: 4 }],
    'DNS resolution produced one or more non-eligible network destinations.'
  )

  assert.equal(
    privateOnly.destinationDecisions[0]?.destinationStatus,
    'blocked'
  )
  assertionCount++

  const unsupportedIpv6 = await assertBlocked(
    'ipv6.example',
    async () => [{ address: '2001:4860:4860::8888', family: 6 }],
    'DNS resolution produced one or more non-eligible network destinations.'
  )

  assert.equal(
    unsupportedIpv6.destinationDecisions[0]?.destinationEligible,
    false
  )
  assertionCount++

  console.log(
    'Runtime governed external-read DNS resolution boundary proof passed.'
  )
  console.log({
    architecture:
      'hostname -> governed-resolution -> network-destination-boundary -> fail-closed eligibility',
    assertionCount,
    publicResolutionEligible: eligible.resolutionEligible,
    mixedResolutionEligible: mixed.resolutionEligible,
    ipv6FailClosed: unsupportedIpv6.resolutionEligible === false,
  })
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
