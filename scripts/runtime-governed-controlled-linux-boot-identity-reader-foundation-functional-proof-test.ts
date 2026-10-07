import assert from 'node:assert/strict'

import {
  CONTROLLED_LINUX_BOOT_ID_PATH,
  readControlledLinuxBootIdentity,
} from '../app/lib/runtime-execution-plane/runtime-controlled-linux-boot-identity-reader'

const validBootId =
  '01234567-89ab-cdef-0123-456789abcdef'

let controlledFixtureReadCalls = 0

const result =
  readControlledLinuxBootIdentity(
    (path, encoding) => {
      controlledFixtureReadCalls += 1

      assert.equal(
        path,
        '/proc/sys/kernel/random/boot_id',
      )

      assert.equal(
        path,
        CONTROLLED_LINUX_BOOT_ID_PATH,
      )

      assert.equal(
        encoding,
        'utf8',
      )

      return `  ${validBootId}\n`
    },
  )

assert.equal(controlledFixtureReadCalls, 1)

assert.equal(result.schemaVersion, 1)

assert.equal(
  result.kind,
  'iasevero-controlled-linux-boot-identity-read',
)

assert.equal(
  result.sourcePath,
  CONTROLLED_LINUX_BOOT_ID_PATH,
)

assert.equal(
  result.bootId,
  validBootId,
)

assert.equal(result.bootIdRead, true)

assert.equal(
  result.processIncarnationVerified,
  false,
)

assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

for (const invalidBootId of [
  '',
  'not-a-uuid',
  '01234567-89ab-cdef-0123',
  'zzzzzzzz-89ab-cdef-0123-456789abcdef',
]) {
  assert.throws(
    () =>
      readControlledLinuxBootIdentity(
        () => invalidBootId,
      ),
    /invalid boot identity/,
  )
}

console.log('FIXED_BOOT_ID_PATH_VERIFIED=TRUE')
console.log('UTF8_READ_CONTRACT_VERIFIED=TRUE')
console.log('VALID_BOOT_ID_FIXTURE_ACCEPTED=TRUE')
console.log('BOOT_ID_WHITESPACE_TRIMMED=TRUE')
console.log('INVALID_BOOT_ID_FIXTURES_REJECTED=TRUE')
console.log('CONTROLLED_FIXTURE_READ_CALLS=1')
console.log('SOURCE_RESULT_IMMUTABLE=TRUE')

console.log('FIXTURE_READ_EXECUTED=TRUE')
console.log('PHYSICAL_BOOT_ID_READ_EXECUTED=FALSE')

console.log('PROCESS_INCARNATION_VERIFIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_LINUX_BOOT_IDENTITY_READER_FOUNDATION_FUNCTIONAL=PROVED',
)
