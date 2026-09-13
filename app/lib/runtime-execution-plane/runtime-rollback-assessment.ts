import type {
  GovernedRuntimeBlueGreenDeploymentState,
} from './runtime-blue-green-deployment-state'

export type GovernedRuntimeRollbackAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-assessment'

  activeSlot: 'blue' | 'green'
  standbySlot: 'blue' | 'green'

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string

  rollbackFromContentAddress: string
  rollbackTargetContentAddress: string

  blueGreenStateVerified: true
  rollbackAssessmentCompleted: true
  rollbackTargetIdentified: true

  rollbackConditionAssessed: false
  rollbackDecisionMade: false
  rollbackAuthorized: false
  rollbackApplied: false

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function assessGovernedRuntimeRollback(
  state: GovernedRuntimeBlueGreenDeploymentState,
): GovernedRuntimeRollbackAssessment {
  if (
    state.blueGreenStateEstablished !== true ||
    state.releaseIdentitiesVerified !== true ||
    state.releasesDistinct !== true ||
    state.slotsDistinct !== true ||
    state.activeSlot === state.standbySlot ||
    state.activeReleaseIdentity === state.standbyReleaseIdentity ||
    state.activeReleaseIdentity.trim().length === 0 ||
    state.standbyReleaseIdentity.trim().length === 0 ||
    state.activeContentAddress.trim().length === 0 ||
    state.standbyContentAddress.trim().length === 0
  ) {
    throw new Error(
      'Governed runtime rollback assessment requires verified blue/green deployment state.',
    )
  }

  if (
    state.trafficSwitchAuthorized !== false ||
    state.trafficSwitchApplied !== false ||
    state.rollbackAuthorized !== false ||
    state.rollbackApplied !== false ||
    state.deploymentApplied !== false ||
    state.runtimeAuthorityGranted !== false ||
    state.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback assessment requires zero inherited execution authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-assessment',

    activeSlot: state.activeSlot,
    standbySlot: state.standbySlot,

    rollbackFromReleaseIdentity:
      state.activeReleaseIdentity,

    rollbackTargetReleaseIdentity:
      state.standbyReleaseIdentity,

    rollbackFromContentAddress:
      state.activeContentAddress,

    rollbackTargetContentAddress:
      state.standbyContentAddress,

    blueGreenStateVerified: true,
    rollbackAssessmentCompleted: true,
    rollbackTargetIdentified: true,

    rollbackConditionAssessed: false,
    rollbackDecisionMade: false,
    rollbackAuthorized: false,
    rollbackApplied: false,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
