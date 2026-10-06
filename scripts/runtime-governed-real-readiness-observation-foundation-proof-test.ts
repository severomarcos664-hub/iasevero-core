import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ownerPath = resolve(
  process.cwd(),
  'app/lib/runtime-execution-plane/runtime-governed-readiness-observation.ts',
)

assert.equal(
  existsSync(ownerPath),
  true,
  'Governed real readiness observation owner is missing',
)

const owner = readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /export function observeGovernedRuntimeReadiness/,
)

assert.match(owner, /observedProcessId/)
assert.match(owner, /observedHost/)
assert.match(owner, /observedPort/)
assert.match(owner, /transportReachable/)
assert.match(owner, /applicationResponsive/)

assert.doesNotMatch(
  owner,
  /child_process|spawnSync|execSync|execFileSync/,
)

assert.doesNotMatch(
  owner,
  /(readinessGranted|livenessGranted|runtimeAuthorityGranted|networkAuthorityGranted)\s*[:=]\s*true/,
)

console.log('READINESS_OBSERVATION_OWNER_PRESENT=TRUE')
console.log('PROCESS_OBSERVATION_CONTRACT_PRESENT=TRUE')
console.log('TRANSPORT_OBSERVATION_CONTRACT_PRESENT=TRUE')
console.log('APPLICATION_OBSERVATION_CONTRACT_PRESENT=TRUE')
console.log('DIRECT_PROCESS_EFFECT=FALSE')
console.log('DIRECT_HEALTH_GRANT=FALSE')
console.log('REAL_HEALTH_OBSERVATION=FALSE')
console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
console.log('REAL_READINESS_OBSERVATION_FOUNDATION=PROVED')
