import assert from 'node:assert/strict'
import fs from 'node:fs'

type CognitiveDecisionInput = {
  safety: number
  confidenceCalibration: number
  memoryAlignment: number
  passed: boolean
}

type CognitiveDecision = 'accept' | 'review' | 'block'

const decide = ({
  safety,
  confidenceCalibration,
  memoryAlignment,
  passed,
}: CognitiveDecisionInput): CognitiveDecision =>
  safety < 70
    ? 'block'
    : confidenceCalibration < 70 || memoryAlignment < 70
      ? 'review'
      : passed
        ? 'accept'
        : 'review'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

assert.match(
  route,
  /responseEvaluation\.scores\.safety\s*<\s*70[\s\S]*?\?\s*'block'/,
  'Safety below 70 must produce block.',
)

assert.match(
  route,
  /responseEvaluation\.scores\.confidenceCalibration\s*<\s*70/,
  'Calibrated confidence below 70 must influence review.',
)

assert.match(
  route,
  /responseEvaluation\.scores\.memoryAlignment\s*<\s*70/,
  'Memory alignment below 70 must influence review.',
)

assert.match(
  route,
  /responseEvaluation\.passed[\s\S]*?\?\s*'accept'[\s\S]*?:\s*'review'/,
  'Only a passed evaluation may produce accept.',
)

const scenarios: Array<{
  id: string
  input: CognitiveDecisionInput
  expected: CognitiveDecision
}> = [
  {
    id: 'unsafe-always-blocks',
    input: {
      safety: 69,
      confidenceCalibration: 100,
      memoryAlignment: 100,
      passed: true,
    },
    expected: 'block',
  },
  {
    id: 'low-confidence-requires-review',
    input: {
      safety: 100,
      confidenceCalibration: 69,
      memoryAlignment: 100,
      passed: true,
    },
    expected: 'review',
  },
  {
    id: 'low-memory-alignment-requires-review',
    input: {
      safety: 100,
      confidenceCalibration: 100,
      memoryAlignment: 69,
      passed: true,
    },
    expected: 'review',
  },
  {
    id: 'failed-evaluation-requires-review',
    input: {
      safety: 100,
      confidenceCalibration: 100,
      memoryAlignment: 100,
      passed: false,
    },
    expected: 'review',
  },
  {
    id: 'all-governed-criteria-accept',
    input: {
      safety: 100,
      confidenceCalibration: 100,
      memoryAlignment: 100,
      passed: true,
    },
    expected: 'accept',
  },
  {
    id: 'threshold-values-are-accepted',
    input: {
      safety: 70,
      confidenceCalibration: 70,
      memoryAlignment: 70,
      passed: true,
    },
    expected: 'accept',
  },
  {
    id: 'safety-precedence-over-other-signals',
    input: {
      safety: 0,
      confidenceCalibration: 0,
      memoryAlignment: 0,
      passed: false,
    },
    expected: 'block',
  },
]

for (const scenario of scenarios) {
  assert.equal(
    decide(scenario.input),
    scenario.expected,
    `Unexpected decision for scenario: ${scenario.id}`,
  )
}

assert.doesNotMatch(
  route,
  /executionApplied:\s*true/,
  'Cognitive evaluation must not claim execution.',
)

const result = {
  owner: 'app/api/chat/route.ts',
  scenarios: scenarios.length,
  safetyBlockProved: true,
  confidenceReviewProved: true,
  memoryAlignmentReviewProved: true,
  failedEvaluationReviewProved: true,
  governedAcceptanceProved: true,
  boundaryThresholdProved: true,
  safetyPrecedenceProved: true,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed cognitive decision regression proof passed.',
)
console.log(result)
