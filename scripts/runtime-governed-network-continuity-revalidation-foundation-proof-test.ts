import assert from 'node:assert/strict'

import type {
  GovernedRuntimePostTrafficSwitchOperationalRevalidation,
} from '../app/lib/runtime-execution-plane/runtime-post-traffic-switch-operational-revalidation'

import type {
  RuntimeToolDnsRebindingRevalidation,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-rebinding-revalidation'

import {
  evaluateGovernedNetworkContinuityRevalidation,
} from '../app/lib/orchestrator/runtime-governed-network-continuity-revalidation'

const operationalRevalidation:
  GovernedRuntimePostTrafficSwitchOperationalRevalidation = {
    schemaVersion: 1,
    kind:
      'iasevero-governed-runtime-post-traffic-switch-operational-revalidation',

    instanceId:
      'instance-v2877362-proof',
    releaseIdentity:
      'v287.73.62-active-proof',
    processId: 7362,

    activeSlot: 'green',
    standbySlot: 'blue',
    activeReleaseIdentity:
      'v287.73.62-active-proof',

    postTrafficSwitchStateVerified: true,
    activeReleaseContinuityVerified: true,
    processContinuityVerified: true,

    readinessRevalidationVerified: true,
    livenessRevalidationVerified: true,

    readinessGranted: true,
    livenessGranted: true,

    operationalRevalidationCompleted: true,
    operationalHealthRestored: true,

    trafficSwitchApplied: true,

    restartAuthorized: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

const acceptedDns:
  RuntimeToolDnsRebindingRevalidation = {
    revalidationStatus: 'accepted',
    hostname: 'example.com',
    bindingKey:
      'dns-binding-v2877362-proof',
    originalApprovedAddresses: [
      '93.184.216.34',
    ],
    revalidatedApprovedAddresses: [
      '93.184.216.34',
    ],
    reason:
      'DNS destination set matches governed binding.',
  }

const accepted =
  evaluateGovernedNetworkContinuityRevalidation({
    operationalRevalidation,
    dnsRevalidation: acceptedDns,
  })

assert.equal(
  accepted.operationalContinuityVerified,
  true,
)
assert.equal(
  accepted.dnsRevalidationAccepted,
  true,
)
assert.equal(
  accepted.networkContinuityEligible,
  true,
)

assert.equal(
  accepted.networkAuthorityGranted,
  false,
)
assert.equal(
  accepted.externalReadApplied,
  false,
)
assert.equal(
  accepted.executionApplied,
  false,
)
assert.equal(
  accepted.mutationApplied,
  false,
)
assert.equal(
  accepted.providerInvocation,
  false,
)

const blockedDns:
  RuntimeToolDnsRebindingRevalidation = {
    revalidationStatus: 'blocked',
    hostname: 'example.com',
    bindingKey:
      'dns-binding-v2877362-proof',
    originalApprovedAddresses: [
      '93.184.216.34',
    ],
    revalidatedApprovedAddresses: [],
    reason:
      'DNS rebinding detected.',
  }

const blocked =
  evaluateGovernedNetworkContinuityRevalidation({
    operationalRevalidation,
    dnsRevalidation: blockedDns,
  })

assert.equal(
  blocked.operationalContinuityVerified,
  true,
)
assert.equal(
  blocked.dnsRevalidationAccepted,
  false,
)
assert.equal(
  blocked.networkContinuityEligible,
  false,
)
assert.equal(
  blocked.networkAuthorityGranted,
  false,
)
assert.equal(
  blocked.externalReadApplied,
  false,
)
assert.equal(
  blocked.executionApplied,
  false,
)

const inheritedNetworkAuthority = {
  ...operationalRevalidation,
  networkAuthorityGranted: true,
} as unknown as GovernedRuntimePostTrafficSwitchOperationalRevalidation

const inheritedAuthorityBlocked =
  evaluateGovernedNetworkContinuityRevalidation({
    operationalRevalidation:
      inheritedNetworkAuthority,
    dnsRevalidation:
      acceptedDns,
  })

assert.equal(
  inheritedAuthorityBlocked
    .operationalContinuityVerified,
  false,
)
assert.equal(
  inheritedAuthorityBlocked
    .networkContinuityEligible,
  false,
)
assert.equal(
  inheritedAuthorityBlocked
    .networkAuthorityGranted,
  false,
)

console.log({
  architecture:
    'post-traffic-switch-operational-revalidation -> fresh-dns-rebinding-revalidation -> network-continuity-eligibility -> zero-inherited-network-authority -> zero-effect',

  operationalContinuityVerified:
    accepted.operationalContinuityVerified,

  dnsRevalidationAccepted:
    accepted.dnsRevalidationAccepted,

  networkContinuityEligible:
    accepted.networkContinuityEligible,

  blockedDnsRejected:
    blocked.networkContinuityEligible === false,

  inheritedNetworkAuthorityRejected:
    inheritedAuthorityBlocked
      .networkContinuityEligible === false,

  networkAuthorityGranted:
    accepted.networkAuthorityGranted,

  externalReadApplied:
    accepted.externalReadApplied,

  executionApplied:
    accepted.executionApplied,

  mutationApplied:
    accepted.mutationApplied,

  providerInvocation:
    accepted.providerInvocation,
})

console.log(
  'Runtime governed network continuity revalidation foundation proof passed.',
)
