import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ownerPath = resolve(
  'app/lib/runtime-execution-plane/runtime-controlled-process-incarnation-evidence.ts',
)

assert.equal(
  existsSync(ownerPath),
  true,
  'Controlled process incarnation evidence owner is missing',
)

const owner = readFileSync(ownerPath, 'utf8')

assert.match(owner, /processId/)
assert.match(owner, /bootId/)
assert.match(owner, /processStartTicks/)
assert.match(owner, /processIncarnationEvidenceRecorded/)
assert.match(owner, /processIncarnationVerified/)

assert.match(owner, /processIncarnationVerified:\s*false/)
assert.match(owner, /readinessGranted:\s*false/)
assert.match(owner, /livenessGranted:\s*false/)
assert.match(owner, /runtimeAuthorityGranted:\s*false/)
assert.match(owner, /networkAuthorityGranted:\s*false/)

assert.doesNotMatch(
  owner,
  /fetch\s*\(|http\.request|https\.request|net\.connect|createConnection\s*\(|new\s+Socket/,
)

assert.doesNotMatch(
  owner,
  /readinessGranted:\s*true|livenessGranted:\s*true|runtimeAuthorityGranted:\s*true|networkAuthorityGranted:\s*true/,
)

console.log('PROCESS_ID_CONTRACT_PRESENT=TRUE')
console.log('BOOT_ID_CONTRACT_PRESENT=TRUE')
console.log('PROCESS_START_TICKS_CONTRACT_PRESENT=TRUE')
console.log('PROCESS_INCARNATION_EVIDENCE_CONTRACT_PRESENT=TRUE')

console.log('PROCESS_INCARNATION_VERIFIED=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log(
  'CONTROLLED_PROCESS_INCARNATION_EVIDENCE_FOUNDATION=PROVED',
)
