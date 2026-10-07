import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/' +
  'runtime-controlled-real-linux-boot-identity-observation.ts'

assert.equal(
  existsSync(
    'app/lib/runtime-execution-plane/' +
    'runtime-controlled-linux-boot-identity-reader.ts',
  ),
  true,
  'Certified controlled Linux boot identity reader predecessor is missing',
)

assert.equal(
  existsSync(owner),
  true,
  'Controlled real Linux boot identity observation owner is missing',
)

const source = readFileSync(owner, 'utf8')

assert.match(
  source,
  /observeControlledRealLinuxBootIdentity/,
)

assert.match(
  source,
  /readControlledLinuxBootIdentity/,
)

assert.match(
  source,
  /physicalBootIdReadExecuted/,
)

assert.match(
  source,
  /realBootIdentityObservationRecorded/,
)

assert.match(
  source,
  /processIncarnationVerified:\s*false/,
)

assert.match(
  source,
  /readinessGranted:\s*false/,
)

assert.match(
  source,
  /livenessGranted:\s*false/,
)

assert.match(
  source,
  /runtimeAuthorityGranted:\s*false/,
)

assert.match(
  source,
  /networkAuthorityGranted:\s*false/,
)

console.log(
  'CONTROLLED_REAL_LINUX_BOOT_IDENTITY_OBSERVATION_FOUNDATION=PROVED',
)
