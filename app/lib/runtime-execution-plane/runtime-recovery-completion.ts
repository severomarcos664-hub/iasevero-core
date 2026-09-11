import type {
  GovernedRuntimeRestartExecutionResult,
} from './runtime-restart-execution-boundary'

import type {
  GovernedRuntimeProcessIdentityRebinding,
} from './runtime-process-identity-binding'

import type {
  GovernedRuntimeLivenessDecision,
} from './runtime-liveness-decision'

export type GovernedRuntimeRecoveryCompletionInput = {
  restartExecution: GovernedRuntimeRestartExecutionResult
  identityRebinding: GovernedRuntimeProcessIdentityRebinding
  livenessDecision: GovernedRuntimeLivenessDecision
}

export type GovernedRuntimeRecoveryCompletion = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-recovery-completion'

  instanceId: string
  releaseIdentity: string
  restartAuthorizationRecordId: string

  previousProcessId: number
  processId: number

  restartExecutionVerified: true
  processIdentityRebindingVerified: true
  readinessRestored: true
  livenessRestored: true

  recoveryCompleted: true
  operationalHealthRestored: true

  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function completeGovernedRuntimeRecovery(
  input: GovernedRuntimeRecoveryCompletionInput,
): GovernedRuntimeRecoveryCompletion {
  const {
    restartExecution,
    identityRebinding,
    livenessDecision,
  } = input

  if (
    restartExecution.restartAuthorizationVerified !== true ||
    restartExecution.restartExecutionPrepared !== true ||
    restartExecution.restartApplied !== true ||
    restartExecution.processIdentityRebindingRequired !== true
  ) {
    throw new Error(
      'Governed runtime recovery completion requires verified restart execution.',
    )
  }

  if (
    identityRebinding.restartExecutionVerified !== true ||
    identityRebinding.previousProcessIdVerified !== true ||
    identityRebinding.replacementProcessIdVerified !== true ||
    identityRebinding.processIdentityRebound !== true
  ) {
    throw new Error(
      'Governed runtime recovery completion requires verified process identity rebinding.',
    )
  }

  if (
    livenessDecision.livenessAssessmentVerified !== true ||
    livenessDecision.livenessDecisionMade !== true ||
    livenessDecision.readinessGranted !== true ||
    livenessDecision.livenessGranted !== true
  ) {
    throw new Error(
      'Governed runtime recovery completion requires restored readiness and liveness.',
    )
  }

  if (
    restartExecution.instanceId !== identityRebinding.instanceId ||
    restartExecution.instanceId !== livenessDecision.instanceId ||
    restartExecution.releaseIdentity !== identityRebinding.releaseIdentity ||
    restartExecution.releaseIdentity !== livenessDecision.releaseIdentity ||
    restartExecution.restartAuthorizationRecordId !==
      identityRebinding.restartAuthorizationRecordId ||
    restartExecution.restartAuthorizationRecordId !==
      livenessDecision.authorizationRecordId ||
    restartExecution.previousProcessId !==
      identityRebinding.previousProcessId ||
    restartExecution.newProcessId !== identityRebinding.processId ||
    identityRebinding.processId !== livenessDecision.processId
  ) {
    throw new Error(
      'Governed runtime recovery completion requires one continuous recovery identity chain.',
    )
  }

  if (
    restartExecution.deploymentApplied !== false ||
    restartExecution.runtimeAuthorityGranted !== false ||
    restartExecution.networkAuthorityGranted !== false ||
    identityRebinding.deploymentApplied !== false ||
    identityRebinding.runtimeAuthorityGranted !== false ||
    identityRebinding.networkAuthorityGranted !== false ||
    livenessDecision.restartAuthorized !== false ||
    livenessDecision.deploymentApplied !== false ||
    livenessDecision.runtimeAuthorityGranted !== false ||
    livenessDecision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime recovery completion requires zero inherited extended authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-recovery-completion',

    instanceId: restartExecution.instanceId,
    releaseIdentity: restartExecution.releaseIdentity,
    restartAuthorizationRecordId:
      restartExecution.restartAuthorizationRecordId,

    previousProcessId: restartExecution.previousProcessId,
    processId: restartExecution.newProcessId,

    restartExecutionVerified: true,
    processIdentityRebindingVerified: true,
    readinessRestored: true,
    livenessRestored: true,

    recoveryCompleted: true,
    operationalHealthRestored: true,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
