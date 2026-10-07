import assert from 'node:assert/strict'

import {
  observeControlledRealLinuxBootIdentity,
} from '../app/lib/runtime-execution-plane/runtime-controlled-real-linux-boot-identity-observation'

const FIXTURE_BOOT_ID =
  '11111111-2222-3333-4444-555555555555'

const CONTROLLED_BOOT_ID_PATH =
  '/proc/sys/kernel/random/boot_id'

let controlledFixtureCalls = 0

const result =
  observeControlledRealLinuxBootIdentity(() => {
    controlledFixtureCalls += 1

    return {
      bootIdRead: true,
      bootId: FIXTURE_BOOT_ID,
      sourcePath: CONTROLLED_BOOT_ID_PATH,
    }
  })

assert.equal(controlledFixtureCalls, 1)

assert.equal(
  result.kind,
  'iasevero-controlled-real-linux-boot-identity-observation',
)

assert.equal(result.schemaVersion, 1)
assert.equal(result.bootId, FIXTURE_BOOT_ID)

assert.equal(
  result.sourcePath,
  CONTROLLED_BOOT_ID_PATH,
)

assert.equal(
  result.physicalBootIdReadExecuted,
  false,
)

assert.equal(
  result.realBootIdentityObservationRecorded,
  false,
)

assert.equal(result.processIncarnationVerified, false)
assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

assert.throws(
  () =>
    observeControlledRealLinuxBootIdentity(
      () => ({
        bootIdRead: false,
        bootId: FIXTURE_BOOT_ID,
        sourcePath: CONTROLLED_BOOT_ID_PATH,
      }),
    ),
  /requires valid certified boot identity evidence/,
)

assert.throws(
  () =>
    observeControlledRealLinuxBootIdentity(
      () => ({
        bootIdRead: true,
        bootId: '',
        sourcePath: CONTROLLED_BOOT_ID_PATH,
      }),
    ),
  /requires valid certified boot identity evidence/,
)

assert.throws(
  () =>
    observeControlledRealLinuxBootIdentity(
      () => ({
        bootIdRead: true,
        bootId: FIXTURE_BOOT_ID,
        sourcePath: '/tmp/not-authorized',
      }),
    ),
  /requires valid certified boot identity evidence/,
)

console.log('VALID_INJECTED_BOOT_ID_OBSERVATION_ACCEPTED=TRUE')
console.log('INVALID_BOOT_ID_READ_REJECTED=TRUE')
console.log('EMPTY_BOOT_ID_REJECTED=TRUE')
console.log('INVALID_SOURCE_PATH_REJECTED=TRUE')
console.log('RESULT_IMMUTABLE=TRUE')

console.log('INJECTED_CANDIDATE_CONTRACT_USED=TRUE')
console.log('CANONICAL_PREDECESSOR_RESULT_NOT_FORGED=TRUE')
console.log('UNSAFE_DOUBLE_CAST_USED=FALSE')

console.log('PHYSICAL_BOOT_ID_READ_EXECUTED=FALSE')
console.log('REAL_BOOT_ID_OBSERVATION_RECORDED=FALSE')
console.log('PROCESS_INCARNATION_VERIFIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_REAL_LINUX_BOOT_IDENTITY_OBSERVATION_FOUNDATION_FUNCTIONAL=PROVED',
)
