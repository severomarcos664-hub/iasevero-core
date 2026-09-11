import type {
  GovernedPersistentRuntimeLaunchBoundary,
} from './runtime-persistent-launch-boundary'

import type {
  GovernedRuntimeProcessIdentityRebinding,
} from './runtime-process-identity-binding'

export type GovernedRuntimeReadinessCandidateSource =
  | 'initial-launch'
  | 'post-restart-rebinding'

export type GovernedRuntimeReadinessCandidate = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-readiness-candidate'

  source: GovernedRuntimeReadinessCandidateSource

  instanceId: string
  releaseIdentity: string
  authorityRecordId: string
  processId: number

  processIdentityVerified: true
  readinessEvaluationEligible: true

  readinessGranted: false
  livenessGranted: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createInitialRuntimeReadinessCandidate(
  boundary: GovernedPersistentRuntimeLaunchBoundary,
): GovernedRuntimeReadinessCandidate {
  if (
    boundary.processIdentityVerified !== true ||
    boundary.persistentLaunchEligible !== true ||
    boundary.persistentLaunchPrepared !== true ||
    !Number.isSafeInteger(boundary.processId) ||
    boundary.processId <= 0
  ) {
    throw new Error(
      'Governed runtime readiness candidate requires verified initial launch identity.',
    )
  }

  if (
    boundary.readinessGranted !== false ||
    boundary.livenessGranted !== false ||
    boundary.deploymentApplied !== false ||
    boundary.runtimeAuthorityGranted !== false ||
    boundary.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime readiness candidate requires zero inherited runtime authority.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-readiness-candidate',

    source: 'initial-launch',

    instanceId: boundary.instanceId,
    releaseIdentity: boundary.releaseIdentity,
    authorityRecordId: boundary.authorizationRecordId,
    processId: boundary.processId,

    processIdentityVerified: true,
    readinessEvaluationEligible: true,

    readinessGranted: false,
    livenessGranted: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}

export function createPostRestartRuntimeReadinessCandidate(
  rebinding: GovernedRuntimeProcessIdentityRebinding,
): GovernedRuntimeReadinessCandidate {
  if (
    rebinding.restartExecutionVerified !== true ||
    rebinding.previousProcessIdVerified !== true ||
    rebinding.replacementProcessIdVerified !== true ||
    rebinding.processIdentityRebound !== true ||
    !Number.isSafeInteger(rebinding.processId) ||
    rebinding.processId <= 0
  ) {
    throw new Error(
      'Governed runtime readiness candidate requires verified post-restart process identity.',
    )
  }

  if (
    rebinding.readinessGranted !== false ||
    rebinding.livenessGranted !== false ||
    rebinding.deploymentApplied !== false ||
    rebinding.runtimeAuthorityGranted !== false ||
    rebinding.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime readiness candidate requires mandatory post-restart revalidation.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-readiness-candidate',

    source: 'post-restart-rebinding',

    instanceId: rebinding.instanceId,
    releaseIdentity: rebinding.releaseIdentity,
    authorityRecordId: rebinding.restartAuthorizationRecordId,
    processId: rebinding.processId,

    processIdentityVerified: true,
    readinessEvaluationEligible: true,

    readinessGranted: false,
    livenessGranted: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
