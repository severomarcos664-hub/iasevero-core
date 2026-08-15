import { isIP } from 'node:net'

export type RuntimeToolNetworkDestinationDecision = {
  address: string
  ipVersion: 0 | 4 | 6
  destinationEligible: boolean
  destinationStatus: 'eligible' | 'blocked'
  reason: string
}

export function evaluateRuntimeToolNetworkDestination(
  address: string,
): RuntimeToolNetworkDestinationDecision {
  const trimmedAddress = address.trim()
  const comparableAddress = trimmedAddress.toLowerCase()
  const ipVersion = isIP(trimmedAddress) as 0 | 4 | 6

  if (ipVersion === 0) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is not a valid IP address.',
    }
  }

  if (ipVersion === 4 && trimmedAddress.startsWith('127.')) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 loopback.',
    }
  }

  if (
    ipVersion === 4 &&
    (
      trimmedAddress.startsWith('10.') ||
      trimmedAddress.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(trimmedAddress)
    )
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 private address space.',
    }
  }

  if (ipVersion === 4 && trimmedAddress.startsWith('169.254.')) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 link-local address space.',
    }
  }

  if (
    ipVersion === 4 &&
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(trimmedAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 shared address space.',
    }
  }

  if (ipVersion === 4 && trimmedAddress.startsWith('0.')) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 unspecified address space.',
    }
  }

  if (
    ipVersion === 4 &&
    /^(22[4-9]|23\d)\./.test(trimmedAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 multicast address space.',
    }
  }

  if (
    ipVersion === 4 &&
    /^(24\d|25[0-5])\./.test(trimmedAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 reserved address space.',
    }
  }

  if (
    ipVersion === 4 &&
    (
      /^192\.0\.2\./.test(trimmedAddress) ||
      /^198\.51\.100\./.test(trimmedAddress) ||
      /^203\.0\.113\./.test(trimmedAddress)
    )
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 documentation address space.',
    }
  }

  if (
    ipVersion === 4 &&
    /^198\.(1[89])\./.test(trimmedAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv4 benchmarking address space.',
    }
  }

  if (ipVersion === 6 && comparableAddress === '::1') {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv6 loopback.',
    }
  }

  if (
    ipVersion === 6 &&
    /^(fc|fd)/.test(comparableAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv6 unique-local address space.',
    }
  }

  if (
    ipVersion === 6 &&
    /^fe[89ab]/.test(comparableAddress)
  ) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv6 link-local address space.',
    }
  }

  if (ipVersion === 6 && comparableAddress === '::') {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv6 unspecified.',
    }
  }

  if (ipVersion === 6 && comparableAddress.startsWith('ff')) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: false,
      destinationStatus: 'blocked',
      reason: 'Resolved network destination is IPv6 multicast.',
    }
  }

  if (ipVersion === 4) {
    return {
      address: trimmedAddress,
      ipVersion,
      destinationEligible: true,
      destinationStatus: 'eligible',
      reason: 'Resolved network destination is eligible public IPv4 address space.',
    }
  }

  return {
    address: trimmedAddress,
    ipVersion,
    destinationEligible: false,
    destinationStatus: 'blocked',
    reason: 'Resolved network destination classification is not implemented yet.',
  }
}
