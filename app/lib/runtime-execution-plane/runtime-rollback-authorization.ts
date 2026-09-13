import type {
  GovernedRuntimeRollbackDecision,
} from './runtime-rollback-decision'

export type GovernedRuntimeRollbackAuthorizationInput = {
  decision: GovernedRuntimeRollbackDecision
  rollbackAuthorizationRecordId: string
  rollbackAuthorizationGranted: boolean
}

export type GovernedRuntimeRollbackAuthorization = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-rollback-authorization'

  instanceId: string
  releaseIdentity: string
  processId: number

  rollbackFromReleaseIdentity: string
  rollbackTargetReleaseIdentity: string
  rollbackTargetContentAddress: string

  rollbackDecisionVerified: true
  rollbackAuthorizationRecordId: string

  rollbackRequired: boolean
  rollbackApproved: boolean

  rollbackEligible: boolean
  rollbackAuthorizationGranted: boolean
  rollbackAuthorized: boolean

  rollbackApplied: false

  trafficSwitchAuthorized: false
  trafficSwitchApplied: false

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function authorizeGovernedRuntimeRollback(
  input: GovernedRuntimeRollbackAuthorizationInput,
): GovernedRuntimeRollbackAuthorization {
  const {
    decision,
    rollbackAuthorizationRecordId,
    rollbackAuthorizationGranted,
  } = input

  if (
    decision.rollbackConditionAssessmentVerified !== true ||
    decision.rollbackDecisionMade !== true ||
    !Number.isSafeInteger(decision.processId) ||
    decision.processId <= 0
  ) {
    throw new Error(
      'Governed runtime rollback authorization requires verified rollback decision.',
    )
  }

  if (
    decision.rollbackAuthorized !== false ||
    decision.rollbackApplied !== false ||
    decision.trafficSwitchAuthorized !== false ||
    decision.trafficSwitchApplied !== false ||
    decision.deploymentApplied !== false ||
    decision.runtimeAuthorityGranted !== false ||
    decision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime rollback authorization requires zero inherited rollback and execution authority.',
    )
  }

  const normalizedAuthorizationRecordId =
    rollbackAuthorizationRecordId.trim()

  if (normalizedAuthorizationRecordId.length === 0) {
    throw new Error(
      'Governed runtime rollback authorization requires rollback authorization record id.',
    )
  }

  const rollbackEligible =
    decision.rollbackRequired === true &&
    decision.rollbackApproved === true

  const rollbackAuthorized =
    rollbackEligible &&
    rollbackAuthorizationGranted === true

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-authorization',

    instanceId: decision.instanceId,
    releaseIdentity: decision.releaseIdentity,
    processId: decision.processId,

    rollbackFromReleaseIdentity:
      decision.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      decision.rollbackTargetReleaseIdentity,

    rollbackTargetContentAddress:
      decision.rollbackTargetContentAddress,

    rollbackDecisionVerified: true,

    rollbackAuthorizationRecordId:
      normalizedAuthorizationRecordId,

    rollbackRequired:
      decision.rollbackRequired,

    rollbackApproved:
      decision.rollbackApproved,

    rollbackEligible,
    rollbackAuthorizationGranted,
    rollbackAuthorized,

    rollbackApplied: false,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
