import {
  executeGovernedRuntimeRestart,
} from './runtime-restart-execution-boundary'

import {
  adaptGovernedRuntimeMultiSourceRestartAuthorization,
} from './runtime-multi-source-restart-authorization-adapter'

import type {
  GovernedRuntimeMultiSourceRestartAuthorization,
} from './runtime-multi-source-restart-authorization'

type GovernedRuntimeCanonicalRestartExecutor =
  Parameters<typeof executeGovernedRuntimeRestart>[1]

type GovernedRuntimeCanonicalRestartExecutionResult =
  Awaited<ReturnType<typeof executeGovernedRuntimeRestart>>

export type GovernedRuntimeMultiSourceRestartExecutionIntegrationInput = {
  authorization: GovernedRuntimeMultiSourceRestartAuthorization
  executor: GovernedRuntimeCanonicalRestartExecutor
}

export type GovernedRuntimeMultiSourceRestartExecutionIntegrationResult =
  GovernedRuntimeCanonicalRestartExecutionResult & {
    multiSourceAuthorizationVerified: true
    authorizationAdapterVerified: true

    sourceKind:
      'iasevero-governed-runtime-multi-source-restart-authorization'

    sourceLivenessAuthorizationRecordId: string
  }

export async function executeGovernedRuntimeMultiSourceRestartIntegration(
  input: GovernedRuntimeMultiSourceRestartExecutionIntegrationInput,
): Promise<GovernedRuntimeMultiSourceRestartExecutionIntegrationResult> {
  const adapted =
    adaptGovernedRuntimeMultiSourceRestartAuthorization(
      input.authorization,
    )

  if (
    adapted.adapterVerified !== true ||
    adapted.recoveryDecisionVerified !== true ||
    adapted.restartEligible !== true ||
    adapted.restartAuthorizationGranted !== true ||
    adapted.restartAuthorized !== true
  ) {
    throw new Error(
      'Governed multi-source restart execution integration requires authorized canonical restart contract.',
    )
  }

  if (
    adapted.restartApplied !== false ||
    adapted.deploymentApplied !== false ||
    adapted.runtimeAuthorityGranted !== false ||
    adapted.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source restart execution integration requires zero inherited execution effect.',
    )
  }

  const result =
    await executeGovernedRuntimeRestart(
      adapted,
      input.executor,
    )

  if (
    result.restartAuthorizationVerified !== true ||
    result.restartApplied !== true ||
    result.previousProcessId !== adapted.processId ||
    result.restartAuthorizationRecordId !==
      adapted.restartAuthorizationRecordId
  ) {
    throw new Error(
      'Governed multi-source restart execution integration requires verified canonical restart execution.',
    )
  }

  if (
    result.processIdentityRebindingRequired !== true ||
    result.readinessGranted !== false ||
    result.livenessGranted !== false ||
    result.deploymentApplied !== false ||
    result.runtimeAuthorityGranted !== false ||
    result.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed multi-source restart execution integration requires mandatory post-restart revalidation.',
    )
  }

  return {
    ...result,

    multiSourceAuthorizationVerified: true,
    authorizationAdapterVerified: true,

    sourceKind:
      'iasevero-governed-runtime-multi-source-restart-authorization',

    sourceLivenessAuthorizationRecordId:
      adapted.sourceLivenessAuthorizationRecordId,
  }
}
