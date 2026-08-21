import assert from 'node:assert/strict'
import fs from 'node:fs'

const api = fs.readFileSync('app/api/chat/route.ts', 'utf8')

assert.match(
  api,
  /runtime-tool-controlled-external-read-authorization-boundary/,
  'Controlled External Read Authorization Boundary must be imported into canonical /api/chat production path.',
)

assert.match(
  api,
  /evaluateRuntimeToolControlledExternalReadAuthorizationBoundary\s*\(/,
  'Controlled External Read Authorization Boundary must be evaluated in canonical /api/chat production path.',
)

assert.match(
  api,
  /externalReadBoundaryEvaluated\s*:\s*toolControlledExternalReadIntegrationBoundary\.externalReadBoundaryEvaluated/,
  'Authorization must consume canonical Integration Boundary evaluation.',
)

assert.match(
  api,
  /externalReadEligible\s*:\s*toolControlledExternalReadIntegrationBoundary\.externalReadEligible/,
  'Authorization must consume canonical Integration Boundary eligibility.',
)

assert.match(
  api,
  /finalAuthorization\s*:\s*finalToolExecutionAllowed/,
  'Authorization must consume canonical final tool authorization.',
)

assert.doesNotMatch(
  api,
  /executeRuntimeToolControlledExternalReadEffect\s*\(/,
  'Authorization integration must not invoke external-read effect.',
)

console.log(
  'Runtime governed controlled external read authorization production path integration proof passed.',
)
