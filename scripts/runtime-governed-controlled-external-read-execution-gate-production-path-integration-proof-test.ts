import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const routePath = path.join(
  process.cwd(),
  'app/api/chat/route.ts',
)

const route = fs.readFileSync(routePath, 'utf8')

const authorizationCall =
  'evaluateRuntimeToolControlledExternalReadAuthorizationBoundary'

const executionGateCall =
  'evaluateRuntimeToolControlledExternalReadExecutionGate'

assert.match(
  route,
  /runtime-tool-controlled-external-read-execution-gate/,
  'Controlled External Read Execution Gate owner must be imported into canonical /api/chat.',
)

assert.match(
  route,
  /evaluateRuntimeToolControlledExternalReadExecutionGate/,
  'Canonical /api/chat must evaluate the Controlled External Read Execution Gate.',
)

const authorizationIndex = route.indexOf(authorizationCall)
const executionGateIndex = route.indexOf(executionGateCall)

assert.ok(
  authorizationIndex >= 0,
  'Controlled External Read Authorization Boundary must already exist.',
)

assert.ok(
  executionGateIndex > authorizationIndex,
  'Execution Gate must be evaluated only after the Authorization Boundary.',
)

assert.match(
  route,
  /executionKey:\s*toolControlledExternalReadAuthorizationBoundary\.executionKey/,
  'Execution Gate must inherit executionKey from the authorization decision.',
)

assert.match(
  route,
  /correlationId:\s*toolControlledExternalReadAuthorizationBoundary\.correlationId/,
  'Execution Gate must inherit correlationId from the authorization decision.',
)

assert.match(
  route,
  /traceId:\s*toolControlledExternalReadAuthorizationBoundary\.traceId/,
  'Execution Gate must inherit traceId from the authorization decision.',
)

assert.match(
  route,
  /stepId:\s*toolControlledExternalReadAuthorizationBoundary\.stepId/,
  'Execution Gate must inherit stepId from the authorization decision.',
)

assert.match(
  route,
  /externalReadAuthorizationEvaluated:\s*toolControlledExternalReadAuthorizationBoundary\.externalReadAuthorizationEvaluated/,
  'Execution Gate must consume the canonical authorization-evaluated signal.',
)

assert.match(
  route,
  /externalReadAuthorized:\s*toolControlledExternalReadAuthorizationBoundary\.externalReadAuthorized/,
  'Execution Gate must consume the canonical authorization decision.',
)

for (const invariant of [
  'networkAccess',
  'externalReadApplied',
  'executionApplied',
  'mutationApplied',
  'providerInvocation',
]) {
  const pattern = new RegExp(
    `${invariant}:\\s*toolControlledExternalReadAuthorizationBoundary\\.${invariant}`,
  )

  assert.match(
    route,
    pattern,
    `Execution Gate must inherit ${invariant} from the authorization boundary.`,
  )
}

assert.doesNotMatch(
  route,
  /executeRuntimeToolControlledExternalReadEffect\s*\(/,
  'v287.38 must not invoke the real controlled external-read effect.',
)

console.log(
  'Runtime governed controlled external read execution gate production path integration proof passed.',
)

console.log({
  architecture:
    'governed-controlled-external-read-execution-gate-production-path-integration',
  authorizationBeforeExecutionGate: true,
  canonicalIdentityPropagation: true,
  canonicalAuthorizationPropagation: true,
  effectStatePropagation: true,
  responseContractExpansionRequired: false,
  networkEffectInvoked: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})
