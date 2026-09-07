import type { RuntimeToolDnsResolutionBinding } from './runtime-tool-external-read-dns-resolution-binding'
import type { RuntimeToolDnsResolutionDecision } from './runtime-tool-external-read-dns-resolution-boundary'

export type RuntimeToolDnsRebindingRevalidation = {
  revalidationStatus: 'accepted' | 'blocked'
  hostname: string
  bindingKey: string | null
  originalApprovedAddresses: readonly string[]
  revalidatedApprovedAddresses: readonly string[]
  reason: string
}

function canonicalize(addresses: readonly string[]): string[] {
  return [...new Set(addresses)].sort()
}

export function revalidateRuntimeToolDnsResolutionBinding(
  binding: RuntimeToolDnsResolutionBinding | null,
  decision: RuntimeToolDnsResolutionDecision | null,
): RuntimeToolDnsRebindingRevalidation {
  if (
    binding == null ||
    binding.bindingStatus !== 'bound' ||
    binding.bindingKey == null
  ) {
    return {
      revalidationStatus: 'blocked',
      hostname: binding?.hostname ?? '',
      bindingKey: binding?.bindingKey ?? null,
      originalApprovedAddresses: [],
      revalidatedApprovedAddresses: [],
      reason: 'DNS rebinding revalidation requires an existing governed bound DNS resolution.',
    }
  }

  if (
    decision == null ||
    !decision.resolutionEligible ||
    decision.resolutionStatus !== 'eligible' ||
    decision.hostname !== binding.hostname
  ) {
    return {
      revalidationStatus: 'blocked',
      hostname: binding.hostname,
      bindingKey: binding.bindingKey,
      originalApprovedAddresses: canonicalize(
        binding.approvedAddresses.map((address) => address.address),
      ),
      revalidatedApprovedAddresses: [],
      reason: 'DNS rebinding revalidation failed hostname or resolution eligibility validation.',
    }
  }

  const original = canonicalize(
    binding.approvedAddresses.map((address) => address.address),
  )

  const revalidated = canonicalize(
    decision.resolvedAddresses
      .filter((address) =>
        decision.destinationDecisions.some(
          (destination) =>
            destination.destinationStatus === 'eligible' &&
            destination.address === address.address,
        ),
      )
      .map((address) => address.address),
  )

  const sameSet =
    original.length === revalidated.length &&
    original.every((address, index) => address === revalidated[index])

  if (!sameSet) {
    return {
      revalidationStatus: 'blocked',
      hostname: binding.hostname,
      bindingKey: binding.bindingKey,
      originalApprovedAddresses: original,
      revalidatedApprovedAddresses: revalidated,
      reason: 'DNS rebinding detected: revalidated destination set differs from governed binding.',
    }
  }

  return {
    revalidationStatus: 'accepted',
    hostname: binding.hostname,
    bindingKey: binding.bindingKey,
    originalApprovedAddresses: original,
    revalidatedApprovedAddresses: revalidated,
    reason: 'DNS destination set matches governed binding.',
  }
}
