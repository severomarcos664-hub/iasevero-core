import assert from 'node:assert/strict'
import fs from 'node:fs'

const owner = 'app/api/chat/route.ts'
const route = fs.readFileSync(owner, 'utf8')

const locate = (pattern: RegExp, label: string): number => {
  const match = pattern.exec(route)

  assert.ok(
    match?.index !== undefined,
    `Required canonical stage not found: ${label}`,
  )

  return match.index
}

const decisionEngineIndex = locate(
  /executeRuntimeDecisionEngine\s*\(/,
  'runtime decision engine',
)

const decisionGateIndex = locate(
  /evaluateRuntimeDecisionGate\s*\(/,
  'runtime decision gate',
)

const actionPolicyIndex = locate(
  /evaluateRuntimeActionPolicy\s*\(/,
  'runtime action policy',
)

const coreIndex = locate(
  /(?:await\s+)?iaseveroCore\s*\(/,
  'IASevero core',
)

const responseEvaluationIndex = locate(
  /const\s+responseEvaluation\s*=\s*evaluateRuntimeResponseCase\s*\(/,
  'response evaluation',
)

const cognitiveDecisionIndex = locate(
  /const\s+evaluationDecision\s*=/,
  'cognitive decision',
)

const toolOrchestrationIndex = locate(
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'tool orchestration',
)

const cognitiveToolGateIndex = locate(
  /const\s+finalToolExecutionAllowed\s*=/,
  'cognitive tool continuation gate',
)

const traceIndex = locate(
  /const\s+traceResponse\s*=\s*createRuntimeTraceNode\s*\(/,
  'response trace',
)

const responseIndex = locate(
  /return\s+NextResponse\.json\s*\(/,
  'HTTP response',
)

assert.ok(
  decisionEngineIndex < decisionGateIndex,
  'Decision Engine must precede Decision Gate.',
)

assert.ok(
  decisionGateIndex < actionPolicyIndex,
  'Decision Gate must precede Action Policy.',
)

assert.ok(
  actionPolicyIndex < coreIndex,
  'Pre-generation governance must precede IASevero Core.',
)

assert.ok(
  coreIndex < responseEvaluationIndex,
  'Response evaluation must occur after the response is generated.',
)

assert.ok(
  responseEvaluationIndex < cognitiveDecisionIndex,
  'Response evaluation must precede the cognitive decision.',
)

assert.ok(
  cognitiveDecisionIndex < toolOrchestrationIndex,
  'Cognitive decision must precede post-generation tool governance.',
)

assert.ok(
  toolOrchestrationIndex < cognitiveToolGateIndex,
  'Tool orchestration evidence must exist before final tool authorization.',
)

assert.ok(
  cognitiveToolGateIndex < traceIndex,
  'The cognitive tool gate must be preserved in the response trace.',
)

assert.ok(
  traceIndex < responseIndex,
  'Response trace must be created before the HTTP response.',
)

assert.match(
  route,
  /const\s+finalToolExecutionAllowed\s*=\s*evaluationDecision\s*===\s*'accept'\s*&&\s*toolOrchestration\.executionAllowed/,
  'Final tool continuation must require cognitive acceptance and orchestrator authorization.',
)

assert.match(
  route,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'Trace-visible tool governance must expose the final gated authorization.',
)

assert.match(
  route,
  /cognitiveDecision:\s*evaluationDecision/,
  'Tool governance must preserve the cognitive decision.',
)

assert.match(
  route,
  /cognitiveGateApplied:\s*true/,
  'Tool governance must declare the cognitive gate.',
)

assert.doesNotMatch(
  route,
  /(?:dispatchRuntimeTool|executeRuntimeTool|toolDispatcher)\s*\(/,
  'The API route must not claim real tool execution in this proof.',
)

assert.doesNotMatch(
  route,
  /executionApplied:\s*true/,
  'The API route must not claim that execution was applied.',
)

const preGenerationStages = [
  'runtime-decision-engine',
  'runtime-decision-gate',
  'runtime-action-policy',
  'iasevero-core',
] as const

const postGenerationStages = [
  'response-evaluation',
  'cognitive-decision',
  'tool-orchestration',
  'cognitive-tool-continuation-gate',
  'response-trace',
  'http-response',
] as const

const result = {
  owner,
  architecture: 'governed-cognitive-two-phase-chain',
  preGenerationStages,
  postGenerationStages,
  preGenerationGovernanceProved: true,
  postGenerationEvaluationProved: true,
  cognitiveToolContinuationGateProved: true,
  phaseBoundaryProved: true,
  planningGateClaimed: false,
  realToolExecutionClaimed: false,
  externalProviderRequired: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed cognitive two-phase chain proof passed.',
)
console.log(result)
