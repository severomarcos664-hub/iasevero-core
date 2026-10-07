import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/runtime-controlled-linux-boot-identity-reader.ts'

assert.equal(
  existsSync(owner),
  true,
  'Controlled Linux boot identity reader owner is missing',
)

const source = readFileSync(owner, 'utf8')

assert.match(
  source,
  /CONTROLLED_LINUX_BOOT_ID_PATH/,
)

assert.match(
  source,
  /\/proc\/sys\/kernel\/random\/boot_id/,
)

assert.match(
  source,
  /ControlledLinuxBootIdentityReadResult/,
)

assert.match(
  source,
  /readControlledLinuxBootIdentity/,
)

assert.match(
  source,
  /readFileSync/,
)

assert.match(
  source,
  /bootIdRead/,
)

assert.match(
  source,
  /processIncarnationVerified/,
)

assert.match(
  source,
  /readinessGranted/,
)

assert.match(
  source,
  /livenessGranted/,
)

assert.match(
  source,
  /runtimeAuthorityGranted/,
)

assert.match(
  source,
  /networkAuthorityGranted/,
)

console.log(
  'CONTROLLED_LINUX_BOOT_IDENTITY_READER_FOUNDATION=PROVED',
)
