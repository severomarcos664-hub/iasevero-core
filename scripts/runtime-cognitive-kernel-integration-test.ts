import assert from 'node:assert/strict'
import { runRuntimeCognitiveKernel } from '../app/lib/runtime-core/runtime-cognitive-kernel-integration'

const report = runRuntimeCognitiveKernel({
  message: 'Validate the governed cognitive runtime integration.',
  userId: 'runtime-cognitive-kernel-test',
})

assert.equal(
  report.source,
  'runtime-cognitive-kernel-integration',
  'Unexpected cognitive kernel source.',
)

assert.ok(report.kernelId, 'Kernel ID was not generated.')
assert.ok(report.createdAt, 'Creation timestamp was not generated.')
assert.ok(report.stages.memory, 'Operational memory stage is missing.')
assert.ok(report.stages.planning, 'Planning stage is missing.')
assert.ok(report.stages.authority, 'Authority stage is missing.')
assert.ok(report.stages.reflection, 'Reflection stage is missing.')
assert.ok(report.stages.consolidation, 'Memory consolidation stage is missing.')

if (report.executionAllowed) {
  assert.ok(report.stages.execution, 'Authorized execution did not reach the Execution Bridge.')
  assert.equal(report.completed, true)
  assert.equal(report.stopReason, 'completed')
} else {
  assert.equal(report.stages.execution, null)
  assert.equal(report.completed, false)
  assert.equal(report.stopReason, 'blocked-by-authority')
}

assert.ok(
  report.reasoning.length >= 7,
  'Kernel reasoning must include the canonical learning evidence',
)

assert.ok(
  report.reasoning.some((entry) =>
    entry.startsWith('Previous learning cycles:')
  ),
  'Kernel reasoning must expose the previous learning cycle count',
)

console.log(JSON.stringify(report, null, 2))
console.log('OK: Runtime Cognitive Kernel integration completed under governance.')
