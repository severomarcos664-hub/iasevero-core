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

type EvaluationScenario = {
  name: string
  message: string
  state: RuntimeCognitiveLearningState
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

const scenarios: EvaluationScenario[] = [
  {
    name: 'baseline-analysis',
    message:
      'Analise o estado operacional e produza uma recomendação segura.',
    state: createState({}),
  },
  {
    name: 'cautious-analysis',
    message:
      'Analise o estado operacional e produza uma recomendação segura.',
    state: createState({
      cycleCount: 3,
      lastExecutionAllowed: true,
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.62,
    }),
  },
  {
    name: 'recovery-analysis',
    message:
      'Analise o estado operacional e produza uma recomendação segura.',
    state: createState({
      cycleCount: 4,
      lastExecutionAllowed: false,
      lastStopReason: 'blocked-by-authority',
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.55,
    }),
  },
  {
    name: 'baseline-implementation',
    message:
      'Implemente uma alteração controlada e valide o resultado.',
    state: createState({}),
  },
  {
    name: 'recovery-implementation',
    message:
      'Implemente uma alteração controlada e valide o resultado.',
    state: createState({
      cycleCount: 7,
      lastExecutionAllowed: false,
      lastStopReason: 'blocked-by-authority',
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.48,
    }),
  },
]

const results = scenarios.map((scenario) => {
  const basePlan = planRuntimeTask(
    scenario.message,
    {
      cycleCount: scenario.state.cycleCount,
      lastExecutionAllowed:
        scenario.state.lastExecutionAllowed,
      lastRecommendation:
        scenario.state.lastRecommendation,
      lastReflectionState:
        scenario.state.lastReflectionState,
      lastConsensusRatio:
        scenario.state.lastConsensusRatio,
    },
  )

  const adaptivePlan = adaptRuntimeTaskPlan(
    basePlan,
    scenario.state,
  )

  return {
    scenario: scenario.name,
    intent: adaptivePlan.intent,
    mode: adaptivePlan.adaptation.mode,
    influenced: adaptivePlan.adaptation.influenced,
    stepCount: adaptivePlan.steps.length,
    orders: adaptivePlan.steps.map(
      (step) => step.order,
    ),
    types: adaptivePlan.steps.map(
      (step) => step.type,
    ),
    titles: adaptivePlan.steps.map(
      (step) => step.title,
    ),
    recommendation: adaptivePlan.recommendation,
    adaptiveReasons:
      adaptivePlan.adaptation.reasons,
  }
})

const byName = Object.fromEntries(
  results.map((result) => [
    result.scenario,
    result,
  ]),
)

assert.equal(
  byName['baseline-analysis'].mode,
  'baseline',
)

assert.equal(
  byName['cautious-analysis'].mode,
  'cautious',
)

assert.equal(
  byName['recovery-analysis'].mode,
  'recovery',
)

assert.equal(
  byName['baseline-analysis'].influenced,
  false,
)

assert.equal(
  byName['cautious-analysis'].influenced,
  true,
)

assert.equal(
  byName['recovery-analysis'].influenced,
  true,
)

assert.notEqual(
  byName['baseline-analysis'].stepCount,
  byName['cautious-analysis'].stepCount,
)

assert.notEqual(
  byName['cautious-analysis'].stepCount,
  byName['recovery-analysis'].stepCount,
)

assert.notDeepEqual(
  byName['baseline-analysis'].titles,
  byName['cautious-analysis'].titles,
)

assert.notDeepEqual(
  byName['cautious-analysis'].titles,
  byName['recovery-analysis'].titles,
)

assert.notEqual(
  byName['baseline-analysis'].recommendation,
  byName['recovery-analysis'].recommendation,
)

assert.notDeepEqual(
  byName['baseline-implementation'].titles,
  byName['recovery-implementation'].titles,
)

assert.deepEqual(
  byName['baseline-analysis'].orders,
  [...byName['baseline-analysis'].orders]
    .sort((a, b) => a - b),
)

assert.deepEqual(
  byName['cautious-analysis'].orders,
  [...byName['cautious-analysis'].orders]
    .sort((a, b) => a - b),
)

assert.deepEqual(
  byName['recovery-analysis'].orders,
  [...byName['recovery-analysis'].orders]
    .sort((a, b) => a - b),
)

const repeatBase = adaptRuntimeTaskPlan(
  planRuntimeTask(
    scenarios[0].message,
  ),
  scenarios[0].state,
)

assert.deepEqual(
  repeatBase.steps.map(
    ({ order, title, type }) => ({
      order,
      title,
      type,
    }),
  ),
  byName['baseline-analysis'].titles.map(
    (title, index) => ({
      order:
        byName['baseline-analysis']
          .orders[index],
      title,
      type:
        byName['baseline-analysis']
          .types[index],
    }),
  ),
)

console.log(
  'OK: adaptive planning produces measurable behavioral differences.',
)

console.log(
  JSON.stringify(
    {
      evaluatedScenarios: results.length,
      results,
    },
    null,
    2,
  ),
)
