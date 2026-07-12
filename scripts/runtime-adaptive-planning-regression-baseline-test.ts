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

type NormalizedStep = {
  order: number
  title: string
  type: string
  required: boolean
  status: string
}

const createState = (
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

const normalizeSteps = (
  steps: ReturnType<typeof planRuntimeTask>['steps'],
): NormalizedStep[] =>
  steps.map(
    ({
      order,
      title,
      type,
      required,
      status,
    }) => ({
      order,
      title,
      type,
      required,
      status,
    }),
  )

const message =
  'Implemente uma alteração controlada e valide o resultado.'

const baselinePlan = adaptRuntimeTaskPlan(
  planRuntimeTask(message),
  createState({}),
)

const cautiousPlan = adaptRuntimeTaskPlan(
  planRuntimeTask(message),
  createState({
    cycleCount: 3,
    lastExecutionAllowed: true,
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.62,
  }),
)

const recoveryPlan = adaptRuntimeTaskPlan(
  planRuntimeTask(message),
  createState({
    cycleCount: 4,
    lastExecutionAllowed: false,
    lastStopReason: 'blocked-by-authority',
    lastReflectionState: 'restricted',
    lastConsensusRatio: 0.55,
  }),
)

const actualBaseline = {
  mode: baselinePlan.adaptation.mode,
  influenced: baselinePlan.adaptation.influenced,
  steps: normalizeSteps(baselinePlan.steps),
}

const actualCautious = {
  mode: cautiousPlan.adaptation.mode,
  influenced: cautiousPlan.adaptation.influenced,
  steps: normalizeSteps(cautiousPlan.steps),
}

const actualRecovery = {
  mode: recoveryPlan.adaptation.mode,
  influenced: recoveryPlan.adaptation.influenced,
  steps: normalizeSteps(recoveryPlan.steps),
}

const expectedBaseline = {
  mode: 'baseline',
  influenced: false,
  steps: [
    {
      order: 1,
      title: 'Analyze request and runtime context.',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      order: 2,
      title: 'Prepare controlled execution plan.',
      type: 'execution',
      required: true,
      status: 'ready',
    },
    {
      order: 3,
      title: 'Validate result through runtime checks.',
      type: 'validation',
      required: true,
      status: 'pending',
    },
    {
      order: 4,
      title: 'Synthesize final operational response.',
      type: 'synthesis',
      required: true,
      status: 'pending',
    },
  ],
}

const expectedCautious = {
  mode: 'cautious',
  influenced: true,
  steps: [
    {
      order: 1,
      title: 'Analyze request and runtime context.',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      order: 2,
      title:
        'Review previous operational risk and validate constraints.',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      order: 3,
      title:
        'Prepare controlled execution after additional validation.',
      type: 'execution',
      required: true,
      status: 'pending',
    },
    {
      order: 4,
      title:
        'Validate the execution result against risk and governance criteria.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
  ],
}

const expectedRecovery = {
  mode: 'recovery',
  influenced: true,
  steps: [
    {
      order: 1,
      title:
        'Analyze the previous blocked or restricted operation.',
      type: 'analysis',
      required: true,
      status: 'ready',
    },
    {
      order: 2,
      title:
        'Create an alternative route that avoids the previous failure condition.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
    {
      order: 3,
      title:
        'Revalidate authority, policy, and execution constraints.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
    {
      order: 4,
      title:
        'Execute the authorized alternative route with containment.',
      type: 'execution',
      required: true,
      status: 'pending',
    },
    {
      order: 5,
      title:
        'Verify recovery, integrity, and operational stability.',
      type: 'analysis',
      required: true,
      status: 'pending',
    },
  ],
}

assert.deepEqual(
  actualBaseline,
  expectedBaseline,
  'Baseline planning behavior changed unexpectedly.',
)

assert.deepEqual(
  actualCautious,
  expectedCautious,
  'Cautious planning behavior changed unexpectedly.',
)

assert.deepEqual(
  actualRecovery,
  expectedRecovery,
  'Recovery planning behavior changed unexpectedly.',
)

console.log(
  'OK: adaptive planning regression baseline preserved.',
)

console.log(
  JSON.stringify(
    {
      baseline: actualBaseline,
      cautious: actualCautious,
      recovery: actualRecovery,
    },
    null,
    2,
  ),
)
