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

type ExpectedMode = 'baseline' | 'cautious' | 'recovery'

type Scenario = {
  name: string
  message: string
  expectedMode: ExpectedMode
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

const scenarios: Scenario[] = [
  {
    name: 'baseline-analysis',
    message: 'Analise o estado operacional com segurança.',
    expectedMode: 'baseline',
    state: createState({}),
  },
  {
    name: 'baseline-implementation',
    message: 'Implemente uma alteração controlada.',
    expectedMode: 'baseline',
    state: createState({}),
  },
  {
    name: 'cautious-restricted-reflection',
    message: 'Analise o estado operacional com segurança.',
    expectedMode: 'cautious',
    state: createState({
      cycleCount: 3,
      lastExecutionAllowed: true,
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.82,
    }),
  },
  {
    name: 'cautious-low-consensus',
    message: 'Implemente uma alteração controlada.',
    expectedMode: 'cautious',
    state: createState({
      cycleCount: 4,
      lastExecutionAllowed: true,
      lastReflectionState: 'stable',
      lastConsensusRatio: 0.61,
    }),
  },
  {
    name: 'recovery-blocked-analysis',
    message: 'Analise o estado operacional com segurança.',
    expectedMode: 'recovery',
    state: createState({
      cycleCount: 5,
      lastExecutionAllowed: false,
      lastStopReason: 'blocked-by-authority',
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.55,
    }),
  },
  {
    name: 'recovery-blocked-implementation',
    message: 'Implemente uma alteração controlada.',
    expectedMode: 'recovery',
    state: createState({
      cycleCount: 6,
      lastExecutionAllowed: false,
      lastStopReason: 'blocked-by-authority',
      lastReflectionState: 'restricted',
      lastConsensusRatio: 0.48,
    }),
  },
]

const evaluations = scenarios.map((scenario) => {
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

  const repeatedPlan = adaptRuntimeTaskPlan(
    planRuntimeTask(
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
    ),
    scenario.state,
  )

  const structuralSignature = adaptivePlan.steps
    .map(
      (step) =>
        `${step.order}:${step.type}:${step.title}`,
    )
    .join('|')

  const repeatedSignature = repeatedPlan.steps
    .map(
      (step) =>
        `${step.order}:${step.type}:${step.title}`,
    )
    .join('|')

  const passed =
    adaptivePlan.adaptation.mode ===
      scenario.expectedMode &&
    structuralSignature === repeatedSignature

  return {
    name: scenario.name,
    expectedMode: scenario.expectedMode,
    actualMode: adaptivePlan.adaptation.mode,
    passed,
    stepCount: adaptivePlan.steps.length,
    structuralSignature,
    repeatable:
      structuralSignature === repeatedSignature,
  }
})

const totalScenarios = evaluations.length
const passedScenarios = evaluations.filter(
  (evaluation) => evaluation.passed,
).length

const approvalRate =
  totalScenarios === 0
    ? 0
    : passedScenarios / totalScenarios

const modeCoverage = {
  baseline: evaluations.filter(
    (evaluation) =>
      evaluation.actualMode === 'baseline',
  ).length,
  cautious: evaluations.filter(
    (evaluation) =>
      evaluation.actualMode === 'cautious',
  ).length,
  recovery: evaluations.filter(
    (evaluation) =>
      evaluation.actualMode === 'recovery',
  ).length,
}

const uniqueStructures = new Set(
  evaluations.map(
    (evaluation) =>
      evaluation.structuralSignature,
  ),
).size

const repeatabilityRate =
  evaluations.filter(
    (evaluation) => evaluation.repeatable,
  ).length / totalScenarios

assert.equal(totalScenarios, 6)
assert.equal(passedScenarios, 6)
assert.equal(approvalRate, 1)
assert.ok(modeCoverage.baseline > 0)
assert.ok(modeCoverage.cautious > 0)
assert.ok(modeCoverage.recovery > 0)
assert.ok(uniqueStructures >= 3)
assert.equal(repeatabilityRate, 1)

const metrics = {
  totalScenarios,
  passedScenarios,
  approvalRate,
  modeCoverage,
  uniqueStructures,
  repeatabilityRate,
  evaluations,
}

console.log(
  'OK: adaptive planning evaluation metrics validated.',
)

console.log(
  JSON.stringify(metrics, null, 2),
)
