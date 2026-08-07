import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiPath = 'app/api/chat/route.ts'
const gatePath = 'app/lib/runtime-core/runtime-decision-gate.ts'
const dispatcherPath = 'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const api = readFileSync(apiPath, 'utf8')
const gate = readFileSync(gatePath, 'utf8')
const dispatcher = readFileSync(dispatcherPath, 'utf8')

assert.match(
  api,
  /const\s+decisionGate\s*=\s*evaluateRuntimeDecisionGate\s*\(/,
  'The API must obtain a governed runtime decision gate result.',
)

assert.match(
  api,
  /executionAllowed:\s*decisionGate\.allowed/,
  'The cognitive execution signal must derive from decisionGate.allowed.',
)

assert.match(
  api,
  /const\s+evaluationDecision\s*=/,
  'The API must evaluate the generated response before tool authorization.',
)

assert.match(
  api,
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'The API must obtain governed tool orchestration before tool authorization.',
)

assert.match(
  api,
  /const\s+finalToolExecutionAllowed\s*=\s*evaluationDecision\s*===\s*['"]accept['"]\s*&&\s*toolOrchestration\.executionAllowed/,
  'Final tool authorization must require both accepted evaluation and tool orchestration authorization.',
)

assert.match(
  api,
  /finalAuthorization:\s*finalToolExecutionAllowed/,
  'The governed dispatch handoff must consume the final tool authorization.',
)

assert.match(
  api,
  /governance:\s*toolOrchestration\.executionAllowed\s*\?\s*['"]approved['"]\s*:\s*['"]denied['"]/,
  'The governed handoff must preserve tool-orchestrator governance state.',
)

assert.doesNotMatch(
  api,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not directly execute the Runtime Tool Dispatcher.',
)

assert.doesNotMatch(
  api,
  /dispatchApplied:\s*true/,
  'The API must not claim real dispatch application.',
)

assert.doesNotMatch(
  api,
  /executionApplied:\s*true/,
  'The API must not claim real execution application.',
)

assert.doesNotMatch(
  api,
  /mutationApplied:\s*true/,
  'The API must not claim mutation application.',
)

assert.match(
  gate,
  /allowed/,
  'The Runtime Decision Gate must expose its governed allowed signal.',
)

assert.match(
  dispatcher,
  /finalAuthorization/,
  'The dispatcher handoff contract must consume final authorization.',
)

assert.match(
  dispatcher,
  /dispatchApplied:\s*false/,
  'The governed handoff must preserve dispatchApplied=false.',
)

assert.match(
  dispatcher,
  /executionApplied:\s*false/,
  'The governed handoff must preserve executionApplied=false.',
)

assert.match(
  dispatcher,
  /mutationApplied:\s*false/,
  'The governed handoff must preserve mutationApplied=false.',
)

const result = {
  architecture: 'governed-authority-propagation',
  decisionGateOwnsCognitivePermission: true,
  responseEvaluationPrecedesToolAuthorization: true,
  toolOrchestratorContributesToolAuthorization: true,
  finalToolAuthorizationIsExplicit: true,
  finalToolAuthorizationConsumedByHandoff: true,
  apiDoesNotDispatch: true,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed authority propagation proof passed.',
)

console.log(result)
