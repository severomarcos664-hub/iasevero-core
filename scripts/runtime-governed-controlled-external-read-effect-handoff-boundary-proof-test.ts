import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const ownerPath = path.join(
  process.cwd(),
  'app/lib/orchestrator/runtime-tool-controlled-external-read-effect-handoff-boundary.ts',
)

assert.equal(
  fs.existsSync(ownerPath),
  true,
  'Controlled External Read Effect Handoff Boundary owner must exist.',
)

const owner = fs.readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /RuntimeToolControlledExternalReadExecutionGateDecision/,
  'Handoff must consume the canonical Execution Gate decision.',
)

assert.match(
  owner,
  /externalReadExecutionEligible/,
  'Handoff must preserve execution-gate eligibility.',
)

assert.match(
  owner,
  /effectHandoffPrepared/,
  'Handoff must explicitly represent preparation for the next boundary.',
)

assert.match(
  owner,
  /networkAccess:\s*false/,
  'Handoff must not grant network access.',
)

assert.match(
  owner,
  /externalReadApplied:\s*false/,
  'Handoff must not apply the external read.',
)

assert.match(
  owner,
  /executionApplied:\s*false/,
  'Handoff must not claim execution.',
)

assert.match(
  owner,
  /mutationApplied:\s*false/,
  'Handoff must not apply mutation.',
)

assert.match(
  owner,
  /providerInvocation:\s*false/,
  'Handoff must not invoke a provider.',
)

assert.doesNotMatch(
  owner,
  /\bfetch\s*\(/,
  'Handoff must not perform network effects.',
)

assert.doesNotMatch(
  owner,
  /executeRuntimeToolControlledExternalReadEffect\s*\(/,
  'Handoff must not invoke the Controlled External Read Effect.',
)

console.log(
  'Runtime governed controlled external read effect handoff boundary proof passed.',
)
