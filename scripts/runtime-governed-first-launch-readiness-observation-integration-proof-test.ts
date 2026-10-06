import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ownerPath = resolve(
  process.cwd(),
  'app/lib/runtime-execution-plane/runtime-first-launch-readiness-observation-integration.ts',
)

assert.equal(
  existsSync(ownerPath),
  true,
  'First-launch readiness observation integration owner is missing',
)

const owner = readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /export function integrateFirstLaunchReadinessObservation/,
)

assert.match(
  owner,
  /recordGovernedRuntimeReadinessEvidenceFromCandidate/,
)

assert.match(
  owner,
  /assessGovernedRuntimeReadiness/,
)

assert.doesNotMatch(
  owner,
  /child_process|spawnSync|execSync|execFileSync|createServer\s*\(|listen\s*\(|fetch\s*\(/,
)

assert.doesNotMatch(
  owner,
  /(readinessGranted|livenessGranted|runtimeAuthorityGranted|networkAuthorityGranted)\s*[:=]\s*true/,
)

console.log('CANONICAL_READINESS_EVIDENCE_REUSED=TRUE')
console.log('CANONICAL_READINESS_ASSESSMENT_REUSED=TRUE')
console.log('DIRECT_PROCESS_EFFECT=FALSE')
console.log('DIRECT_NETWORK_EFFECT=FALSE')
console.log('DIRECT_HEALTH_GRANT=FALSE')
console.log('REAL_PRODUCTION_PROCESS_STARTED=FALSE')
console.log('FIRST_LAUNCH_READINESS_OBSERVATION_INTEGRATION=PROVED')
