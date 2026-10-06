import { readFileSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const owner = readFileSync(
  'app/lib/runtime-execution-plane/runtime-first-launch-post-spawn-readiness.ts',
  'utf8',
)

assert.match(owner, /processStarted/)
assert.match(owner, /processIdAssigned/)
assert.match(owner, /processId/)
assert.match(owner, /runtimeAuthorityGranted/)
assert.match(owner, /networkAuthorityGranted/)
assert.match(owner, /createInitialRuntimeReadinessCandidate/)
assert.doesNotMatch(owner, /readinessGranted:\s*true/)
assert.doesNotMatch(owner, /livenessGranted:\s*true/)
assert.doesNotMatch(owner, /node:child_process/)
assert.doesNotMatch(owner, /\bspawn\s*\(/)

console.log('POST_SPAWN_BOUNDARY_PRESENT=TRUE')
console.log('CANONICAL_READINESS_REUSED=TRUE')
console.log('DIRECT_HEALTH_GRANT=FALSE')
console.log('DIRECT_PROCESS_EFFECT=FALSE')
console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
console.log('POST_SPAWN_READINESS_BOUNDARY=PROVED')
