import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/' +
  'runtime-controlled-process-incarnation-verification-decision.ts'

assert.equal(
  existsSync(
    'app/lib/runtime-execution-plane/' +
    'runtime-controlled-process-incarnation-evidence.ts',
  ),
  true,
  'Canonical process incarnation evidence owner is missing',
)

assert.equal(
  existsSync(owner),
  true,
  'Controlled process incarnation verification decision owner is missing',
)

const source =
  readFileSync(owner, 'utf8')

assert.match(
  source,
  /verifyControlledProcessIncarnationEvidence/,
)

assert.match(source, /processId/)
assert.match(source, /bootId/)
assert.match(source, /processStartTicks/)

assert.match(
  source,
  /processIncarnationVerified/,
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
  'CONTROLLED_PROCESS_INCARNATION_VERIFICATION_DECISION_FOUNDATION=PROVED',
)
