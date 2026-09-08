import assert from 'node:assert/strict'
import fs from 'node:fs'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

const hasExternalReadTarget =
  route.includes('const externalReadTarget = body.externalReadTarget')

const hasActionPolicy =
  route.includes('const actionPolicy = evaluateRuntimeActionPolicy()')

const hasActionPolicyPauseMessage =
  route.includes('Execução bloqueada pela Runtime Action Policy.')

const hasUnscopedActionPolicyEarlyReturn =
  route.includes('if (!actionPolicy.allowExecution) {')

const hasExternalReadScopedActionPolicyHandoff =
  route.includes(
    'if (!actionPolicy.allowExecution && !externalReadTarget) {',
  )

assert.equal(hasExternalReadTarget, true)
assert.equal(hasActionPolicy, true)
assert.equal(hasActionPolicyPauseMessage, true)
assert.equal(hasUnscopedActionPolicyEarlyReturn, false)

assert.equal(
  hasExternalReadScopedActionPolicyHandoff,
  true,
  'RED: explicit external.read must reach its specialized governed policy chain.',
)

console.log({
  architecture:
    'decision-gate-handoff -> action-policy-handoff -> specialized-external-read-governance',
  hasExternalReadTarget,
  hasActionPolicy,
  hasUnscopedActionPolicyEarlyReturn,
  hasExternalReadScopedActionPolicyHandoff,
  networkAccessGrantedByHandoff: false,
  executionGrantedByHandoff: false,
})

console.log(
  'Runtime governed external read Action Policy handoff proof passed.',
)
