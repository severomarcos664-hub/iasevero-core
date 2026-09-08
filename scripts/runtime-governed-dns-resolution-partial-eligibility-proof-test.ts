import assert from 'node:assert/strict'
import {
  evaluateRuntimeToolDnsResolutionBoundary,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-resolution-boundary'

async function main() {
  const result = await evaluateRuntimeToolDnsResolutionBoundary(
    'www.iana.org',
    async () => [
      { address: '104.18.25.232', family: 4 },
      { address: '2606:4700::6812:19e8', family: 6 },
    ],
  )

  assert.equal(
    result.resolutionEligible,
    true,
    'RED: DNS resolution must remain eligible when at least one resolved destination is eligible.',
  )

  assert.equal(result.resolutionStatus, 'eligible')

  const eligible = result.destinationDecisions.filter(
    (d) => d.destinationEligible && d.destinationStatus === 'eligible',
  )

  const blocked = result.destinationDecisions.filter(
    (d) => !d.destinationEligible || d.destinationStatus === 'blocked',
  )

  assert.ok(eligible.length >= 1)
  assert.ok(blocked.length >= 1)

  console.log({
    architecture:
      'dns-resolution -> per-destination-governance -> eligible-subset -> binding',
    resolutionEligible: result.resolutionEligible,
    resolutionStatus: result.resolutionStatus,
    eligibleCount: eligible.length,
    blockedCount: blocked.length,
  })

  console.log('Runtime governed DNS partial eligibility proof passed.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
