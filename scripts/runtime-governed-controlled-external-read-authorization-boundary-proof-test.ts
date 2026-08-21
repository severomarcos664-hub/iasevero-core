import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const owner =
  'app/lib/orchestrator/runtime-tool-controlled-external-read-authorization-boundary.ts'

const integrationBoundary =
  'app/lib/orchestrator/runtime-tool-controlled-external-read-integration-boundary.ts'

const effectOwner =
  'app/lib/orchestrator/runtime-tool-controlled-external-read-effect.ts'

assert.equal(
  fs.existsSync(owner),
  true,
  'Controlled External Read Authorization Boundary owner must exist.',
)

const source = fs.readFileSync(owner, 'utf8')

assert.match(
  source,
  /externalReadAuthorizationEvaluated/,
  'Authorization boundary must explicitly expose authorization evaluation.',
)

assert.match(
  source,
  /externalReadAuthorized/,
  'Authorization boundary must explicitly expose authorization decision.',
)

assert.match(
  source,
  /networkAccess:\s*false/,
  'Authorization must not grant network access.',
)

assert.match(
  source,
  /externalReadApplied:\s*false/,
  'Authorization must not apply external read.',
)

assert.match(
  source,
  /executionApplied:\s*false/,
  'Authorization must not apply execution.',
)

assert.match(
  source,
  /mutationApplied:\s*false/,
  'Authorization must not apply mutation.',
)

assert.match(
  source,
  /providerInvocation:\s*false/,
  'Authorization must not invoke providers.',
)

assert.doesNotMatch(
  source,
  /executeRuntimeToolControlledExternalReadEffect/,
  'Authorization boundary must not invoke the external-read effect.',
)

assert.doesNotMatch(
  source,
  /\bfetch\s*\(/,
  'Authorization boundary must not perform network access.',
)

assert.match(
  source,
  /finalAuthorization/,
  'External-read authorization must consume upstream final authorization.',
)

assert.match(
  source,
  /externalReadEligible/,
  'External-read authorization must consume external-read eligibility.',
)

assert.match(
  source,
  /externalReadEligible[\s\S]*finalAuthorization|finalAuthorization[\s\S]*externalReadEligible/,
  'Authorization must require both external-read eligibility and upstream final authorization.',
)

assert.equal(
  fs.existsSync(integrationBoundary),
  true,
  'Existing external-read integration boundary must remain present.',
)

assert.equal(
  fs.existsSync(effectOwner),
  true,
  'Existing external-read effect owner must remain present.',
)

const effect = fs.readFileSync(effectOwner, 'utf8')

assert.match(
  effect,
  /executeRuntimeToolControlledExternalReadEffect/,
  'Real external-read effect must remain isolated in its canonical owner.',
)

console.log(
  JSON.stringify(
    {
      architecture:
        'governed-controlled-external-read-authorization-boundary',
      externalReadAuthorizationEvaluated: true,
      externalReadAuthorized: false,
      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
      providerInvocation: false,
    },
    null,
    2,
  ),
)

console.log(
  'Runtime governed controlled external read authorization boundary proof passed.',
)
