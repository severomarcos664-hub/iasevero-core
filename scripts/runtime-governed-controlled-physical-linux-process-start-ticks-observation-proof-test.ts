import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import {
  readControlledLinuxProcessStartTicks,
} from '../app/lib/runtime-execution-plane/runtime-controlled-linux-process-start-ticks-reader'

const AUTHORIZATION_ENV =
  'IASEVERO_ALLOW_CONTROLLED_PHYSICAL_PROCESS_START_TICKS_OBSERVATION'

if (process.env[AUTHORIZATION_ENV] !== '1') {
  throw new Error(
    'Controlled physical Linux process start ticks observation requires explicit proof authorization.',
  )
}

const selfProcessId = process.pid

assert.equal(
  Number.isSafeInteger(selfProcessId) &&
    selfProcessId > 0,
  true,
)

const result =
  readControlledLinuxProcessStartTicks(
    selfProcessId,
  )

assert.equal(
  result.processId,
  selfProcessId,
)

assert.equal(
  result.sourcePath,
  `/proc/${selfProcessId}/stat`,
)

assert.equal(
  result.processStartTicksRead,
  true,
)

assert.equal(
  Number.isSafeInteger(result.processStartTicks) &&
    result.processStartTicks > 0,
  true,
)

assert.equal(
  result.processIncarnationVerified,
  false,
)

assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

const observationDigest =
  createHash('sha256')
    .update(
      `${result.processId}:${result.processStartTicks}`,
      'utf8',
    )
    .digest('hex')

assert.match(
  observationDigest,
  /^[0-9a-f]{64}$/,
)

console.log(
  'CONTROLLED_PHYSICAL_PROCESS_START_TICKS_OBSERVATION=PROVED',
)

console.log(
  'SELF_PROCESS_ID_BOUND=TRUE',
)

console.log(
  'SOURCE_PATH_VERIFIED=TRUE',
)

console.log(
  'PROCESS_START_TICKS_FORMAT_VERIFIED=TRUE',
)

console.log(
  'PROCESS_START_TICKS_RAW_DISCLOSED=FALSE',
)

console.log(
  `PROCESS_START_TICKS_SHA256=${observationDigest}`,
)

console.log(
  'PROC_PROCESS_STAT_READ_EXECUTED=TRUE',
)

console.log(
  'PHYSICAL_PROCESS_START_TICKS_OBSERVATION_RECORDED=TRUE',
)

console.log(
  'PROCESS_INCARNATION_VERIFIED=FALSE',
)

console.log(
  'READINESS_GRANTED=FALSE',
)

console.log(
  'LIVENESS_GRANTED=FALSE',
)

console.log(
  'RUNTIME_AUTHORITY_GRANTED=FALSE',
)

console.log(
  'NETWORK_AUTHORITY_GRANTED=FALSE',
)
