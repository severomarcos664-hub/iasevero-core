import type {
  GovernedRuntimePostTrafficSwitchBlueGreenState,
} from './runtime-post-traffic-switch-blue-green-state'

import {
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness,
} from './runtime-multi-source-post-readiness-liveness-revalidation-integration'

type CanonicalOperationalRevalidation =
  ReturnType<
    typeof revalidateGovernedRuntimeMultiSourcePostReadinessLiveness
  >

export type GovernedRuntimePostTrafficSwitchOperationalRevalidationInput = {
  postTrafficSwitchState: GovernedRuntimePostTrafficSwitchBlueGreenState
  operationalRevalidation: CanonicalOperationalRevalidation
}

export type GovernedRuntimePostTrafficSwitchOperationalRevalidation = {
  schemaVersion: 1
  kind: 'iasevero-governed-runtime-post-traffic-switch-operational-revalidation'

  instanceId: string
  releaseIdentity: string
  processId: number

  activeSlot: 'blue' | 'green'
  standbySlot: 'blue' | 'green'
  activeReleaseIdentity: string

  postTrafficSwitchStateVerified: true
  activeReleaseContinuityVerified: true
  processContinuityVerified: true

  readinessRevalidationVerified: true
  livenessRevalidationVerified: true

  readinessGranted: true
  livenessGranted: true

  operationalRevalidationCompleted: true
  operationalHealthRestored: true

  trafficSwitchApplied: true

  restartAuthorized: false
  deploymentApplied: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function completeGovernedRuntimePostTrafficSwitchOperationalRevalidation(
  input: GovernedRuntimePostTrafficSwitchOperationalRevalidationInput,
): GovernedRuntimePostTrafficSwitchOperationalRevalidation {
  const {
    postTrafficSwitchState,
    operationalRevalidation,
  } = input

  if (
    postTrafficSwitchState.previousBlueGreenStateVerified !== true ||
    postTrafficSwitchState.trafficSwitchExecutionVerified !== true ||
    postTrafficSwitchState.postTrafficSwitchStateReconciled !== true ||
    postTrafficSwitchState.trafficSwitchApplied !== true
  ) {
    throw new Error(
      'Governed runtime post traffic switch operational revalidation requires reconciled post-switch state.',
    )
  }

  if (
    postTrafficSwitchState.deploymentApplied !== false ||
    postTrafficSwitchState.runtimeAuthorityGranted !== false ||
    postTrafficSwitchState.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime post traffic switch operational revalidation requires zero inherited post-switch authority.',
    )
  }

  if (
    operationalRevalidation.multiSourceReadinessRevalidationVerified !== true ||
    operationalRevalidation.canonicalLivenessEvidenceVerified !== true ||
    operationalRevalidation.canonicalLivenessAssessmentVerified !== true ||
    operationalRevalidation.canonicalLivenessDecisionVerified !== true ||
    operationalRevalidation.readinessGranted !== true ||
    operationalRevalidation.livenessGranted !== true
  ) {
    throw new Error(
      'Governed runtime post traffic switch operational revalidation requires verified canonical readiness and liveness.',
    )
  }

  if (
    operationalRevalidation.restartAuthorized !== false ||
    operationalRevalidation.deploymentApplied !== false ||
    operationalRevalidation.runtimeAuthorityGranted !== false ||
    operationalRevalidation.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed runtime post traffic switch operational revalidation requires zero inherited operational authority.',
    )
  }

  if (
    postTrafficSwitchState.instanceId !==
      operationalRevalidation.instanceId ||
    postTrafficSwitchState.processId !==
      operationalRevalidation.processId ||
    postTrafficSwitchState.activeReleaseIdentity !==
      operationalRevalidation.releaseIdentity
  ) {
    throw new Error(
      'Governed runtime post traffic switch operational revalidation requires continuous active runtime identity.',
    )
  }

  return {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-post-traffic-switch-operational-revalidation',

    instanceId:
      operationalRevalidation.instanceId,

    releaseIdentity:
      operationalRevalidation.releaseIdentity,

    processId:
      operationalRevalidation.processId,

    activeSlot:
      postTrafficSwitchState.activeSlot,

    standbySlot:
      postTrafficSwitchState.standbySlot,

    activeReleaseIdentity:
      postTrafficSwitchState.activeReleaseIdentity,

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
}
