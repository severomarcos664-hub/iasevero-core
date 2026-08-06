import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiPath = 'app/api/chat/route.ts'
const dispatcherPath =
  'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const apiRoute = readFileSync(apiPath, 'utf8')
const dispatcher = readFileSync(dispatcherPath, 'utf8')

assert.match(
  apiRoute,
  /import\s*\{\s*createRuntimeToolDispatchHandoff\s*\}\s*from\s*['"]@\/app\/lib\/orchestrator\/runtime-tool-dispatcher['"]/,
  'The API must import the canonical governed handoff creator.',
)

assert.doesNotMatch(
  apiRoute,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not apply real Dispatcher selection in this version.',
)

assert.match(
  apiRoute,
  /const\s+toolDispatchHandoff\s*=\s*createRuntimeToolDispatchHandoff\s*\(\s*\{/,
  'The API must create the governed dispatch handoff.',
)

assert.match(
  apiRoute,
  /executionKey:\s*effectiveExecutionKey/,
  'The handoff must preserve the effective execution identity.',
)

assert.match(
  apiRoute,
  /correlationId:\s*runtimeMaster\.correlationId/,
  'The handoff must preserve the runtime correlation identity.',
)

assert.match(
  apiRoute,
  /traceId:\s*traceResponse\.id/,
  'The handoff must be linked to the response trace.',
)

assert.match(
  apiRoute,
  /stepId:\s*cognitiveKernel\.stages\.executionPersistence\.taskId/,
  'The handoff must preserve the cognitive task identity.',
)

assert.match(
  apiRoute,
  /finalAuthorization:\s*finalToolExecutionAllowed/,
  'The handoff must consume the final governed tool authorization.',
)

assert.match(
  apiRoute,
  /governance:\s*toolOrchestration\.executionAllowed\s*\?\s*['"]approved['"]\s*:\s*['"]denied['"]/,
  'Orchestrator denial must be preserved as governance denial.',
)

assert.match(
  apiRoute,
  /return\s+NextResponse\.json\s*\(\s*\{[\s\S]*?toolDispatchHandoff,/,
  'The final API response must expose the governed handoff.',
)

const traceIndex = apiRoute.indexOf(
  'const traceResponse = createRuntimeTraceNode',
)

const handoffIndex = apiRoute.indexOf(
  'const toolDispatchHandoff',
)

const responseIndex = apiRoute.indexOf(
  'return NextResponse.json({',
  handoffIndex,
)

assert.ok(traceIndex >= 0, 'Response trace must exist.')
assert.ok(handoffIndex > traceIndex, 'Trace must precede handoff creation.')
assert.ok(
  responseIndex > handoffIndex,
  'Handoff creation must precede the final HTTP response.',
)

assert.match(
  dispatcher,
  /dispatchApplied:\s*false/,
  'The canonical handoff must declare dispatchApplied=false.',
)

assert.match(
  dispatcher,
  /executionApplied:\s*false/,
  'The canonical handoff must declare executionApplied=false.',
)

assert.match(
  dispatcher,
  /mutationApplied:\s*false/,
  'The canonical handoff must declare mutationApplied=false.',
)

const result = {
  owners: {
    api: apiPath,
    dispatcher: dispatcherPath,
  },
  architecture:
    'governed-tool-dispatch-integration-without-dispatch',
  canonicalHandoffCreatorUsed: true,
  effectiveExecutionKeyPreserved: true,
  correlationIdPreserved: true,
  traceIdPreserved: true,
  taskIdPreserved: true,
  finalAuthorizationConsumed: true,
  orchestratorGovernancePreserved: true,
  handoffExposedByApi: true,
  traceBeforeHandoff: true,
  handoffBeforeResponse: true,
  dispatcherCalledByApi: false,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed tool dispatch integration proof passed.',
)

console.log(result)
