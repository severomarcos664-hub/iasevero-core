import assert from 'node:assert/strict'

import {
  recordGovernedRuntimeLivenessFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-liveness-failure-evidence'

import {
  recordGovernedRuntimeHeartbeatFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-heartbeat-failure-evidence'

import {
  aggregateGovernedRuntimeFailureEvidence,
} from '../app/lib/runtime-execution-plane/runtime-failure-evidence-aggregator'

import {
  assessGovernedRuntimeMultiSourceFailure,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-failure-assessment'

import {
  decideGovernedRuntimeMultiSourceRecovery,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-recovery-decision'

import {
  authorizeGovernedRuntimeMultiSourceRestart,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-authorization'

import {
  executeGovernedRuntimeMultiSourceRestartIntegration,
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

import {
  recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-post-recovery-heartbeat-continuity-integration'

async function main() {
  const livenessDecision =
    {
      schemaVersion: 1,
      kind: 'iasevero-governed-runtime-liveness-decision',

      instanceId: 'instance-v2877340-proof',
      releaseIdentity: 'v287.73.40-proof-release',
      authorizationRecordId: 'liveness-authorization-v2877340-proof',
      processId: 525252,

      livenessAssessmentVerified: true,
      livenessDecisionMade: true,
      readinessGranted: true,
      livenessGranted: false,

      restartAuthorized: false,
      deploymentApplied: false,
      runtimeAuthorityGranted: false,
      networkAuthorityGranted: false,
    } satisfies Parameters<
      typeof recordGovernedRuntimeLivenessFailureEvidence
    >[0]

  const heartbeatHealth =
    {
      schemaVersion: 1,
      kind: 'iasevero-governed-runtime-heartbeat-health-assessment',

      instanceId: 'instance-v2877340-proof',
      releaseIdentity: 'v287.73.40-proof-release',
      processId: 525252,

      heartbeatFreshnessVerified: true,
      healthAssessmentCompleted: true,
      heartbeatHealth: 'degraded',

      failureDecisionMade: false,
      recoveryDecisionMade: false,

      restartAuthorized: false,
      restartApplied: false,
      deploymentApplied: false,
      runtimeAuthorityGranted: false,
      networkAuthorityGranted: false,
    } satisfies Parameters<
      typeof recordGovernedRuntimeHeartbeatFailureEvidence
    >[0]

  const livenessEvidence =
    recordGovernedRuntimeLivenessFailureEvidence(
      livenessDecision,
    )

  const heartbeatEvidence =
    recordGovernedRuntimeHeartbeatFailureEvidence(
      heartbeatHealth,
    )

  const aggregation =
    aggregateGovernedRuntimeFailureEvidence({
      livenessEvidence,
      heartbeatEvidence,
    })

  const failureAssessment =
    assessGovernedRuntimeMultiSourceFailure(
      aggregation,
    )

  const recoveryDecision =
    decideGovernedRuntimeMultiSourceRecovery(
      failureAssessment,
    )

  const restartAuthorization =
    authorizeGovernedRuntimeMultiSourceRestart({
      recoveryDecision,
      restartAuthorizationRecordId:
        'restart-authorization-v2877340-proof',
      restartAuthorizationGranted: true,
    })

  const restartExecution =
    await executeGovernedRuntimeMultiSourceRestartIntegration({
      authorization: restartAuthorization,

      executor: async () => ({
        newProcessId: 626262,
      }),
    })

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

  const liveness =
    revalidateGovernedRuntimeMultiSourcePostReadinessLiveness({
      readiness,

      observation: {
        observedProcessId: 626262,
        observationSequence: 1,
        processResponsive: true,
        eventLoopResponsive: true,
      },
    })

  const recoveryCompletion =
    completeGovernedRuntimeMultiSourceRecovery({
      restartExecution,

      identityRebinding,

      livenessDecision: liveness,
    })

  const heartbeat =
    recordGovernedRuntimeMultiSourcePostRecoveryHeartbeat({
      recoveryCompletion,

      heartbeat: {
        observedProcessId: 626262,
        heartbeatAt: '2026-09-13T02:00:05.000Z',
        observedAt: '2026-09-13T02:00:10.000Z',
      },
    })

  assert.equal(livenessEvidence.failureSignalObserved, true)
  assert.equal(heartbeatEvidence.failureSignalObserved, true)

  assert.equal(aggregation.observedFailureSignalCount, 2)
  assert.equal(aggregation.allFailureSignalsObserved, true)

  assert.equal(failureAssessment.failureDetected, true)
  assert.equal(failureAssessment.recoveryRequired, true)

  assert.equal(recoveryDecision.recoveryApproved, true)

  assert.equal(restartAuthorization.restartAuthorized, true)
  assert.equal(restartExecution.restartApplied, true)

  assert.equal(
    identityRebinding.processIdentityRebound,
    true,
  )

  assert.equal(readiness.readinessGranted, true)
  assert.equal(liveness.livenessGranted, true)

  assert.equal(
    recoveryCompletion.recoveryCompleted,
    true,
  )

  assert.equal(
    recoveryCompletion.operationalHealthRestored,
    true,
  )

  assert.equal(
    heartbeat.heartbeatObservationRecorded,
    true,
  )

  assert.equal(
    heartbeat.heartbeatContinuityRestored,
    true,
  )

  assert.equal(
    heartbeat.runtimeAuthorityGranted,
    false,
  )

  assert.equal(
    heartbeat.networkAuthorityGranted,
    false,
  )

  console.log({
    architecture:
      'failure-evidence -> aggregation -> failure-assessment -> recovery-decision -> restart-authorization -> controlled-restart -> identity-rebinding -> readiness -> liveness -> recovery-completion -> heartbeat-continuity',

    previousProcessId:
      restartExecution.previousProcessId,

    processId:
      heartbeat.processId,

    failureSignals:
      aggregation.observedFailureSignalCount,

    failureDetected:
      failureAssessment.failureDetected,

    recoveryApproved:
      recoveryDecision.recoveryApproved,

    restartAuthorized:
      restartAuthorization.restartAuthorized,

    restartApplied:
      restartExecution.restartApplied,

    processIdentityRebound:
      identityRebinding.processIdentityRebound,

    readinessGranted:
      readiness.readinessGranted,

    livenessGranted:
      liveness.livenessGranted,

    recoveryCompleted:
      recoveryCompletion.recoveryCompleted,

    operationalHealthRestored:
      recoveryCompletion.operationalHealthRestored,

    heartbeatObservationRecorded:
      heartbeat.heartbeatObservationRecorded,

    heartbeatContinuityRestored:
      heartbeat.heartbeatContinuityRestored,

    runtimeAuthorityGranted:
      heartbeat.runtimeAuthorityGranted,

    networkAuthorityGranted:
      heartbeat.networkAuthorityGranted,
  })

  console.log(
    'Runtime governed recovery cycle end-to-end proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
