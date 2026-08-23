import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const owner = path.join(
  process.cwd(),
  'app/lib/orchestrator/runtime-tool-controlled-external-read-execution-gate.ts',
)

assert.equal(
  fs.existsSync(owner),
  true,
  'Controlled External Read Execution Gate owner must exist.',
)

const source = fs.readFileSync(owner, 'utf8')

assert.match(
  source,
  /externalReadAuthorized/,
  'External Read Execution Gate must consume external-read authorization.',
)

assert.match(
  source,
  /externalReadExecutionEligible/,
  'External Read Execution Gate must expose execution eligibility.',
)

assert.match(
  source,
  /executionApplied:\s*false/,
  'Execution Gate must not execute effects.',
)

assert.match(
  source,
  /externalReadApplied:\s*false/,
  'Execution Gate must not apply external reads.',
)

assert.match(
  source,
  /networkAccess:\s*false/,
  'Execution Gate must not access the network.',
)

assert.match(
  source,
  /mutationApplied:\s*false/,
  'Execution Gate must not apply mutation.',
)

assert.match(
  source,
  /providerInvocation:\s*false/,
  'Execution Gate must not invoke a provider.',
)

assert.doesNotMatch(
  source,
  /\bfetch\s*\(/,
  'Execution Gate must not perform network access.',
)

assert.doesNotMatch(
  source,
  /executeRuntimeToolControlledExternalReadEffect/,
  'Execution Gate must not invoke the external-read effect.',
)

console.log(
  'Runtime governed controlled external read execution gate proof passed.',
)
