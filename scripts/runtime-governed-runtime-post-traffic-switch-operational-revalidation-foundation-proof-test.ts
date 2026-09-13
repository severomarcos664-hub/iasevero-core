import assert from 'node:assert/strict'

import type {
  GovernedRuntimePostTrafficSwitchBlueGreenState,
} from '../app/lib/runtime-execution-plane/runtime-post-traffic-switch-blue-green-state'

import {
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-readiness-liveness-revalidation-integration'

import {
  completeGovernedRuntimePostTrafficSwitchOperationalRevalidation,
} from '../app/lib/runtime-execution-plane/runtime-post-traffic-switch-operational-revalidation'

type CanonicalOperationalRevalidation =
  ReturnType<
    typeof revalidateGovernedRuntimeMultiSourcePostReadinessLiveness
  >

const instanceId = 'instance-v2877351-proof'
const processId = 626262

const previousActiveReleaseIdentity =
  'v287.73.50-previous-active-proof'

const newActiveReleaseIdentity =
  'v287.73.51-active-proof'

const postTrafficSwitchState:
  GovernedRuntimePostTrafficSwitchBlueGreenState = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-post-traffic-switch-blue-green-state',

    instanceId,
    releaseIdentity:
      previousActiveReleaseIdentity,
    processId,

    previousActiveSlot: 'blue',
    previousStandbySlot: 'green',

    activeSlot: 'green',
    standbySlot: 'blue',

    activeReleaseIdentity:
      newActiveReleaseIdentity,

    standbyReleaseIdentity:
      previousActiveReleaseIdentity,

    activeContentAddress:
      `sha256:${'b'.repeat(64)}`,

    standbyContentAddress:
      `sha256:${'a'.repeat(64)}`,

    trafficSwitchExecutionVerified: true,
    previousBlueGreenStateVerified: true,
    postTrafficSwitchStateReconciled: true,

    trafficSwitchAuthorized: true,
    trafficSwitchApplied: true,

    rollbackAuthorized: false,
    rollbackApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

const operationalRevalidation = {
  schemaVersion: 1,
  kind:
    'iasevero-governed-runtime-liveness-decision',

  instanceId,
  releaseIdentity:
    newActiveReleaseIdentity,

  authorizationRecordId:
    'readiness-authorization-v2877351-proof',

  processId,

  livenessAssessmentVerified: true,
  livenessDecisionMade: true,

  readinessGranted: true,
  livenessGranted: true,

  restartAuthorized: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceReadinessRevalidationVerified: true,
  canonicalLivenessEvidenceVerified: true,
  canonicalLivenessAssessmentVerified: true,
  canonicalLivenessDecisionVerified: true,

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877351-proof',
} as CanonicalOperationalRevalidation

const completed =
  completeGovernedRuntimePostTrafficSwitchOperationalRevalidation({
    postTrafficSwitchState,
    operationalRevalidation,
  })

assert.equal(
  completed.instanceId,
  instanceId,
)

assert.equal(
  completed.releaseIdentity,
  newActiveReleaseIdentity,
)

assert.equal(
  completed.processId,
  processId,
)

assert.equal(completed.activeSlot, 'green')
assert.equal(completed.standbySlot, 'blue')

assert.equal(
  completed.activeReleaseIdentity,
  newActiveReleaseIdentity,
)

assert.equal(
  completed.postTrafficSwitchStateVerified,
  true,
)

assert.equal(
  completed.activeReleaseContinuityVerified,
  true,
)

assert.equal(
  completed.processContinuityVerified,
  true,
)

assert.equal(
  completed.readinessRevalidationVerified,
  true,
)

assert.equal(
  completed.livenessRevalidationVerified,
  true,
)

assert.equal(completed.readinessGranted, true)
assert.equal(completed.livenessGranted, true)

assert.equal(
  completed.operationalRevalidationCompleted,
  true,
)

assert.equal(
  completed.operationalHealthRestored,
  true,
)

assert.equal(completed.trafficSwitchApplied, true)

assert.equal(completed.restartAuthorized, false)
assert.equal(completed.deploymentApplied, false)
assert.equal(completed.runtimeAuthorityGranted, false)
assert.equal(completed.networkAuthorityGranted, false)

assert.throws(
  () =>
    completeGovernedRuntimePostTrafficSwitchOperationalRevalidation({
      postTrafficSwitchState,
      operationalRevalidation: {
        ...operationalRevalidation,
        releaseIdentity:
          'wrong-active-release',
      },
    }),
  /requires continuous active runtime identity/,
)

assert.throws(
  () =>
    completeGovernedRuntimePostTrafficSwitchOperationalRevalidation({
      postTrafficSwitchState,
      operationalRevalidation: {
        ...operationalRevalidation,
        processId: processId + 1,
      },
    }),
  /requires continuous active runtime identity/,
)

assert.throws(
  () =>
    completeGovernedRuntimePostTrafficSwitchOperationalRevalidation({
      postTrafficSwitchState,
      operationalRevalidation: {
        ...operationalRevalidation,
        runtimeAuthorityGranted: true,
      } as unknown as CanonicalOperationalRevalidation,
    }),
  /requires zero inherited operational authority/,
)

console.log({
  architecture:
    'post-switch-reconciled-state + canonical-readiness-liveness-revalidation -> active-runtime-continuity -> operational-health-restored -> no-authority-escalation',

  instanceId:
    completed.instanceId,

  processId:
    completed.processId,

  activeSlot:
    completed.activeSlot,

  standbySlot:
    completed.standbySlot,

  activeReleaseIdentity:
    completed.activeReleaseIdentity,

  postTrafficSwitchStateVerified:
    completed.postTrafficSwitchStateVerified,

  activeReleaseContinuityVerified:
    completed.activeReleaseContinuityVerified,

  processContinuityVerified:
    completed.processContinuityVerified,

  readinessGranted:
    completed.readinessGranted,

  livenessGranted:
    completed.livenessGranted,

  operationalRevalidationCompleted:
    completed.operationalRevalidationCompleted,

  operationalHealthRestored:
    completed.operationalHealthRestored,

  deploymentApplied:
    completed.deploymentApplied,

  runtimeAuthorityGranted:
    completed.runtimeAuthorityGranted,

  networkAuthorityGranted:
    completed.networkAuthorityGranted,
})

console.log(
  'Runtime governed runtime post traffic switch operational revalidation foundation proof passed.',
)
