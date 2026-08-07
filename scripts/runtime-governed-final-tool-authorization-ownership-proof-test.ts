import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiPath = 'app/api/chat/route.ts'
const dispatcherPath =
  'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const api = readFileSync(apiPath, 'utf8')
const dispatcher = readFileSync(dispatcherPath, 'utf8')

const producerMatches = api.match(
  /const\s+finalToolExecutionAllowed\s*=/g,
) ?? []

assert.equal(
  producerMatches.length,
  1,
  'The API must have exactly one producer of finalToolExecutionAllowed.',
)

assert.match(
  api,
  /const\s+finalToolExecutionAllowed\s*=\s*evaluationDecision\s*===\s*['"]accept['"]\s*&&\s*toolOrchestration\.executionAllowed/,
  'Final tool authorization must derive from accepted response evaluation and governed tool orchestration.',
)

assert.match(
  api,
  /finalAuthorization:\s*finalToolExecutionAllowed/,
  'The API must pass finalToolExecutionAllowed into the governed dispatch handoff.',
)

assert.match(
  api,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'Tool governance telemetry must expose the same final tool authorization.',
)

assert.doesNotMatch(
  dispatcher,
  /const\s+finalToolExecutionAllowed\s*=/,
  'The Runtime Tool Dispatcher must not produce finalToolExecutionAllowed.',
)

assert.match(
  dispatcher,
  /finalAuthorization:\s*boolean/,
  'The dispatcher handoff contract must receive finalAuthorization as input.',
)

assert.match(
  dispatcher,
  /const\s+authorized\s*=\s*input\.finalAuthorization\s*&&\s*input\.governance\s*===\s*['"]approved['"]/,
  'The dispatcher boundary must require both finalAuthorization and approved governance.',
)

assert.match(
  dispatcher,
  /finalAuthorization:\s*input\.finalAuthorization/,
  'The dispatcher must preserve the received final authorization.',
)

assert.match(
  dispatcher,
  /dispatchApplied:\s*false/,
  'The handoff must not claim real dispatch.',
)

assert.match(
  dispatcher,
  /executionApplied:\s*false/,
  'The handoff must not claim real execution.',
)

assert.match(
  dispatcher,
  /mutationApplied:\s*false/,
  'The handoff must not claim mutation.',
)

assert.doesNotMatch(
  api,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not directly invoke real tool dispatch.',
)

const result = {
  architecture: 'governed-final-tool-authorization-ownership',
  finalToolAuthorizationProducerCount: producerMatches.length,
  apiOwnsFinalToolAuthorizationComposition: true,
  responseEvaluationRequired: true,
  toolOrchestrationAuthorizationRequired: true,
  dispatcherConsumesFinalAuthorization: true,
  dispatcherDoesNotRecomputeFinalToolAuthorization: true,
  governanceStillRequiredAtBoundary: true,
  dispatcherCalledByApi: false,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed final tool authorization ownership proof passed.',
)

console.log(result)
