import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-execution-integration'

import {
  rebindGovernedRuntimeMultiSourceProcessIdentity,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-process-identity-rebinding-integration'

import {
  revalidateGovernedRuntimeMultiSourcePostRebindReadiness,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-rebind-readiness-revalidation-integration'

import {
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-readiness-liveness-revalidation-integration'

import {
  completeGovernedRuntimeMultiSourceRecovery,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-recovery-completion-integration'

const restartExecution:
  GovernedRuntimeMultiSourceRestartExecutionIntegrationResult = {
  schemaVersion: 1,
  kind: 'iasevero-governed-runtime-restart-execution-result',

  instanceId: 'instance-v2877338-proof',
  releaseIdentity: 'v287.73.38-proof-release',

  restartAuthorizationRecordId:
    'restart-authorization-v2877338-proof',

  previousProcessId: 525252,
  newProcessId: 626262,

  restartAuthorizationVerified: true,
  restartExecutionPrepared: true,
  restartApplied: true,

  processIdentityRebindingRequired: true,
  readinessGranted: false,
  livenessGranted: false,

  deploymentApplied: false,
  runtimeAuthorityGranted: false,
  networkAuthorityGranted: false,

  multiSourceAuthorizationVerified: true,
  authorizationAdapterVerified: true,

  sourceKind:
    'iasevero-governed-runtime-multi-source-restart-authorization',

  sourceLivenessAuthorizationRecordId:
    'liveness-authorization-v2877338-proof',
}

const identityRebinding =
  rebindGovernedRuntimeMultiSourceProcessIdentity(
    restartExecution,
  )

const readiness =
  revalidateGovernedRuntimeMultiSourcePostRebindReadiness({
    rebinding: identityRebinding,

    probe: {
      observedProcessId: 626262,
      observedHost: '127.0.0.1',
      observedPort: 3000,
      transportReachable: true,
      applicationResponsive: true,
    },
  })

const livenessDecision =
  revalidateGovernedRuntimeMultiSourcePostReadinessLiveness({
    readiness,

    observation: {
      observedProcessId: 626262,
      observationSequence: 1,
      processResponsive: true,
      eventLoopResponsive: true,
    },
  })

const completion =
  completeGovernedRuntimeMultiSourceRecovery({
    restartExecution,
    identityRebinding,
    livenessDecision,
  })

assert.equal(
  completion.multiSourceRecoveryChainVerified,
  true,
)

assert.equal(
  completion.multiSourceRestartExecutionVerified,
  true,
)

assert.equal(
  completion.multiSourceIdentityRebindingVerified,
  true,
)

assert.equal(
  completion.multiSourceLivenessRevalidationVerified,
  true,
)

assert.equal(completion.previousProcessId, 525252)
assert.equal(completion.processId, 626262)

assert.equal(
  completion.restartExecutionVerified,
  true,
)

assert.equal(
  completion.processIdentityRebindingVerified,
  true,
)

assert.equal(
  completion.readinessRestored,
  true,
)

assert.equal(
  completion.livenessRestored,
  true,
)

assert.equal(
  completion.recoveryCompleted,
  true,
)

assert.equal(
  completion.operationalHealthRestored,
  true,
)

assert.equal(
  completion.sourceLivenessAuthorizationRecordId,
  restartExecution.sourceLivenessAuthorizationRecordId,
)

assert.equal(completion.deploymentApplied, false)
assert.equal(completion.runtimeAuthorityGranted, false)
assert.equal(completion.networkAuthorityGranted, false)

assert.throws(
  () =>
    completeGovernedRuntimeMultiSourceRecovery({
      restartExecution,
      identityRebinding: {
        ...identityRebinding,
        sourceLivenessAuthorizationRecordId:
          'different-source-provenance',
      },
      livenessDecision,
    }),
  /requires continuous source provenance/,
)

console.log({
  architecture:
    'multi-source-restart-execution + identity-rebinding + liveness-revalidation -> canonical-recovery-completion',

  previousProcessId:
    completion.previousProcessId,

  processId:
    completion.processId,

  multiSourceRecoveryChainVerified:
    completion.multiSourceRecoveryChainVerified,

  restartExecutionVerified:
    completion.restartExecutionVerified,

  processIdentityRebindingVerified:
    completion.processIdentityRebindingVerified,

  readinessRestored:
    completion.readinessRestored,

  livenessRestored:
    completion.livenessRestored,

  recoveryCompleted:
    completion.recoveryCompleted,

  operationalHealthRestored:
    completion.operationalHealthRestored,

  provenancePreserved:
    completion.sourceLivenessAuthorizationRecordId ===
    restartExecution.sourceLivenessAuthorizationRecordId,

  runtimeAuthorityGranted:
    completion.runtimeAuthorityGranted,

  networkAuthorityGranted:
    completion.networkAuthorityGranted,
})

console.log(
  'Runtime governed multi-source recovery completion integration foundation proof passed.',
)
