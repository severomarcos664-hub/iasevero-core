import { isIP } from 'node:net'

import {
  evaluateRuntimeToolNetworkDestination,
  type RuntimeToolNetworkDestinationDecision,
} from './runtime-tool-external-read-network-destination-boundary'

export type RuntimeToolDnsResolvedAddress = {
  address: string
  family: 4 | 6
}

export type RuntimeToolDnsResolver = (
  hostname: string
) => Promise<readonly RuntimeToolDnsResolvedAddress[]>

export type RuntimeToolDnsResolutionDecision = {
  hostname: string
  resolutionEligible: boolean
  resolutionStatus: 'eligible' | 'blocked'
  resolvedAddresses: readonly RuntimeToolDnsResolvedAddress[]
  destinationDecisions: readonly RuntimeToolNetworkDestinationDecision[]
  reason: string
}

export async function evaluateRuntimeToolDnsResolutionBoundary(
  hostname: string,
  resolver: RuntimeToolDnsResolver
): Promise<RuntimeToolDnsResolutionDecision> {
  const normalizedHostname = hostname.trim().toLowerCase()

  if (normalizedHostname.length === 0) {
    return {
      hostname: normalizedHostname,
      resolutionEligible: false,
      resolutionStatus: 'blocked',
      resolvedAddresses: [],
      destinationDecisions: [],
      reason: 'DNS resolution boundary requires a non-empty hostname.',
    }
  }

  if (isIP(normalizedHostname) !== 0) {
    return {
      hostname: normalizedHostname,
      resolutionEligible: false,
      resolutionStatus: 'blocked',
      resolvedAddresses: [],
      destinationDecisions: [],
      reason:
        'DNS resolution boundary accepts hostnames only; literal IP destinations require direct network destination classification.',
    }
  }

  let resolvedAddresses: readonly RuntimeToolDnsResolvedAddress[]

  try {
    resolvedAddresses = await resolver(normalizedHostname)
  } catch {
    return {
      hostname: normalizedHostname,
      resolutionEligible: false,
      resolutionStatus: 'blocked',
      resolvedAddresses: [],
      destinationDecisions: [],
      reason: 'DNS resolution failed closed.',
    }
  }

  if (resolvedAddresses.length === 0) {
    return {
      hostname: normalizedHostname,
      resolutionEligible: false,
      resolutionStatus: 'blocked',
      resolvedAddresses: [],
      destinationDecisions: [],
      reason: 'DNS resolution returned no destinations.',
    }
  }

  const destinationDecisions = resolvedAddresses.map(({ address }) =>
    evaluateRuntimeToolNetworkDestination(address)
  )

  const allDestinationsEligible = destinationDecisions.every(
    decision =>
      decision.destinationEligible === true &&
      decision.destinationStatus === 'eligible'
  )

  if (!allDestinationsEligible) {
    return {
      hostname: normalizedHostname,
      resolutionEligible: false,
      resolutionStatus: 'blocked',
      resolvedAddresses,
      destinationDecisions,
      reason:
        'DNS resolution produced one or more non-eligible network destinations.',
    }
  }

  return {
    hostname: normalizedHostname,
    resolutionEligible: true,
    resolutionStatus: 'eligible',
    resolvedAddresses,
    destinationDecisions,
    reason:
      'All DNS-resolved network destinations are explicitly eligible.',
  }
}
