import assert from 'node:assert/strict'

import {
  adaptRuntimeTaskPlan,
} from '../app/lib/runtime-core/runtime-adaptive-planning-policy'

import {
  planRuntimeTask,
} from '../app/lib/runtime-core/runtime-task-planner'

import type {
  RuntimeCognitiveLearningState,
} from '../app/lib/runtime-cognitive-learning/runtime-cognitive-learning-state'

const message =
  'Execute uma operação governada e valide o resultado.'

const createLearningState = (
  overrides: Partial<RuntimeCognitiveLearningState>,
): RuntimeCognitiveLearningState => ({
  version: 1,
  cycleCount: 0,
  lastKernelId: null,
  lastCorrelationId: null,
  lastExecutionAllowed: null,
  lastStopReason: null,
  lastRecommendation: null,
  lastReflectionState: null,
  lastConsensusRatio: null,
  updatedAt: null,
  ...overrides,
})

const originalPlan = planRuntimeTask(message)

const baseline = adaptRuntimeTaskPlan(
  originalPlan,
  createLearningState({}),
)

assert.equal(
  baseline.adaptation.mode,
  'baseline',
)

assert.deepEqual(
  baseline.steps,
  originalPlan.steps,
)

const cautious = adaptRuntimeTaskPlan(
  originalPlan,
  createLearningState({
    cycleCount: 3,
    lastExecutionAllowed: true,
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.62,
  }),
)

assert.equal(
  cautious.adaptation.mode,
  'cautious',
)

assert.equal(
  cautious.steps.length,
  4,
)

assert.deepEqual(
  cautious.steps.map((step) => step.order),
  [1, 2, 3, 4],
)

assert.ok(
  cautious.steps.some(
    (step) =>
      step.id.endsWith('-risk-review'),
  ),
)

assert.ok(
  cautious.steps.some(
    (step) =>
      step.id.endsWith('-post-validation'),
  ),
)

const recovery = adaptRuntimeTaskPlan(
  originalPlan,
  createLearningState({
    cycleCount: 4,
    lastExecutionAllowed: false,
    lastStopReason: 'blocked-by-authority',
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.55,
  }),
)

assert.equal(
  recovery.adaptation.mode,
  'recovery',
)

assert.equal(
  recovery.steps.length,
  5,
)

assert.deepEqual(
  recovery.steps.map((step) => step.order),
  [1, 2, 3, 4, 5],
)

assert.ok(
  recovery.steps.some(
    (step) =>
      step.id.endsWith('-failure-analysis'),
  ),
)

assert.ok(
  recovery.steps.some(
    (step) =>
      step.id.endsWith('-authority-revalidation'),
  ),
)

assert.ok(
  recovery.steps.some(
    (step) =>
      step.id.endsWith('-contained-execution'),
  ),
)

assert.ok(
  recovery.steps.some(
    (step) =>
      step.id.endsWith('-recovery-verification'),
  ),
)

assert.notDeepEqual(
  baseline.steps,
  cautious.steps,
)

assert.notDeepEqual(
  cautious.steps,
  recovery.steps,
)

console.log(
  'OK: adaptive learning changes the canonical plan structure.',
)

console.log(
  JSON.stringify(
    {
      baseline: baseline.steps.map(
        ({ order, title, type }) => ({
          order,
          title,
          type,
        }),
      ),
      cautious: cautious.steps.map(
        ({ order, title, type }) => ({
          order,
          title,
          type,
        }),
      ),
      recovery: recovery.steps.map(
        ({ order, title, type }) => ({
          order,
          title,
          type,
        }),
      ),
    },
    null,
    2,
  ),
)
