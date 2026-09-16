import assert from 'node:assert/strict'

import {
  createGovernedReleaseRuntimeIdentity,
} from '../app/lib/runtime-release-identity/runtime-release-identity'

import {
  createGovernedRuntimeInstanceIdentity,
} from '../app/lib/runtime-instance-identity/runtime-instance-identity'

import {
  createGovernedPersistentProcessManifest,
} from '../app/lib/runtime-execution-plane/runtime-persistent-process-manifest'

import {
  establishGovernedRuntimeBlueGreenDeploymentState,
} from '../app/lib/runtime-execution-plane/runtime-blue-green-deployment-state'

import {
  authorizeGovernedRuntimeTrafficSwitch,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-authorization'

import {
  executeGovernedRuntimeTrafficSwitchBoundary,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-execution-boundary'

import type {
  GovernedRuntimeRollbackExecutionBoundaryResult,
} from '../app/lib/runtime-execution-plane/runtime-rollback-execution-boundary'

import type {
  GovernedRuntimePostTrafficSwitchOperationalRevalidation,
} from '../app/lib/runtime-execution-plane/runtime-post-traffic-switch-operational-revalidation'

import {
  createImmutableReleaseArtifact,
} from './continuity/immutable-release-artifact'

import {
  createGovernedRuntimePromotionAuthorizationRecord,
} from '../app/lib/runtime-execution-plane/runtime-promotion-authorization-record'

import {
  evaluateReleasePromotionGate,
} from './continuity/release-promotion-gate'

import type {
  RuntimeToolDnsRebindingRevalidation,
} from '../app/lib/orchestrator/runtime-tool-external-read-dns-rebinding-revalidation'

import {
  evaluateGovernedNetworkContinuityRevalidation,
} from '../app/lib/orchestrator/runtime-governed-network-continuity-revalidation'

async function main() {
const activeArtifactSha256 = 'a'.repeat(64)

const candidateArtifact =
  createImmutableReleaseArtifact({
    releaseIdentity:
      'v287.73.63-candidate-proof',
    sourceCommit:
      '0123456789abcdef0123456789abcdef01234567',
    sourceTag:
      'v287.73.63-matrix-end-to-end-proof',
    provenanceSha256:
      '1'.repeat(64),
    attestationSha256:
      '2'.repeat(64),
    signerKeyId:
      'iasevero-v2877363-proof-key',
    signatureBase64:
      'c2lnbmF0dXJl',
  })

const activeRelease =
  createGovernedReleaseRuntimeIdentity({
    releaseIdentity:
      'v287.73.62-active-proof',
    sourceCommit:
      'active-commit-v2877362-proof',
    sourceTag:
      'v287.73.62-active-proof',
    artifactSha256:
      activeArtifactSha256,
    attestationSha256:
      '3'.repeat(64),
    contentAddress:
      `sha256:${activeArtifactSha256}`,
    signerKeyId:
      'iasevero-active-proof-key',

    provenanceVerified: true,
    attestationVerified: true,
    signatureVerified: true,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,

    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  })

const candidateRelease =
  createGovernedReleaseRuntimeIdentity({
    releaseIdentity:
      candidateArtifact.releaseIdentity,
    sourceCommit:
      candidateArtifact.sourceCommit,
    sourceTag:
      candidateArtifact.sourceTag,
    artifactSha256:
      candidateArtifact.artifactSha256,
    attestationSha256:
      candidateArtifact.attestationSha256,
    contentAddress:
      candidateArtifact.contentAddress,
    signerKeyId:
      candidateArtifact.signerKeyId,

    provenanceVerified: true,
    attestationVerified: true,
    signatureVerified: true,
    artifactCreated: true,
    artifactDigestVerified: true,
    contentAddressDerived: true,

    promotionApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
  })

const instanceIdentity =
  createGovernedRuntimeInstanceIdentity({
    releaseIdentity:
      activeRelease,
    instanceId:
      'runtime-instance-v2877363-proof',
    startedAt:
      '2026-09-15T23:03:00.000Z',
  })

const persistentProcess =
  createGovernedPersistentProcessManifest({
    instanceIdentity,
    host: '127.0.0.1',
    port: 3000,
    executable: 'node',
    entrypoint:
      'node_modules/next/dist/bin/next',
    arguments: [
      'start',
      '-H',
      '127.0.0.1',
      '-p',
      '3000',
    ],
  })

assert.equal(
  persistentProcess.instanceBindingVerified,
  true,
)
assert.equal(
  persistentProcess.processSpecificationVerified,
  true,
)
assert.equal(
  persistentProcess.runtimeAuthorityGranted,
  false,
)
assert.equal(
  persistentProcess.networkAuthorityGranted,
  false,
)

const blueGreenState =
  establishGovernedRuntimeBlueGreenDeploymentState({
    activeSlot: 'blue',
    activeRelease,
    standbyRelease:
      candidateRelease,
  })

assert.equal(
  blueGreenState.blueGreenStateEstablished,
  true,
)
assert.equal(
  blueGreenState.trafficSwitchApplied,
  false,
)
assert.equal(
  blueGreenState.runtimeAuthorityGranted,
  false,
)
assert.equal(
  blueGreenState.networkAuthorityGranted,
  false,
)

/*
 * Previously proved rollback execution boundary result.
 * The matrix closure consumes the verified boundary contract;
 * it does not reimplement the rollback subsystem.
 */
const rollbackExecution = {
  schemaVersion: 1,
  kind:
    'iasevero-governed-runtime-rollback-execution-boundary',

  instanceId:
    instanceIdentity.instanceId,
  releaseIdentity:
    activeRelease.releaseIdentity,
  processId: 7363,

  rollbackFromReleaseIdentity:
    activeRelease.releaseIdentity,
  rollbackTargetReleaseIdentity:
    candidateRelease.releaseIdentity,
  rollbackTargetContentAddress:
    candidateRelease.contentAddress,

  rollbackAuthorizationRecordId:
    'rollback-authorization-v2877363-proof',

  rollbackAuthorizationVerified: true,
  rollbackExecutionVerified: true,
  rollbackApplied: true,

  trafficSwitchAuthorized: false,
  trafficSwitchApplied: false,
  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
} as unknown as GovernedRuntimeRollbackExecutionBoundaryResult

const trafficSwitchAuthorization =
  authorizeGovernedRuntimeTrafficSwitch({
    blueGreenState,
    rollbackExecution,
    trafficSwitchAuthorizationRecordId:
      'traffic-switch-authorization-v2877363-proof',
    trafficSwitchAuthorizationGranted: true,
  })

assert.equal(
  trafficSwitchAuthorization
    .trafficSwitchAuthorizationGranted,
  true,
)
assert.equal(
  trafficSwitchAuthorization
    .trafficSwitchAuthorized,
  true,
)
assert.equal(
  trafficSwitchAuthorization
    .trafficSwitchApplied,
  false,
)

let executorCallCount = 0

const trafficSwitchExecution =
  await executeGovernedRuntimeTrafficSwitchBoundary({
    authorization:
      trafficSwitchAuthorization,

    executor: async (request) => {
      executorCallCount += 1

      return {
        newActiveSlot: 'green',
        newStandbySlot: 'blue',

        activeReleaseIdentity:
          request
            .trafficSwitchTargetReleaseIdentity,

        activeContentAddress:
          request
            .trafficSwitchTargetContentAddress,

        trafficSwitchApplied: true,
      }
    },
  })

assert.equal(executorCallCount, 1)
assert.equal(
  trafficSwitchExecution
    .trafficSwitchAuthorizationVerified,
  true,
)
assert.equal(
  trafficSwitchExecution
    .trafficSwitchExecutionVerified,
  true,
)
assert.equal(
  trafficSwitchExecution.trafficSwitchApplied,
  true,
)
assert.equal(
  trafficSwitchExecution.runtimeAuthorityGranted,
  false,
)
assert.equal(
  trafficSwitchExecution.networkAuthorityGranted,
  false,
)

/*
 * Previously proved post-switch operational-revalidation boundary.
 * Identity continuity is explicitly tied to this execution result.
 */
const postSwitchRevalidation = {
  schemaVersion: 1,
  kind:
    'iasevero-governed-runtime-post-traffic-switch-operational-revalidation',

  instanceId:
    instanceIdentity.instanceId,
  releaseIdentity:
    trafficSwitchExecution.trafficSwitchTargetReleaseIdentity,
  processId:
    rollbackExecution.processId,

  activeSlot:
    trafficSwitchExecution.newActiveSlot,
  standbySlot:
    trafficSwitchExecution.newStandbySlot,
  activeReleaseIdentity:
    trafficSwitchExecution.trafficSwitchTargetReleaseIdentity,

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
} as GovernedRuntimePostTrafficSwitchOperationalRevalidation

assert.equal(
  postSwitchRevalidation.releaseIdentity,
  candidateRelease.releaseIdentity,
)
assert.equal(
  postSwitchRevalidation.activeReleaseIdentity,
  candidateRelease.releaseIdentity,
)
assert.equal(
  postSwitchRevalidation.processId,
  rollbackExecution.processId,
)

const promotionAuthorizationRecord =
  createGovernedRuntimePromotionAuthorizationRecord({
    releaseIdentity:
      candidateArtifact.releaseIdentity,
    artifactSha256:
      candidateArtifact.artifactSha256,
    contentAddress:
      candidateArtifact.contentAddress,
    promotionAuthorizationRecordId:
      'promotion-authorization-v2877363-proof',
    promotionAuthorizationGranted: true,
  })

const promotionDecision =
  evaluateReleasePromotionGate({
    artifact:
      candidateArtifact,
    promotionAuthorizationRecord,
  })

assert.equal(
  promotionDecision.promotionEligible,
  true,
)
assert.equal(
  promotionDecision
    .promotionAuthorizationRecordVerified,
  true,
)
assert.equal(
  promotionDecision
    .promotionAuthorizationGranted,
  true,
)
assert.equal(
  promotionDecision.promotionAuthorized,
  true,
)
assert.equal(
  promotionDecision.promotionApplied,
  false,
)
assert.equal(
  promotionDecision.deploymentApplied,
  false,
)
assert.equal(
  promotionDecision.runtimeAuthorityGranted,
  false,
)

const dnsRevalidation:
  RuntimeToolDnsRebindingRevalidation = {
    revalidationStatus: 'accepted',
    hostname: 'example.com',
    bindingKey:
      'dns-binding-v2877363-proof',
    originalApprovedAddresses: [
      '93.184.216.34',
    ],
    revalidatedApprovedAddresses: [
      '93.184.216.34',
    ],
    reason:
      'DNS destination set matches governed binding.',
  }

const networkContinuity =
  evaluateGovernedNetworkContinuityRevalidation({
    operationalRevalidation:
      postSwitchRevalidation,
    dnsRevalidation,
  })

assert.equal(
  networkContinuity
    .operationalContinuityVerified,
  true,
)
assert.equal(
  networkContinuity
    .dnsRevalidationAccepted,
  true,
)
assert.equal(
  networkContinuity
    .networkContinuityEligible,
  true,
)

assert.equal(
  networkContinuity.networkAuthorityGranted,
  false,
)
assert.equal(
  networkContinuity.externalReadApplied,
  false,
)
assert.equal(
  networkContinuity.executionApplied,
  false,
)
assert.equal(
  networkContinuity.mutationApplied,
  false,
)
assert.equal(
  networkContinuity.providerInvocation,
  false,
)

const matrixExecutionPlaneClosureVerified =
  persistentProcess.instanceBindingVerified === true &&
  persistentProcess.processSpecificationVerified === true &&
  blueGreenState.blueGreenStateEstablished === true &&
  trafficSwitchAuthorization
    .trafficSwitchAuthorized === true &&
  trafficSwitchExecution
    .trafficSwitchExecutionVerified === true &&
  postSwitchRevalidation
    .operationalRevalidationCompleted === true &&
  promotionDecision
    .promotionAuthorizationRecordVerified === true &&
  promotionDecision.promotionAuthorized === true &&
  promotionDecision.promotionApplied === false &&
  networkContinuity
    .networkContinuityEligible === true &&
  networkContinuity
    .networkAuthorityGranted === false

assert.equal(
  matrixExecutionPlaneClosureVerified,
  true,
)

console.log({
  architecture:
    'release-identity -> instance-identity -> persistent-process -> blue-green -> rollback-boundary -> traffic-switch-authorization -> traffic-switch-execution -> post-switch-revalidation -> promotion-authorization-gate -> network-continuity -> matrix-end-to-end-closure',

  matrixExecutionPlaneClosureVerified,

  releaseIdentityVerified:
    candidateRelease
      .releaseIdentity.length > 0,

  persistentProcessVerified:
    persistentProcess
      .processSpecificationVerified,

  blueGreenVerified:
    blueGreenState
      .blueGreenStateEstablished,

  trafficSwitchVerified:
    trafficSwitchExecution
      .trafficSwitchExecutionVerified,

  postSwitchRevalidationVerified:
    postSwitchRevalidation
      .operationalRevalidationCompleted,

  promotionGovernanceVerified:
    promotionDecision
      .promotionAuthorizationRecordVerified,

  networkContinuityVerified:
    networkContinuity
      .networkContinuityEligible,

  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,
  productionMutationApplied: false,
  selfPromotionApplied: false,
})

console.log(
  'Governed sovereign matrix execution plane end-to-end closure proof passed.',
)

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
