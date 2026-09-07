import type {
  RuntimeToolDnsResolvedAddress,
  RuntimeToolDnsResolutionDecision,
} from './runtime-tool-external-read-dns-resolution-boundary'

export type RuntimeToolDnsResolutionBinding = {
  bindingStatus: 'bound' | 'blocked'
  hostname: string
  resolvedAddresses: readonly RuntimeToolDnsResolvedAddress[]
  approvedAddresses: readonly RuntimeToolDnsResolvedAddress[]
  bindingKey: string | null
  reason: string
}

export function createRuntimeToolDnsResolutionBinding(
  decision: RuntimeToolDnsResolutionDecision,
): RuntimeToolDnsResolutionBinding {
  const approvedAddresses =
    decision.resolutionEligible && decision.resolutionStatus === 'eligible'
      ? decision.resolvedAddresses.filter((address) =>
          decision.destinationDecisions.some(
            (destination) =>
              destination.destinationStatus === 'eligible' &&
              destination.address === address.address,
          ),
        )
      : []

  if (!decision.resolutionEligible || approvedAddresses.length === 0) {
    return {
      bindingStatus: 'blocked',
      hostname: decision.hostname,
      resolvedAddresses: decision.resolvedAddresses,
      approvedAddresses: [],
      bindingKey: null,
      reason: 'DNS resolution binding requires at least one eligible resolved destination.',
    }
  }

  const canonicalAddresses = approvedAddresses
    .map((address) => address.address)
    .sort()

  return {
    bindingStatus: 'bound',
    hostname: decision.hostname,
    resolvedAddresses: decision.resolvedAddresses,
    approvedAddresses,
    bindingKey: `${decision.hostname}:${canonicalAddresses.join(',')}`,
    reason: 'DNS resolution binding pinned to governed eligible resolved destinations.',
  }
}
