import {
  completeGovernedRuntimeRecovery,
} from './runtime-recovery-completion'

import type {
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult,
} from './runtime-multi-source-restart-execution-integration'

import type {
  GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult,
} from './runtime-multi-source-process-identity-rebinding-integration'

import type {
  GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationResult,
} from './runtime-multi-source-post-readiness-liveness-revalidation-integration'

type GovernedRuntimeCanonicalRecoveryCompletion =
  ReturnType<typeof completeGovernedRuntimeRecovery>

export type GovernedRuntimeMultiSourceRecoveryCompletionIntegrationInput = {
  restartExecution:
    GovernedRuntimeMultiSourceRestartExecutionIntegrationResult

  identityRebinding:
    GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult

  livenessDecision:
    GovernedRuntimeMultiSourcePostReadinessLivenessRevalidationResult
}

export type GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult =
  GovernedRuntimeCanonicalRecoveryCompletion & {
    multiSourceRecoveryChainVerified: true
    multiSourceRestartExecutionVerified: true
    multiSourceIdentityRebindingVerified: true
    multiSourceLivenessRevalidationVerified: true

    sourceLivenessAuthorizationRecordId: string
  }

export function completeGovernedRuntimeMultiSourceRecovery(
  input: GovernedRuntimeMultiSourceRecoveryCompletionIntegrationInput,
): GovernedRuntimeMultiSourceRecoveryCompletionIntegrationResult {
  const {
    restartExecution,
    identityRebinding,
    livenessDecision,
  } = input

  if (
    restartExecution.multiSourceAuthorizationVerified !== true ||
    restartExecution.authorizationAdapterVerified !== true ||
    restartExecution.restartAuthorizationVerified !== true ||
    restartExecution.restartApplied !== true ||
    identityRebinding.multiSourceRestartExecutionVerified !== true ||
    identityRebinding.processIdentityRebound !== true ||
    livenessDecision.multiSourceReadinessRevalidationVerified !== true ||
    livenessDecision.canonicalLivenessEvidenceVerified !== true ||
    livenessDecision.canonicalLivenessAssessmentVerified !== true ||
    livenessDecision.canonicalLivenessDecisionVerified !== true ||
    livenessDecision.readinessGranted !== true ||
    livenessDecision.livenessGranted !== true
  ) {
    throw new Error(
      'Governed multi-source recovery completion requires verified recovery chain.',
    )
  }

  if (
    restartExecution.sourceLivenessAuthorizationRecordId !==
      identityRebinding.sourceLivenessAuthorizationRecordId ||
    restartExecution.sourceLivenessAuthorizationRecordId !==
      livenessDecision.sourceLivenessAuthorizationRecordId
  ) {
    throw new Error(
      'Governed multi-source recovery completion requires continuous source provenance.',
    )
  }

  if (
    restartExecution.newProcessId !== identityRebinding.processId ||
    identityRebinding.processId !== livenessDecision.processId ||
    restartExecution.previousProcessId !==
      identityRebinding.previousProcessId
  ) {
    throw new Error(
      'Governed multi-source recovery completion requires one continuous runtime identity chain.',
    )
  }

  if (
    restartExecution.runtimeAuthorityGranted !== false ||
    restartExecution.networkAuthorityGranted !== false ||
    identityRebinding.runtimeAuthorityGranted !== false ||
    identityRebinding.networkAuthorityGranted !== false ||
    livenessDecision.runtimeAuthorityGranted !== false ||
    livenessDecision.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source recovery completion requires zero inherited runtime authority.',
    )
  }

  const completion =
    completeGovernedRuntimeRecovery({
      restartExecution,
      identityRebinding,
      livenessDecision,
    })

  if (
    completion.restartExecutionVerified !== true ||
    completion.processIdentityRebindingVerified !== true ||
    completion.readinessRestored !== true ||
    completion.livenessRestored !== true ||
    completion.recoveryCompleted !== true ||
    completion.operationalHealthRestored !== true
  ) {
    throw new Error(
      'Governed multi-source recovery completion requires verified canonical recovery completion.',
    )
  }

  if (
    completion.deploymentApplied !== false ||
    completion.runtimeAuthorityGranted !== false ||
    completion.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source recovery completion must not grant operational authority.',
    )
  }

  return {
    ...completion,

    multiSourceRecoveryChainVerified: true,
    multiSourceRestartExecutionVerified: true,
    multiSourceIdentityRebindingVerified: true,
    multiSourceLivenessRevalidationVerified: true,

    sourceLivenessAuthorizationRecordId:
      restartExecution.sourceLivenessAuthorizationRecordId,
  }
}
