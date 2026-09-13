import type {
  GovernedReleaseRuntimeIdentity,
} from '../runtime-release-identity/runtime-release-identity'

export type GovernedRuntimeBlueGreenSlot =
  | 'blue'
  | 'green'

export type GovernedRuntimeBlueGreenDeploymentStateInput = {
  activeSlot: GovernedRuntimeBlueGreenSlot
  activeRelease: GovernedReleaseRuntimeIdentity
  standbyRelease: GovernedReleaseRuntimeIdentity
}

export type GovernedRuntimeBlueGreenDeploymentState = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-blue-green-deployment-state'

  activeSlot: GovernedRuntimeBlueGreenSlot
  standbySlot: GovernedRuntimeBlueGreenSlot

  activeReleaseIdentity: string
  standbyReleaseIdentity: string

  activeContentAddress: string
  standbyContentAddress: string

  releaseIdentitiesVerified: true
  releasesDistinct: true
  slotsDistinct: true
  blueGreenStateEstablished: true

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  rollbackAuthorized: false
  rollbackApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

function assertVerifiedReleaseIdentity(
  release: GovernedReleaseRuntimeIdentity,
  role: 'active' | 'standby',
): void {
  if (
    release.evidenceVerified !== true ||
    release.bindingVerified !== true ||
    typeof release.releaseIdentity !== 'string' ||
    release.releaseIdentity.trim().length === 0 ||
    typeof release.contentAddress !== 'string' ||
    release.contentAddress.trim().length === 0
  ) {
    throw new Error(
      `Governed runtime blue/green deployment state requires verified ${role} release identity.`,
    )
  }

  if (
    release.promotionApplied !== false ||
    release.deploymentApplied !== false ||
    release.runtimeAuthorityGranted !== false ||
    release.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime blue/green deployment state requires zero inherited deployment and runtime authority.',
    )
  }
}

export function establishGovernedRuntimeBlueGreenDeploymentState(
  input: GovernedRuntimeBlueGreenDeploymentStateInput,
): GovernedRuntimeBlueGreenDeploymentState {
  assertVerifiedReleaseIdentity(
    input.activeRelease,
    'active',
  )

  assertVerifiedReleaseIdentity(
    input.standbyRelease,
    'standby',
  )

  if (
    input.activeRelease.releaseIdentity ===
    input.standbyRelease.releaseIdentity
  ) {
    throw new Error(
      'Governed runtime blue/green deployment state requires distinct active and standby release identities.',
    )
  }

  const standbySlot: GovernedRuntimeBlueGreenSlot =
    input.activeSlot === 'blue'
      ? 'green'
      : 'blue'

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-blue-green-deployment-state',

    activeSlot: input.activeSlot,
    standbySlot,

    activeReleaseIdentity:
      input.activeRelease.releaseIdentity,

    standbyReleaseIdentity:
      input.standbyRelease.releaseIdentity,

    activeContentAddress:
      input.activeRelease.contentAddress,

    standbyContentAddress:
      input.standbyRelease.contentAddress,

    releaseIdentitiesVerified: true,
    releasesDistinct: true,
    slotsDistinct: true,
    blueGreenStateEstablished: true,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    rollbackAuthorized: false,
    rollbackApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
