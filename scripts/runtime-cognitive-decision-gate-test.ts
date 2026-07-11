import assert from 'node:assert/strict'
import { evaluateRuntimeDecisionGate } from '../app/lib/runtime-core/runtime-decision-gate'

const report = evaluateRuntimeDecisionGate(
  'Validate the canonical governed cognitive decision path.',
  'runtime-cognitive-decision-gate-test',
)

assert.equal(typeof report.allowed, 'boolean')
assert.equal(typeof report.reason, 'string')
assert.ok(report.reason.length > 0)
assert.equal(typeof report.operationalState, 'string')
assert.equal(typeof report.governance, 'string')
assert.equal(typeof report.integrity, 'string')
assert.equal(typeof report.healing, 'string')
assert.equal(typeof report.recovery, 'string')
assert.ok(report.correlationId)

if (report.allowed) {
  assert.equal(
    report.reason,
    'runtime execution approved by governed cognitive kernel',
  )
} else {
  assert.ok(
    report.reason.includes('blocked'),
    'Blocked decision must expose an explicit reason.',
  )
}

console.log(JSON.stringify(report, null, 2))
console.log(
  'OK: Runtime Decision Gate is consolidated through the Cognitive Kernel.',
)
