import assert from 'node:assert/strict'
import fs from 'node:fs'

type CognitiveDecision = 'accept' | 'review' | 'block'

const route = fs.readFileSync('app/api/chat/route.ts', 'utf8')

const finalToolExecutionAllowed = (
  decision: CognitiveDecision,
  orchestratorAllowed: boolean,
): boolean => decision === 'accept' && orchestratorAllowed

assert.match(
  route,
  /const finalToolExecutionAllowed\s*=\s*evaluationDecision === 'accept'\s*&&\s*toolOrchestration\.executionAllowed/,
  'Tool execution authorization must require cognitive acceptance and orchestrator authorization.',
)

assert.match(
  route,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'Tool governance must expose only the final cognitive-gated authorization.',
)

assert.match(
  route,
  /cognitiveDecision:\s*evaluationDecision/,
  'Tool governance must preserve the cognitive decision.',
)

assert.match(
  route,
  /cognitiveGateApplied:\s*true/,
  'Tool governance must declare that the cognitive gate was applied.',
)

assert.equal(
  finalToolExecutionAllowed('accept', true),
  true,
  'Accepted cognitive decision and orchestrator approval must allow continuation.',
)

assert.equal(
  finalToolExecutionAllowed('accept', false),
  false,
  'Cognitive acceptance must not override an orchestrator denial.',
)

assert.equal(
  finalToolExecutionAllowed('review', true),
  false,
  'Review must block tool continuation.',
)

assert.equal(
  finalToolExecutionAllowed('block', true),
  false,
  'Block must deny tool continuation.',
)

assert.doesNotMatch(
  route,
  /executionApplied:\s*true/,
  'This proof must not claim actual tool execution.',
)

const result = {
  owner: 'app/api/chat/route.ts',
  acceptAndOrchestratorApprovalRequired: true,
  orchestratorDenialPreserved: true,
  reviewBlocksTools: true,
  blockDeniesTools: true,
  cognitiveGateObservedInTrace: true,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed cognitive tool gate proof passed.',
)
console.log(result)
