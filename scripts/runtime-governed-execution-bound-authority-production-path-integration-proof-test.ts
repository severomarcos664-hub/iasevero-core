import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/chat/route.ts', 'utf8')

assert.match(
  route,
  /runtime-execution-bound-authority/,
  'production route must import the canonical execution-bound authority owner',
)

assert.match(
  route,
  /evaluateRuntimeExecutionBoundAuthority/,
  'production route must evaluate execution-bound authority',
)

assert.match(
  route,
  /executionKey:\s*effectiveExecutionKey/,
  'execution-bound authority must use the canonical effective execution identity',
)

assert.match(
  route,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'execution-bound authority must consume the canonical final tool execution authority',
)

assert.match(
  route,
  /const\s+executionBoundAuthority\s*=\s*evaluateRuntimeExecutionBoundAuthority/,
  'production path must retain the canonical execution-bound authority decision object',
)

assert.match(
  route,
  /executionBoundAuthority\s*,/,
  'production response must expose the canonical execution-bound authority decision object',
)

assert.doesNotMatch(
  route,
  /evaluateRuntimeExecutionBoundAuthority[\s\S]{0,1200}\bfetch\s*\(/,
  'execution-bound authority integration must not directly perform network access',
)

console.log(
  'RUNTIME_GOVERNED_EXECUTION_BOUND_AUTHORITY_PRODUCTION_PATH_INTEGRATION_PROOF_PASS',
)
