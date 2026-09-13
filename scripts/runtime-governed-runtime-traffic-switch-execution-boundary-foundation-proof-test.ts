import assert from 'node:assert/strict'

import type {
  GovernedRuntimeTrafficSwitchAuthorization,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-authorization'

import {
  executeGovernedRuntimeTrafficSwitchBoundary,
} from '../app/lib/runtime-execution-plane/runtime-traffic-switch-execution-boundary'

async function main(): Promise<void> {
  const authorization: GovernedRuntimeTrafficSwitchAuthorization = {
    schemaVersion: 1,
    kind: 'iasevero-governed-runtime-traffic-switch-authorization',

    instanceId: 'instance-v2877349-proof',
    releaseIdentity: 'v287.73.49-active-proof',
    processId: 626262,

    activeSlot: 'blue',
    standbySlot: 'green',

    trafficSwitchFromReleaseIdentity:
      'v287.73.49-active-proof',

    trafficSwitchTargetReleaseIdentity:
      'v287.73.48-standby-proof',

    trafficSwitchTargetContentAddress:
      `sha256:${'c'.repeat(64)}`,

    rollbackExecutionVerified: true,
    blueGreenStateVerified: true,

    trafficSwitchAuthorizationRecordId:
      'traffic-switch-authorization-v2877349-proof',

    trafficSwitchEligible: true,
    trafficSwitchAuthorizationGranted: true,
    trafficSwitchAuthorized: true,

    trafficSwitchApplied: false,
    deploymentApplied: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }

  let executorCallCount = 0

  const result =
    await executeGovernedRuntimeTrafficSwitchBoundary({
      authorization,

      executor: async (request) => {
        executorCallCount += 1

        assert.equal(request.previousActiveSlot, 'blue')
        assert.equal(request.previousStandbySlot, 'green')

        assert.equal(
          request.trafficSwitchAuthorizationRecordId,
          authorization.trafficSwitchAuthorizationRecordId,
        )

        return {
          newActiveSlot: 'green',
          newStandbySlot: 'blue',

          activeReleaseIdentity:
            request.trafficSwitchTargetReleaseIdentity,

          activeContentAddress:
            request.trafficSwitchTargetContentAddress,

          trafficSwitchApplied: true,
        }
      },
    })

  assert.equal(executorCallCount, 1)

  assert.equal(
    result.trafficSwitchAuthorizationVerified,
    true,
  )

  assert.equal(
    result.trafficSwitchExecutionVerified,
    true,
  )

  assert.equal(result.previousActiveSlot, 'blue')
  assert.equal(result.previousStandbySlot, 'green')

  assert.equal(result.newActiveSlot, 'green')
  assert.equal(result.newStandbySlot, 'blue')

  assert.equal(result.trafficSwitchApplied, true)

  assert.equal(result.deploymentApplied, false)
  assert.equal(result.runtimeAuthorityGranted, false)
  assert.equal(result.networkAuthorityGranted, false)

  let deniedExecutorCallCount = 0

  await assert.rejects(
    () =>
      executeGovernedRuntimeTrafficSwitchBoundary({
        authorization: {
          ...authorization,
          trafficSwitchAuthorizationGranted: false,
          trafficSwitchAuthorized: false,
        },

        executor: async () => {
          deniedExecutorCallCount += 1

          return {
            newActiveSlot: 'green',
            newStandbySlot: 'blue',
            activeReleaseIdentity:
              authorization.trafficSwitchTargetReleaseIdentity,
            activeContentAddress:
              authorization.trafficSwitchTargetContentAddress,
            trafficSwitchApplied: true,
          }
        },
      }),
    /requires explicit traffic switch authorization/,
  )

  assert.equal(deniedExecutorCallCount, 0)

  await assert.rejects(
    () =>
      executeGovernedRuntimeTrafficSwitchBoundary({
        authorization,

        executor: async () => ({
          newActiveSlot: 'blue',
          newStandbySlot: 'green',

          activeReleaseIdentity:
            authorization.trafficSwitchTargetReleaseIdentity,

          activeContentAddress:
            authorization.trafficSwitchTargetContentAddress,

          trafficSwitchApplied: true,
        }),
      }),
    /requires verified canonical active-standby inversion/,
  )

  console.log({
    architecture:
      'traffic-switch-authorization -> controlled-traffic-switch-executor -> canonical-slot-inversion -> verified-traffic-switch-effect -> no-runtime-authority',

    previousActiveSlot:
      result.previousActiveSlot,

    previousStandbySlot:
      result.previousStandbySlot,

    newActiveSlot:
      result.newActiveSlot,

    newStandbySlot:
      result.newStandbySlot,

    trafficSwitchTargetReleaseIdentity:
      result.trafficSwitchTargetReleaseIdentity,

    trafficSwitchAuthorizationVerified:
      result.trafficSwitchAuthorizationVerified,

    trafficSwitchExecutionVerified:
      result.trafficSwitchExecutionVerified,

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
    'Runtime governed runtime traffic switch execution boundary foundation proof passed.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
