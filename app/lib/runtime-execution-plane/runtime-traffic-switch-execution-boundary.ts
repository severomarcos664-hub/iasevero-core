import type {
  GovernedRuntimeTrafficSwitchAuthorization,
} from './runtime-traffic-switch-authorization'

export type GovernedRuntimeTrafficSwitchExecutorInput = {
  instanceId: string
  processId: number

  previousActiveSlot: 'blue' | 'green'
  previousStandbySlot: 'blue' | 'green'

  trafficSwitchFromReleaseIdentity: string
  trafficSwitchTargetReleaseIdentity: string
  trafficSwitchTargetContentAddress: string

  trafficSwitchAuthorizationRecordId: string
}

export type GovernedRuntimeTrafficSwitchExecutorResult = {
  newActiveSlot: 'blue' | 'green'
  newStandbySlot: 'blue' | 'green'

  activeReleaseIdentity: string
  activeContentAddress: string

  trafficSwitchApplied: true
}

export type GovernedRuntimeTrafficSwitchExecutor = (
  input: GovernedRuntimeTrafficSwitchExecutorInput,
) => Promise<GovernedRuntimeTrafficSwitchExecutorResult>

export type GovernedRuntimeTrafficSwitchExecutionBoundaryInput = {
  authorization: GovernedRuntimeTrafficSwitchAuthorization
  executor: GovernedRuntimeTrafficSwitchExecutor
}

export type GovernedRuntimeTrafficSwitchExecutionBoundaryResult = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-traffic-switch-execution-boundary'

  instanceId: string
  releaseIdentity: string
  processId: number

  previousActiveSlot: 'blue' | 'green'
  previousStandbySlot: 'blue' | 'green'

  newActiveSlot: 'blue' | 'green'
  newStandbySlot: 'blue' | 'green'

  trafficSwitchFromReleaseIdentity: string
  trafficSwitchTargetReleaseIdentity: string
  trafficSwitchTargetContentAddress: string

  trafficSwitchAuthorizationRecordId: string

  trafficSwitchAuthorizationVerified: true
  trafficSwitchExecutionVerified: true
  trafficSwitchApplied: true

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export async function executeGovernedRuntimeTrafficSwitchBoundary(
  input: GovernedRuntimeTrafficSwitchExecutionBoundaryInput,
): Promise<GovernedRuntimeTrafficSwitchExecutionBoundaryResult> {
  const {
    authorization,
    executor,
  } = input

  if (
    authorization.rollbackExecutionVerified !== true ||
    authorization.blueGreenStateVerified !== true ||
    authorization.trafficSwitchEligible !== true ||
    authorization.trafficSwitchAuthorizationGranted !== true ||
    authorization.trafficSwitchAuthorized !== true ||
    authorization.trafficSwitchAuthorizationRecordId.trim().length === 0 ||
    !Number.isSafeInteger(authorization.processId) ||
    authorization.processId <= 0
  ) {
    throw new Error(
      'Governed runtime traffic switch execution boundary requires explicit traffic switch authorization.',
    )
  }

  if (
    authorization.trafficSwitchApplied !== false ||
    authorization.deploymentApplied !== false ||
    authorization.runtimeAuthorityGranted !== false ||
    authorization.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime traffic switch execution boundary requires zero inherited traffic switch effect and runtime authority.',
    )
  }

  if (
    authorization.activeSlot === authorization.standbySlot
  ) {
    throw new Error(
      'Governed runtime traffic switch execution boundary requires distinct active and standby slots.',
    )
  }

  const effect = await executor({
    instanceId: authorization.instanceId,
    processId: authorization.processId,

    previousActiveSlot: authorization.activeSlot,
    previousStandbySlot: authorization.standbySlot,

    trafficSwitchFromReleaseIdentity:
      authorization.trafficSwitchFromReleaseIdentity,

    trafficSwitchTargetReleaseIdentity:
      authorization.trafficSwitchTargetReleaseIdentity,

    trafficSwitchTargetContentAddress:
      authorization.trafficSwitchTargetContentAddress,

    trafficSwitchAuthorizationRecordId:
      authorization.trafficSwitchAuthorizationRecordId,
  })

  if (
    effect.trafficSwitchApplied !== true ||
    effect.newActiveSlot !== authorization.standbySlot ||
    effect.newStandbySlot !== authorization.activeSlot ||
    effect.activeReleaseIdentity !==
      authorization.trafficSwitchTargetReleaseIdentity ||
    effect.activeContentAddress !==
      authorization.trafficSwitchTargetContentAddress
  ) {
    throw new Error(
      'Governed runtime traffic switch execution boundary requires verified canonical active-standby inversion.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-traffic-switch-execution-boundary',

    instanceId: authorization.instanceId,
    releaseIdentity: authorization.releaseIdentity,
    processId: authorization.processId,

    previousActiveSlot: authorization.activeSlot,
    previousStandbySlot: authorization.standbySlot,

    newActiveSlot: effect.newActiveSlot,
    newStandbySlot: effect.newStandbySlot,

    trafficSwitchFromReleaseIdentity:
      authorization.trafficSwitchFromReleaseIdentity,

    trafficSwitchTargetReleaseIdentity:
      authorization.trafficSwitchTargetReleaseIdentity,

    trafficSwitchTargetContentAddress:
      authorization.trafficSwitchTargetContentAddress,

    trafficSwitchAuthorizationRecordId:
      authorization.trafficSwitchAuthorizationRecordId,

    trafficSwitchAuthorizationVerified: true,
    trafficSwitchExecutionVerified: true,
    trafficSwitchApplied: true,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
