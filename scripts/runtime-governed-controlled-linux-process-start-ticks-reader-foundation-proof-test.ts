import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const owner =
  'app/lib/runtime-execution-plane/' +
  'runtime-controlled-linux-process-start-ticks-reader.ts'

assert.equal(
  existsSync(
    'app/lib/runtime-execution-plane/' +
    'runtime-controlled-linux-process-incarnation-source.ts',
  ),
  true,
  'Canonical Linux process incarnation source is missing',
)

assert.equal(
  existsSync(
    'app/lib/runtime-execution-plane/' +
    'runtime-controlled-physical-process-incarnation-observer.ts',
  ),
  true,
  'Canonical physical process incarnation observer is missing',
)

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
  'Controlled Linux process start ticks reader owner is missing',
)

const source = readFileSync(owner, 'utf8')

assert.match(
  source,
  /readControlledLinuxProcessStartTicks/,
)

assert.match(
  source,
  /processId/,
)

assert.match(
  source,
  /processStartTicks/,
)

assert.match(
  source,
  /sourcePath/,
)

assert.match(
  source,
  /processStartTicksRead/,
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
  'CONTROLLED_LINUX_PROCESS_START_TICKS_READER_FOUNDATION=PROVED',
)
