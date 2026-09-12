import {
  rebindGovernedRuntimeProcessIdentity,
} from './runtime-process-identity-binding'

import type {
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult,
} from './runtime-multi-source-restart-execution-integration'

type GovernedRuntimeCanonicalProcessIdentityRebindingResult =
  ReturnType<typeof rebindGovernedRuntimeProcessIdentity>

export type GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult =
  GovernedRuntimeCanonicalProcessIdentityRebindingResult & {
    multiSourceRestartExecutionVerified: true
    multiSourceAuthorizationVerified: true
    authorizationAdapterVerified: true

    sourceLivenessAuthorizationRecordId: string
  }

export function rebindGovernedRuntimeMultiSourceProcessIdentity(
  restartExecution:
    GovernedRuntimeMultiSourceRestartExecutionIntegrationResult,
): GovernedRuntimeMultiSourceProcessIdentityRebindingIntegrationResult {
  if (
    restartExecution.multiSourceAuthorizationVerified !== true ||
    restartExecution.authorizationAdapterVerified !== true ||
    restartExecution.restartAuthorizationVerified !== true ||
    restartExecution.restartApplied !== true ||
    restartExecution.processIdentityRebindingRequired !== true
  ) {
    throw new Error(
      'Governed multi-source process identity rebinding integration requires verified restart execution.',
    )
  }

  if (
    restartExecution.readinessGranted !== false ||
    restartExecution.livenessGranted !== false ||
    restartExecution.deploymentApplied !== false ||
    restartExecution.runtimeAuthorityGranted !== false ||
    restartExecution.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source process identity rebinding integration requires mandatory pre-rebinding health isolation.',
    )
  }

  const rebound =
    rebindGovernedRuntimeProcessIdentity(
      restartExecution,
    )

  if (
    rebound.restartExecutionVerified !== true ||
    rebound.previousProcessIdVerified !== true ||
    rebound.replacementProcessIdVerified !== true ||
    rebound.processIdentityRebound !== true ||
    rebound.previousProcessId !==
      restartExecution.previousProcessId ||
    rebound.processId !==
      restartExecution.newProcessId
  ) {
    throw new Error(
      'Governed multi-source process identity rebinding integration requires verified canonical identity rebinding.',
    )
  }

  if (
    rebound.readinessGranted !== false ||
    rebound.livenessGranted !== false ||
    rebound.deploymentApplied !== false ||
    rebound.runtimeAuthorityGranted !== false ||
    rebound.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source process identity rebinding integration requires mandatory post-rebinding health revalidation.',
    )
  }

  return {
    ...rebound,

    multiSourceRestartExecutionVerified: true,
    multiSourceAuthorizationVerified: true,
    authorizationAdapterVerified: true,

    sourceLivenessAuthorizationRecordId:
      restartExecution.sourceLivenessAuthorizationRecordId,
  }
}
