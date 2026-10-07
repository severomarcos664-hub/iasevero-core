import assert from 'node:assert/strict'

import {
  readControlledLinuxProcessStartTicks,
} from '../app/lib/runtime-execution-plane/runtime-controlled-linux-process-start-ticks-reader'

const FIXTURE_PROCESS_ID = 424242
const FIXTURE_START_TICKS = 987654321

const EXPECTED_SOURCE_PATH =
  `/proc/${FIXTURE_PROCESS_ID}/stat`

function makeProcessStat(
  processId: number,
  processStartTicks: number,
): string {
  const fieldsFromThree = [
    'S',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    String(processStartTicks),
    '20',
    '21',
  ]

  return (
    `${processId} (worker ) with spaces) ` +
    fieldsFromThree.join(' ') +
    '\n'
  )
}

let fixtureReads = 0

const result =
  readControlledLinuxProcessStartTicks(
    FIXTURE_PROCESS_ID,
    (sourcePath, encoding) => {
      fixtureReads += 1

      assert.equal(
        sourcePath,
        EXPECTED_SOURCE_PATH,
      )

      assert.equal(
        encoding,
        'utf8',
      )

      return makeProcessStat(
        FIXTURE_PROCESS_ID,
        FIXTURE_START_TICKS,
      )
    },
  )

assert.equal(fixtureReads, 1)

assert.equal(
  result.kind,
  'iasevero-controlled-linux-process-start-ticks-read',
)

assert.equal(result.schemaVersion, 1)
assert.equal(result.processId, FIXTURE_PROCESS_ID)

assert.equal(
  result.sourcePath,
  EXPECTED_SOURCE_PATH,
)

assert.equal(
  result.processStartTicks,
  FIXTURE_START_TICKS,
)

assert.equal(
  result.processStartTicksRead,
  true,
)

assert.equal(result.processIncarnationVerified, false)
assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

let invalidProcessIdReadCalls = 0

assert.throws(
  () =>
    readControlledLinuxProcessStartTicks(
      0,
      () => {
        invalidProcessIdReadCalls += 1
        return ''
      },
    ),
  /requires a valid processId/,
)

assert.equal(
  invalidProcessIdReadCalls,
  0,
)

assert.throws(
  () =>
    readControlledLinuxProcessStartTicks(
      FIXTURE_PROCESS_ID,
      () =>
        makeProcessStat(
          FIXTURE_PROCESS_ID + 1,
          FIXTURE_START_TICKS,
        ),
    ),
  /mismatched process identity/,
)

assert.throws(
  () =>
    readControlledLinuxProcessStartTicks(
      FIXTURE_PROCESS_ID,
      () => 'malformed process stat',
    ),
  /malformed process stat evidence/,
)

assert.throws(
  () =>
    readControlledLinuxProcessStartTicks(
      FIXTURE_PROCESS_ID,
      () => {
        const incompleteFields = [
          'S',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
        ]

        return (
          `${FIXTURE_PROCESS_ID} (worker) ` +
          incompleteFields.join(' ')
        )
      },
    ),
  /requires Linux stat field 22/,
)

assert.throws(
  () =>
    readControlledLinuxProcessStartTicks(
      FIXTURE_PROCESS_ID,
      () =>
        makeProcessStat(
          FIXTURE_PROCESS_ID,
          0,
        ),
    ),
  /requires valid processStartTicks/,
)

console.log('FIXTURE_PROCESS_STAT_READ_EXECUTED=TRUE')
console.log('PROCESS_ID_PATH_BINDING_VERIFIED=TRUE')
console.log('PROCESS_ID_MISMATCH_REJECTED=TRUE')
console.log('MALFORMED_STAT_REJECTED=TRUE')
console.log('MISSING_FIELD_22_REJECTED=TRUE')
console.log('INVALID_START_TICKS_REJECTED=TRUE')
console.log('COMM_WITH_SPACES_AND_PARENTHESIS_ACCEPTED=TRUE')
console.log('PROCESS_START_TICKS_FIXTURE_ACCEPTED=TRUE')
console.log('RESULT_IMMUTABLE=TRUE')

console.log('PROC_PROCESS_STAT_READ_EXECUTED=FALSE')
console.log('PHYSICAL_PROCESS_START_TICKS_OBSERVED=FALSE')
console.log('ADDITIONAL_PHYSICAL_BOOT_ID_READ_EXECUTED=FALSE')

console.log('PROCESS_INCARNATION_VERIFIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_LINUX_PROCESS_START_TICKS_READER_FOUNDATION_FUNCTIONAL=PROVED',
)
