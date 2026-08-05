import assert from 'node:assert/strict'
import fs from 'node:fs'

const apiOwner = 'app/api/chat/route.ts'
const dispatcherOwner =
  'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const apiRoute = fs.readFileSync(apiOwner, 'utf8')
const dispatcher = fs.readFileSync(dispatcherOwner, 'utf8')

function locate(
  source: string,
  pattern: RegExp,
  label: string,
  startIndex = 0,
): number {
  const scopedSource = source.slice(startIndex)
  const match = pattern.exec(scopedSource)

  assert.ok(
    match,
    `Required governed tool boundary stage not found: ${label}`,
  )

  return startIndex + match.index
}

assert.match(
  dispatcher,
  /export\s+function\s+dispatchRuntimeTool\s*\(/,
  'The canonical Runtime Tool Dispatcher must exist.',
)

const evaluationDecisionIndex = locate(
  apiRoute,
  /const\s+evaluationDecision\s*=/,
  'evaluation decision',
)

const toolOrchestrationIndex = locate(
  apiRoute,
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'tool orchestration',
  evaluationDecisionIndex,
)

const finalAuthorizationIndex = locate(
  apiRoute,
  /const\s+finalToolExecutionAllowed\s*=/,
  'final tool authorization',
  toolOrchestrationIndex,
)

const toolGovernanceIndex = locate(
  apiRoute,
  /const\s+toolGovernance\s*=/,
  'tool governance',
  finalAuthorizationIndex,
)

const traceResponseIndex = locate(
  apiRoute,
  /const\s+traceResponse\s*=\s*createRuntimeTraceNode\s*\(/,
  'response trace',
  toolGovernanceIndex,
)

const finalResponseIndex = locate(
  apiRoute,
  /return\s+NextResponse\.json\s*\(\s*\{/,
  'final HTTP response',
  traceResponseIndex,
)

assert.ok(
  evaluationDecisionIndex <
    toolOrchestrationIndex &&
    toolOrchestrationIndex <
      finalAuthorizationIndex &&
    finalAuthorizationIndex <
      toolGovernanceIndex &&
    toolGovernanceIndex <
      traceResponseIndex &&
    traceResponseIndex <
      finalResponseIndex,
  'The governed authorization boundary must preserve its canonical order.',
)

assert.match(
  apiRoute,
  /const\s+finalToolExecutionAllowed\s*=\s*evaluationDecision\s*===\s*['"]accept['"]\s*&&\s*toolOrchestration\.executionAllowed/,
  'Final authorization must require cognitive acceptance and orchestrator authorization.',
)

assert.match(
  apiRoute,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'Tool governance must expose only the final governed authorization.',
)

assert.match(
  apiRoute,
  /executionApplied:\s*false/,
  'Authorization must not claim that tool execution was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /import\s*\{[^}]*\bdispatchRuntimeTool\b[^}]*\}\s*from\s*['"]@\/app\/lib\/orchestrator\/runtime-tool-dispatcher['"]/,
  'The API must not import the real dispatchRuntimeTool function.',
)

assert.match(
  apiRoute,
  /import\s*\{\s*createRuntimeToolDispatchHandoff\s*\}\s*from\s*['"]@\/app\/lib\/orchestrator\/runtime-tool-dispatcher['"]/,
  'The API may import the governed handoff creator without importing real dispatch.',
)

assert.doesNotMatch(
  apiRoute,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not dispatch a tool while executionApplied remains false.',
)

assert.doesNotMatch(
  apiRoute,
  /\bexecuteRuntimeTool\s*\(/,
  'The API must not execute tools without an explicit execution contract.',
)

const result = {
  owners: {
    api: apiOwner,
    dispatcher: dispatcherOwner,
  },
  architecture:
    'governed-tool-authorization-without-dispatch',
  canonicalDispatcherExists: true,
  evaluationBeforeAuthorization: true,
  orchestratorAuthorizationRequired: true,
  finalAuthorizationGoverned: true,
  dispatcherExecutionFunctionImportedByApi: false,
  governedHandoffCreatorImportedByApi: true,
  dispatcherCalledByApi: false,
  authorizationIsNotExecution: true,
  traceBeforeResponse: true,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed tool authorization without dispatch proof passed.',
)

console.log(result)
