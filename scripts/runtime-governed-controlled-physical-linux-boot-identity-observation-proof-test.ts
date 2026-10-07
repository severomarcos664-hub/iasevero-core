import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import {
  observeControlledRealLinuxBootIdentity,
} from '../app/lib/runtime-execution-plane/runtime-controlled-real-linux-boot-identity-observation'

const AUTHORIZATION_ENV =
  'IASEVERO_ALLOW_CONTROLLED_PHYSICAL_BOOT_ID_OBSERVATION'

const CONTROLLED_BOOT_ID_PATH =
  '/proc/sys/kernel/random/boot_id'

if (process.env[AUTHORIZATION_ENV] !== '1') {
  throw new Error(
    'Controlled physical Linux boot identity observation requires explicit proof authorization.',
  )
}

assert.equal(
  process.platform,
  'linux',
  'Controlled physical boot identity observation requires Linux.',
)

const result =
  observeControlledRealLinuxBootIdentity()

assert.equal(result.schemaVersion, 1)

assert.equal(
  result.kind,
  'iasevero-controlled-real-linux-boot-identity-observation',
)

assert.equal(
  result.sourcePath,
  CONTROLLED_BOOT_ID_PATH,
)

assert.equal(result.physicalBootIdReadExecuted, true)
assert.equal(result.realBootIdentityObservationRecorded, true)

assert.match(
  result.bootId,
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
)

assert.equal(result.processIncarnationVerified, false)
assert.equal(result.readinessGranted, false)
assert.equal(result.livenessGranted, false)
assert.equal(result.runtimeAuthorityGranted, false)
assert.equal(result.networkAuthorityGranted, false)

assert.equal(Object.isFrozen(result), true)

const bootIdSha256 =
  createHash('sha256')
    .update(result.bootId, 'utf8')
    .digest('hex')

assert.match(
  bootIdSha256,
  /^[0-9a-f]{64}$/,
)

console.log('CONTROLLED_PHYSICAL_BOOT_ID_OBSERVATION=PROVED')
console.log('SOURCE_PATH_VERIFIED=TRUE')
console.log('BOOT_ID_FORMAT_VERIFIED=TRUE')
console.log('BOOT_ID_RAW_DISCLOSED=FALSE')
console.log(`BOOT_ID_SHA256=${bootIdSha256}`)

console.log('PHYSICAL_BOOT_ID_READ_EXECUTED=TRUE')
console.log('REAL_BOOT_ID_OBSERVATION_RECORDED=TRUE')

console.log('PROCESS_INCARNATION_VERIFIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')
console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
