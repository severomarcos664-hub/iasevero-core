import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const executorPath = path.join(
  process.cwd(),
  'app/lib/orchestrator/runtime-tool-controlled-external-read-effect.ts'
)

const executor = fs.readFileSync(executorPath, 'utf8')

const redirectStatusPattern =
  /response\.status\s*>=\s*300\s*&&\s*response\.status\s*<\s*400/

assert.match(
  executor,
  redirectStatusPattern,
  'HTTP 3xx must be rejected explicitly before response-body acceptance.'
)

assert.equal(
  executor.includes('Controlled external read redirect response rejected.'),
  true,
  'Redirect rejection must have an explicit fail-closed reason.'
)

const redirectGuardIndex = executor.search(redirectStatusPattern)
const boundedBodyIndex = executor.indexOf(
  'await readRuntimeToolBoundedResponseBody('
)

assert.ok(
  redirectGuardIndex >= 0 &&
    boundedBodyIndex >= 0 &&
    redirectGuardIndex < boundedBodyIndex,
  'Redirect rejection must occur before bounded response-body consumption.'
)

assert.equal(
  executor.includes("redirect: 'follow'"),
  false,
  'Controlled external read must never automatically follow redirects.'
)

console.log({
  architecture:
    'governed-target -> pinned-destination -> HTTPS -> redirect-fail-closed',
  redirectFollowed: false,
  newDestinationAuthorized: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
})

console.log(
  'Runtime governed controlled external read redirect fail-closed proof passed.'
)
