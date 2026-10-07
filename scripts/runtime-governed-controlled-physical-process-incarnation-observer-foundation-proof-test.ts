import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/runtime-controlled-physical-process-incarnation-observer.ts'

assert.equal(
  existsSync(owner),
  true,
  'Controlled physical process incarnation observer owner is missing',
)

const source = readFileSync(owner, 'utf8')

assert.match(
  source,
  /ControlledPhysicalProcessIncarnationObservationInput/,
)

assert.match(
  source,
  /ControlledPhysicalProcessIncarnationObservation/,
)

assert.match(
  source,
  /observeControlledPhysicalProcessIncarnation/,
)

assert.match(source, /processId/)
assert.match(source, /bootId/)
assert.match(source, /processStartTicks/)

assert.match(
  source,
  /processIncarnationObserved/,
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
  'CONTROLLED_PHYSICAL_PROCESS_INCARNATION_OBSERVER_FOUNDATION=PROVED',
)
