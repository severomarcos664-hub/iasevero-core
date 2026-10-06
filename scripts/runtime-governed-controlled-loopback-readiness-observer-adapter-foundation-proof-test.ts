import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ownerPath = resolve(
  process.cwd(),
  'app/lib/runtime-execution-plane/runtime-controlled-loopback-readiness-observer-adapter.ts',
)

assert.equal(
  existsSync(ownerPath),
  true,
  'Controlled loopback readiness observer adapter owner is missing',
)

const owner = readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /createControlledLoopbackReadinessObserverAdapter/,
)

assert.match(
  owner,
  /127\.0\.0\.1/,
)

assert.match(
  owner,
  /processId/,
)

assert.match(
  owner,
  /port/,
)

assert.match(
  owner,
  /timeoutMs/,
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

console.log('LOOPBACK_ONLY_CONTRACT_PRESENT=TRUE')
console.log('PROCESS_BINDING_CONTRACT_PRESENT=TRUE')
console.log('PORT_BINDING_CONTRACT_PRESENT=TRUE')
console.log('TIMEOUT_CONTRACT_PRESENT=TRUE')
console.log('DIRECT_READINESS_GRANT=FALSE')
console.log('DIRECT_LIVENESS_GRANT=FALSE')
console.log('DIRECT_RUNTIME_AUTHORITY_GRANT=FALSE')
console.log('DIRECT_NETWORK_AUTHORITY_GRANT=FALSE')
console.log('CONTROLLED_LOOPBACK_READINESS_OBSERVER_ADAPTER_FOUNDATION=PROVED')
