import assert from 'node:assert/strict'

import type {
  GovernedRuntimeMultiSourceRestartAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-authorization'

import {
  executeGovernedRuntimeMultiSourceRestartIntegration,
} from '../app/lib/runtime-execution-plane/runtime-multi-source-restart-execution-integration'

async function main() {
  const authorization:
    GovernedRuntimeMultiSourceRestartAuthorization = {
      schemaVersion: 1,
      kind:
        'iasevero-governed-runtime-multi-source-restart-authorization',

      instanceId: 'instance-v2877334-proof',
      releaseIdentity: 'v287.73.34-proof-release',

      livenessAuthorizationRecordId:
        'liveness-authorization-v2877334-proof',

      processId: 525252,

      recoveryDecisionVerified: true,
      recoveryRequired: true,
      recoveryApproved: true,

      restartAuthorizationRecordId:
        'restart-authorization-v2877334-proof',

      restartAuthorizationGranted: true,
      restartAuthorized: true,

      restartApplied: false,
      deploymentApplied: false,
      runtimeAuthorityGranted: false,
      networkAuthorityGranted: false,
    }

  let executorCallCount = 0

  const result =
    await executeGovernedRuntimeMultiSourceRestartIntegration({
      authorization,

      executor: async (request) => {
        executorCallCount += 1

        assert.equal(
          request.instanceId,
          authorization.instanceId,
        )

        assert.equal(
          request.releaseIdentity,
          authorization.releaseIdentity,
        )

        assert.equal(
          request.restartAuthorizationRecordId,
          authorization.restartAuthorizationRecordId,
        )

        assert.equal(
          request.previousProcessId,
          525252,
        )

        return {
          newProcessId: 626262,
        }
      },
    })

  assert.equal(executorCallCount, 1)

  assert.equal(
    result.multiSourceAuthorizationVerified,
    true,
  )

  assert.equal(
    result.authorizationAdapterVerified,
    true,
  )

  assert.equal(
    result.sourceLivenessAuthorizationRecordId,
    authorization.livenessAuthorizationRecordId,
  )

  assert.equal(
    result.restartAuthorizationVerified,
    true,
  )

  assert.equal(result.restartApplied, true)
  assert.equal(result.previousProcessId, 525252)
  assert.equal(result.newProcessId, 626262)

  assert.equal(
    result.processIdentityRebindingRequired,
    true,
  )

  assert.equal(result.readinessGranted, false)
  assert.equal(result.livenessGranted, false)

  assert.equal(result.deploymentApplied, false)
  assert.equal(result.runtimeAuthorityGranted, false)
  assert.equal(result.networkAuthorityGranted, false)

  let deniedExecutorCallCount = 0

  await assert.rejects(
    () =>
      executeGovernedRuntimeMultiSourceRestartIntegration({
        authorization: {
          ...authorization,
          restartAuthorizationGranted: false,
          restartAuthorized: false,
        },

        executor: async () => {
          deniedExecutorCallCount += 1

          return {
            newProcessId: 737373,
          }
        },
      }),

    /requires authorized canonical restart contract/,
  )

  assert.equal(deniedExecutorCallCount, 0)

  console.log({
    architecture:
      'multi-source-authorization -> governed-adapter -> canonical-restart-executor -> mandatory-rebinding',

    executorCallCount,

    multiSourceAuthorizationVerified:
      result.multiSourceAuthorizationVerified,

    authorizationAdapterVerified:
      result.authorizationAdapterVerified,

    restartAuthorizationVerified:
      result.restartAuthorizationVerified,

    restartApplied:
      result.restartApplied,

    previousProcessId:
      result.previousProcessId,

    newProcessId:
      result.newProcessId,

    processIdentityRebindingRequired:
      result.processIdentityRebindingRequired,

    deniedExecutorCallCount,

    readinessGranted:
      result.readinessGranted,

    livenessGranted:
      result.livenessGranted,

    runtimeAuthorityGranted:
      result.runtimeAuthorityGranted,

    networkAuthorityGranted:
      result.networkAuthorityGranted,
  })

  console.log(
    'Runtime governed multi-source restart execution integration foundation proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
