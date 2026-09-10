import assert from 'node:assert/strict'

import type {
  GovernedRuntimeRestartAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-restart-authorization'

import {
  executeGovernedRuntimeRestart,
} from '../app/lib/runtime-execution-plane/runtime-restart-execution-boundary'

async function main() {
  const authorization: GovernedRuntimeRestartAuthorization = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-restart-authorization',

    instanceId: 'instance-v2877317-proof',
    releaseIdentity: 'v287.73.17-proof-release',
    recoveryAuthorizationRecordId:
      'recovery-authorization-v2877317-proof',
    restartAuthorizationRecordId:
      'restart-authorization-v2877317-proof',
    processId: 424242,

    recoveryDecisionVerified: true,
    restartEligible: true,
    restartAuthorizationGranted: true,
    restartAuthorized: true,

    restartApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

  let executorCallCount = 0

  const result = await executeGovernedRuntimeRestart(
    authorization,
    async (request) => {
      executorCallCount += 1

      assert.equal(request.instanceId, authorization.instanceId)
      assert.equal(request.releaseIdentity, authorization.releaseIdentity)
      assert.equal(
        request.restartAuthorizationRecordId,
        authorization.restartAuthorizationRecordId,
      )
      assert.equal(request.previousProcessId, 424242)

      return {
        newProcessId: 525252,
      }
    },
  )

  assert.equal(executorCallCount, 1)
  assert.equal(result.restartAuthorizationVerified, true)
  assert.equal(result.restartExecutionPrepared, true)
  assert.equal(result.restartApplied, true)
  assert.equal(result.previousProcessId, 424242)
  assert.equal(result.newProcessId, 525252)

  assert.equal(result.processIdentityRebindingRequired, true)
  assert.equal(result.readinessGranted, false)
  assert.equal(result.livenessGranted, false)

  assert.equal(result.deploymentApplied, false)
  assert.equal(result.runtimeAuthorityGranted, false)
  assert.equal(result.networkAuthorityGranted, false)

  await assert.rejects(
    () =>
      executeGovernedRuntimeRestart(
        authorization,
        async () => ({
          newProcessId: 424242,
        }),
      ),
    /requires a distinct valid replacement process id/,
  )

  console.log({
    architecture:
      'explicit-restart-authorization -> controlled-restart-executor -> replacement-pid -> mandatory-revalidation',
    executorCallCount,
    restartAuthorizationVerified:
      result.restartAuthorizationVerified,
    restartApplied: result.restartApplied,
    previousProcessId: result.previousProcessId,
    newProcessId: result.newProcessId,
    processIdentityRebindingRequired:
      result.processIdentityRebindingRequired,
    readinessGranted: result.readinessGranted,
    livenessGranted: result.livenessGranted,
    runtimeAuthorityGranted: result.runtimeAuthorityGranted,
    networkAuthorityGranted: result.networkAuthorityGranted,
    realProcessRestarted: false,
  })

  console.log(
    'Runtime governed runtime restart execution boundary foundation proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
