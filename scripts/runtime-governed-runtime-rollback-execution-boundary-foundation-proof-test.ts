import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRollbackAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-rollback-authorization'

import {
  executeGovernedRuntimeRollbackBoundary,
} from '../app/lib/runtime-execution-plane/runtime-rollback-execution-boundary'

async function main(): Promise<void> {
  const authorization: GovernedRuntimeRollbackAuthorization = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-rollback-authorization',

    instanceId: 'instance-v2877347-proof',
    releaseIdentity: 'v287.73.47-active-proof',
    processId: 626262,

    rollbackFromReleaseIdentity:
      'v287.73.47-active-proof',

    rollbackTargetReleaseIdentity:
      'v287.73.46-standby-proof',

    rollbackTargetContentAddress:
      `sha256:${'b'.repeat(64)}`,

    rollbackDecisionVerified: true,

    rollbackAuthorizationRecordId:
      'rollback-authorization-v2877347-proof',

    rollbackRequired: true,
    rollbackApproved: true,
    rollbackEligible: true,

    rollbackAuthorizationGranted: true,
    rollbackAuthorized: true,

    rollbackApplied: false,

    trafficSwitchAuthorized: false,
    trafficSwitchApplied: false,

    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

  let executorCallCount = 0

  const result =
    await executeGovernedRuntimeRollbackBoundary({
      authorization,

      executor: async (request) => {
        executorCallCount += 1

        assert.equal(
          request.rollbackAuthorizationRecordId,
          authorization.rollbackAuthorizationRecordId,
        )

        assert.equal(
          request.rollbackTargetReleaseIdentity,
          authorization.rollbackTargetReleaseIdentity,
        )

        assert.equal(
          request.rollbackTargetContentAddress,
          authorization.rollbackTargetContentAddress,
        )

        return {
          rollbackTargetReleaseIdentity:
            request.rollbackTargetReleaseIdentity,

          rollbackTargetContentAddress:
            request.rollbackTargetContentAddress,

          rollbackApplied: true,
        }
      },
    })

  assert.equal(executorCallCount, 1)

  assert.equal(result.rollbackAuthorizationVerified, true)
  assert.equal(result.rollbackExecutionVerified, true)
  assert.equal(result.rollbackApplied, true)

  assert.equal(result.trafficSwitchAuthorized, false)
  assert.equal(result.trafficSwitchApplied, false)

  assert.equal(result.deploymentApplied, false)
  assert.equal(result.runtimeAuthorityGranted, false)
  assert.equal(result.networkAuthorityGranted, false)

  let deniedExecutorCallCount = 0

  await assert.rejects(
    () =>
      executeGovernedRuntimeRollbackBoundary({
        authorization: {
          ...authorization,
          rollbackAuthorizationGranted: false,
          rollbackAuthorized: false,
        },

        executor: async () => {
          deniedExecutorCallCount += 1

          return {
            rollbackTargetReleaseIdentity:
              authorization.rollbackTargetReleaseIdentity,

            rollbackTargetContentAddress:
              authorization.rollbackTargetContentAddress,

            rollbackApplied: true,
          }
        },
      }),
    /requires explicit rollback authorization/,
  )

  assert.equal(deniedExecutorCallCount, 0)

  await assert.rejects(
    () =>
      executeGovernedRuntimeRollbackBoundary({
        authorization,

        executor: async () => ({
          rollbackTargetReleaseIdentity:
            'different-release',

          rollbackTargetContentAddress:
            authorization.rollbackTargetContentAddress,

          rollbackApplied: true,
        }),
      }),
    /requires verified canonical rollback effect/,
  )

  console.log({
    architecture:
      'rollback-authorization -> controlled-rollback-executor -> verified-rollback-effect -> no-traffic-switch -> no-runtime-authority',

    instanceId: result.instanceId,
    processId: result.processId,

    rollbackFromReleaseIdentity:
      result.rollbackFromReleaseIdentity,

    rollbackTargetReleaseIdentity:
      result.rollbackTargetReleaseIdentity,

    rollbackAuthorizationVerified:
      result.rollbackAuthorizationVerified,

    rollbackExecutionVerified:
      result.rollbackExecutionVerified,

    rollbackApplied:
      result.rollbackApplied,

    trafficSwitchAuthorized:
      result.trafficSwitchAuthorized,

    trafficSwitchApplied:
      result.trafficSwitchApplied,

    deploymentApplied:
      result.deploymentApplied,

    runtimeAuthorityGranted:
      result.runtimeAuthorityGranted,

    networkAuthorityGranted:
      result.networkAuthorityGranted,

    executorCallCount,
    deniedExecutorCallCount,
  })

  console.log(
    'Runtime governed runtime rollback execution boundary foundation proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
