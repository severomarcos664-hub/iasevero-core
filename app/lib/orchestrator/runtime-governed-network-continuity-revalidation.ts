import type {
  GovernedRuntimePostTrafficSwitchOperationalRevalidation,
} from '../runtime-execution-plane/runtime-post-traffic-switch-operational-revalidation'

import type {
  RuntimeToolDnsRebindingRevalidation,
} from './runtime-tool-external-read-dns-rebinding-revalidation'

export type GovernedNetworkContinuityRevalidationInput = {
  operationalRevalidation:
    GovernedRuntimePostTrafficSwitchOperationalRevalidation
  dnsRevalidation:
    RuntimeToolDnsRebindingRevalidation
}

export type GovernedNetworkContinuityRevalidation = {
  schemaVersion: 1
  kind: 'iasevero-governed-network-continuity-revalidation'

  instanceId: string
  releaseIdentity: string
  processId: number

  operationalContinuityVerified: boolean
  dnsRevalidationAccepted: boolean
  networkContinuityEligible: boolean

  hostname: string
  bindingKey: string | null
  originalApprovedAddresses: readonly string[]
  revalidatedApprovedAddresses: readonly string[]

  networkAuthorityGranted: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

function sameAddressSet(
  left: readonly string[],
  right: readonly string[],
): boolean {
  if (left.length !== right.length) {
    return false
  }

  const a = [...left].sort()
  const b = [...right].sort()

  return a.every(
    (address, index) =>
      address === b[index],
  )
}

export function evaluateGovernedNetworkContinuityRevalidation(
  input: GovernedNetworkContinuityRevalidationInput,
): GovernedNetworkContinuityRevalidation {
  const {
    operationalRevalidation,
    dnsRevalidation,
  } = input

  const operationalContinuityVerified =
    operationalRevalidation
      .postTrafficSwitchStateVerified === true &&
    operationalRevalidation
      .activeReleaseContinuityVerified === true &&
    operationalRevalidation
      .processContinuityVerified === true &&
    operationalRevalidation
      .readinessRevalidationVerified === true &&
    operationalRevalidation
      .livenessRevalidationVerified === true &&
    operationalRevalidation
      .readinessGranted === true &&
    operationalRevalidation
      .livenessGranted === true &&
    operationalRevalidation
      .operationalRevalidationCompleted === true &&
    operationalRevalidation
      .operationalHealthRestored === true &&
    operationalRevalidation
      .trafficSwitchApplied === true &&
    operationalRevalidation
      .restartAuthorized === false &&
    operationalRevalidation
      .deploymentApplied === false &&
    operationalRevalidation
      .runtimeAuthorityGranted === false &&
    operationalRevalidation
      .networkAuthorityGranted === false

  const dnsRevalidationAccepted =
    dnsRevalidation.revalidationStatus === 'accepted' &&
    dnsRevalidation.hostname.trim().length > 0 &&
    dnsRevalidation.bindingKey !== null &&
    dnsRevalidation.bindingKey.trim().length > 0 &&
    dnsRevalidation.originalApprovedAddresses.length > 0 &&
    dnsRevalidation.revalidatedApprovedAddresses.length > 0 &&
    sameAddressSet(
      dnsRevalidation.originalApprovedAddresses,
      dnsRevalidation.revalidatedApprovedAddresses,
    )

  const networkContinuityEligible =
    operationalContinuityVerified &&
    dnsRevalidationAccepted

  return {
    schemaVersion: 1,
    kind:
      'iasevero-governed-network-continuity-revalidation',

    instanceId:
      operationalRevalidation.instanceId,
    releaseIdentity:
      operationalRevalidation.releaseIdentity,
    processId:
      operationalRevalidation.processId,

    operationalContinuityVerified,
    dnsRevalidationAccepted,
    networkContinuityEligible,

    hostname:
      dnsRevalidation.hostname,
    bindingKey:
      dnsRevalidation.bindingKey,
    originalApprovedAddresses:
      dnsRevalidation.originalApprovedAddresses,
    revalidatedApprovedAddresses:
      dnsRevalidation.revalidatedApprovedAddresses,

    networkAuthorityGranted: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason:
      networkContinuityEligible
        ? 'Governed network continuity revalidated without inheriting network authority.'
        : 'Governed network continuity blocked pending valid operational and DNS revalidation evidence.',
  }
}
