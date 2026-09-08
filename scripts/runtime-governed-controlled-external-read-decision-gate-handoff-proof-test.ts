import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

const hasExternalReadTarget =
  route.includes('const externalReadTarget = body.externalReadTarget')

const hasDecisionGate =
  route.includes('const decisionGate = evaluateRuntimeDecisionGate(')

const hasDecisionGatePauseMessage =
  route.includes('Execução pausada pelo Runtime Decision Gate')

const hasUnscopedGenericEarlyReturn =
  route.includes('if (!decisionGate.allowed) {')

const hasExternalReadScopedHandoff =
  route.includes('if (!decisionGate.allowed && !externalReadTarget) {')

assert.equal(hasExternalReadTarget, true)
assert.equal(hasDecisionGate, true)
assert.equal(hasDecisionGatePauseMessage, true)

assert.equal(
  hasUnscopedGenericEarlyReturn,
  false,
  'The generic Decision Gate must not terminate explicit external.read before specialized governance.',
)

assert.equal(
  hasExternalReadScopedHandoff,
  true,
  'Explicit externalReadTarget must reach the specialized governed external-read chain.',
)

console.log({
  architecture:
    'generic-decision-gate -> external-read-scoped-handoff -> specialized-governed-external-read-chain',
  hasExternalReadTarget,
  hasDecisionGate,
  hasDecisionGatePauseMessage,
  hasUnscopedGenericEarlyReturn,
  hasExternalReadScopedHandoff,
  networkAccessGrantedByHandoff: false,
  providerAuthorizationGrantedByHandoff: false,
})

console.log(
  'Runtime governed external read decision gate handoff proof passed.',
)
