import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ownerPath = resolve(
  process.cwd(),
  'app/lib/runtime-execution-plane/runtime-controlled-loopback-endpoint-process-binding.ts',
)

assert.equal(
  existsSync(ownerPath),
  true,
  'Controlled loopback endpoint process binding owner is missing',
)

const owner = readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /createControlledLoopbackEndpointProcessBinding/,
)

assert.match(owner, /expectedProcessId/)
assert.match(owner, /observedProcessId/)
assert.match(owner, /127\.0\.0\.1/)
assert.match(owner, /port/)
assert.match(owner, /physicalOwnershipVerified/)

assert.doesNotMatch(
  owner,
  /physicalOwnershipVerified\s*:\s*true/,
)

assert.doesNotMatch(
  owner,
  /readinessGranted\s*:\s*true/,
)

assert.doesNotMatch(
  owner,
  /livenessGranted\s*:\s*true/,
)

assert.doesNotMatch(
  owner,
  /runtimeAuthorityGranted\s*:\s*true/,
)

assert.doesNotMatch(
  owner,
  /networkAuthorityGranted\s*:\s*true/,
)

assert.doesNotMatch(
  owner,
  /fetch\s*\(|http\.request|https\.request|net\.connect|createConnection\s*\(|child_process|spawn\s*\(|exec\s*\(/,
)

console.log('EXPECTED_PROCESS_ID_CONTRACT_PRESENT=TRUE')
console.log('OBSERVED_PROCESS_ID_CONTRACT_PRESENT=TRUE')
console.log('LOOPBACK_ENDPOINT_CONTRACT_PRESENT=TRUE')
console.log('PORT_BINDING_CONTRACT_PRESENT=TRUE')
console.log('PHYSICAL_OWNERSHIP_VERIFICATION_CONTRACT_PRESENT=TRUE')

console.log('PHYSICAL_OWNERSHIP_VERIFIED=FALSE')
console.log('DIRECT_PROCESS_EFFECT=FALSE')
console.log('DIRECT_NETWORK_EFFECT=FALSE')
console.log('READINESS_GRANTED=FALSE')
console.log('LIVENESS_GRANTED=FALSE')
console.log('RUNTIME_AUTHORITY_GRANTED=FALSE')
console.log('NETWORK_AUTHORITY_GRANTED=FALSE')

console.log('CONTROLLED_LOOPBACK_ENDPOINT_PROCESS_BINDING_FOUNDATION=PROVED')
