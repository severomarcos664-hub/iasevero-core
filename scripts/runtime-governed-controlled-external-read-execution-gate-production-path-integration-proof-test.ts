import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const routePath = path.join(
  process.cwd(),
  'app/api/chat/route.ts',
)

const route = fs.readFileSync(routePath, 'utf8')

assert.match(
  route,
  /runtime-tool-controlled-external-read-execution-gate/,
  'Controlled External Read Execution Gate must be imported into the canonical /api/chat production path.',
)

assert.match(
  route,
  /evaluateRuntimeToolControlledExternalReadExecutionGate/,
  'Canonical /api/chat must evaluate the Controlled External Read Execution Gate.',
)

assert.match(
  route,
  /externalReadExecutionEligible/,
  'Canonical /api/chat response must expose external-read execution eligibility.',
)

assert.doesNotMatch(
  route,
  /executeRuntimeToolControlledExternalReadEffect\s*\(/,
  'Canonical /api/chat must not invoke the real external-read effect in this version.',
)

console.log(
  'Runtime governed controlled external read execution gate production path integration proof passed.',
)
