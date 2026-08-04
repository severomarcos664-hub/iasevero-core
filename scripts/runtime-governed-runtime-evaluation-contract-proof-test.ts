import assert from 'node:assert/strict'
import fs from 'node:fs'

const apiOwner = 'app/api/chat/route.ts'

const apiRoute = fs.readFileSync(apiOwner, 'utf8')

function locate(pattern: RegExp, label: string): number {
  const match = pattern.exec(apiRoute)

  assert.ok(
    match,
    `Required runtime evaluation contract stage not found: ${label}`,
  )

  return match.index
}

const responseEvaluationIndex = locate(
  /const\s+responseEvaluation\s*=\s*evaluateRuntimeResponseCase\s*\(/,
  'response evaluation',
)

const evaluationDecisionIndex = locate(
  /const\s+evaluationDecision\s*=/,
  'evaluation decision',
)

const toolOrchestrationIndex = locate(
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'tool orchestration',
)

const finalToolExecutionAllowedIndex = locate(
  /const\s+finalToolExecutionAllowed\s*=/,
  'final tool execution decision',
)

const toolGovernanceIndex = locate(
  /const\s+toolGovernance\s*=/,
  'tool governance contract',
)

const traceResponseIndex = locate(
  /const\s+traceResponse\s*=\s*createRuntimeTraceNode\s*\(/,
  'response trace',
)

const finalResponseIndex = apiRoute.indexOf(
  'return NextResponse.json({',
  traceResponseIndex,
)

assert.ok(
  finalResponseIndex >= 0,
  'The final HTTP response after response trace must exist.',
)

const orderedStages = [
  {
    label: 'response evaluation',
    index: responseEvaluationIndex,
  },
  {
    label: 'evaluation decision',
    index: evaluationDecisionIndex,
  },
  {
    label: 'tool orchestration',
    index: toolOrchestrationIndex,
  },
  {
    label: 'final tool execution decision',
    index: finalToolExecutionAllowedIndex,
  },
  {
    label: 'tool governance contract',
    index: toolGovernanceIndex,
  },
  {
    label: 'response trace',
    index: traceResponseIndex,
  },
  {
    label: 'final HTTP response',
    index: finalResponseIndex,
  },
]

for (let index = 1; index < orderedStages.length; index += 1) {
  const previous = orderedStages[index - 1]
  const current = orderedStages[index]

  assert.ok(
    previous.index < current.index,
    `Invalid runtime evaluation contract order: ${previous.label} must precede ${current.label}`,
  )
}

assert.match(
  apiRoute,
  /const\s+finalToolExecutionAllowed\s*=\s*evaluationDecision\s*===\s*['"]accept['"]\s*&&\s*toolOrchestration\.executionAllowed/,
  'Tool execution must require both an accepted evaluation decision and tool orchestration authorization.',
)

assert.match(
  apiRoute,
  /executionApplied:\s*false/,
  'The evaluation contract must not falsely claim that execution was applied.',
)

assert.match(
  apiRoute,
  /cognitiveDecision:\s*evaluationDecision/,
  'Tool governance must preserve the cognitive evaluation decision.',
)

assert.match(
  apiRoute,
  /decision:\s*evaluationDecision/,
  'The final API response must expose the evaluation decision.',
)

const result = {
  owner: apiOwner,
  architecture: 'governed-runtime-evaluation-contract',
  stages: orderedStages.map(({ label }) => label),
  ordered: true,
  evaluationRequiredBeforeToolGate: true,
  acceptedEvaluationRequiredForToolExecution: true,
  toolGovernancePreserved: true,
  traceBeforeResponse: true,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed evaluation contract proof passed.',
)

console.log(result)
