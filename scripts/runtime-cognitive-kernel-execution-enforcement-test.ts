import assert from 'node:assert/strict'

import {
  runRuntimeCognitiveKernel,
} from '../app/lib/runtime-core/runtime-cognitive-kernel-integration'

const report = runRuntimeCognitiveKernel({
  message:
    'Execute uma operação controlada seguindo o plano canônico.',
  userId: 'kernel-enforcement-test-user',
})

const enforcement =
  report.stages.executionEnforcement

assert.ok(
  enforcement.initialState.steps.length > 0,
  'Kernel must create the canonical execution state.',
)

assert.equal(
  enforcement.preExecutionDecision
    .executionAllowed,
  true,
  'Kernel must reach an allowed execution step.',
)

assert.equal(
  enforcement.preExecutionDecision
    .currentStep?.type,
  'execution',
  'The released step must be the canonical execution step.',
)

if (report.stages.authority.executionAllowed) {
  assert.ok(
    report.stages.execution,
    'Authorized execution must call the Execution Bridge.',
  )

  assert.equal(
    enforcement.finalDecision.reason,
    'plan-completed',
    'Authorized cycle must complete all canonical steps.',
  )

  assert.equal(
    enforcement.finalState.steps.every(
      (step) => step.status === 'completed',
    ),
    true,
    'All canonical steps must be completed after the cycle.',
  )
} else {
  assert.equal(
    report.stages.execution,
    null,
    'Blocked authority must prevent bridge execution.',
  )

  assert.notEqual(
    enforcement.finalDecision.reason,
    'plan-completed',
    'Blocked execution must not report a completed plan.',
  )
}

assert.ok(
  report.reasoning.some(
    (entry) =>
      entry.startsWith(
        'Execution enforcement preReason=',
      ),
  ),
  'Kernel reasoning must expose the enforcement decision.',
)

assert.ok(
  report.reasoning.some(
    (entry) =>
      entry.startsWith(
        'Execution enforcement finalReason=',
      ),
  ),
  'Kernel reasoning must expose the final enforcement state.',
)

console.log(
  'OK: Cognitive Kernel execution enforcement integration validated.',
)

console.log(
  JSON.stringify(
    {
      authorityAllowed:
        report.stages.authority.executionAllowed,
      executionPerformed:
        report.stages.execution !== null,
      preExecutionReason:
        enforcement.preExecutionDecision.reason,
      preExecutionStep:
        enforcement.preExecutionDecision
          .currentStep?.type ?? null,
      finalReason:
        enforcement.finalDecision.reason,
      finalStatuses:
        enforcement.finalState.steps.map(
          ({ order, status }) => ({
            order,
            status,
          }),
        ),
    },
    null,
    2,
  ),
)
