import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/runtime-controlled-linux-process-incarnation-source.ts'

assert.equal(
  existsSync(owner),
  true,
  'Controlled Linux process incarnation source owner is missing',
)

const source = readFileSync(owner, 'utf8')

assert.match(
  source,
  /ControlledLinuxProcessIncarnationSourceInput/,
)

assert.match(
  source,
  /ControlledLinuxProcessIncarnationSourceResult/,
)

assert.match(
  source,
  /prepareControlledLinuxProcessIncarnationSource/,
)

assert.match(source, /processId/)
assert.match(source, /bootIdRead/)
assert.match(source, /processStatRead/)
assert.match(source, /processIncarnationSourcePrepared/)
assert.match(source, /processIncarnationVerified/)

assert.match(source, /readinessGranted/)
assert.match(source, /livenessGranted/)
assert.match(source, /runtimeAuthorityGranted/)
assert.match(source, /networkAuthorityGranted/)

console.log(
  'CONTROLLED_LINUX_PROCESS_INCARNATION_SOURCE_FOUNDATION=PROVED',
)
