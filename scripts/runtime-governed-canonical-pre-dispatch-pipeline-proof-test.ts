import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiPath = 'app/api/chat/route.ts'
const dispatcherPath =
  'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const apiRoute = readFileSync(apiPath, 'utf8')
const dispatcher = readFileSync(dispatcherPath, 'utf8')

function locate(
  source: string,
  pattern: RegExp,
  label: string,
  startIndex = 0,
): number {
  const scoped = source.slice(startIndex)
  const match = pattern.exec(scoped)

  assert.ok(
    match,
    `Required canonical pre-dispatch stage not found: ${label}`,
  )

  return startIndex + match.index
}

const decisionEngineIndex = locate(
  apiRoute,
  /executeRuntimeDecisionEngine\s*\(/,
  'runtime decision engine',
)

const decisionGateIndex = locate(
  apiRoute,
  /evaluateRuntimeDecisionGate\s*\(/,
  'runtime decision gate',
  decisionEngineIndex,
)

const requestTraceIndex = locate(
  apiRoute,
  /const\s+traceRequest\s*=\s*createRuntimeTraceNode\s*\(/,
  'request trace',
  decisionGateIndex,
)

const coreIndex = locate(
  apiRoute,
  /await\s+iaseveroCore\s*\(/,
  'IASevero core',
  requestTraceIndex,
)

const responseEvaluationIndex = locate(
  apiRoute,
  /evaluateRuntimeResponseCase\s*\(/,
  'response evaluation',
  coreIndex,
)

const toolOrchestrationIndex = locate(
  apiRoute,
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'tool orchestration',
  responseEvaluationIndex,
)

const finalAuthorizationIndex = locate(
  apiRoute,
  /const\s+finalToolExecutionAllowed\s*=/,
  'final tool authorization',
  toolOrchestrationIndex,
)

const responseTraceIndex = locate(
  apiRoute,
  /const\s+traceResponse\s*=\s*createRuntimeTraceNode\s*\(/,
  'response trace',
  finalAuthorizationIndex,
)

const handoffIndex = locate(
  apiRoute,
  /const\s+toolDispatchHandoff\s*=\s*createRuntimeToolDispatchHandoff\s*\(/,
  'governed dispatch handoff',
  responseTraceIndex,
)

const responseIndex = locate(
  apiRoute,
  /return\s+NextResponse\.json\s*\(\s*\{/,
  'final HTTP response',
  handoffIndex,
)

const orderedStages = [
  ['runtime decision engine', decisionEngineIndex],
  ['runtime decision gate', decisionGateIndex],
  ['request trace', requestTraceIndex],
  ['IASevero core', coreIndex],
  ['response evaluation', responseEvaluationIndex],
  ['tool orchestration', toolOrchestrationIndex],
  ['final tool authorization', finalAuthorizationIndex],
  ['response trace', responseTraceIndex],
  ['governed dispatch handoff', handoffIndex],
  ['final HTTP response', responseIndex],
] as const

for (let index = 1; index < orderedStages.length; index += 1) {
  const previous = orderedStages[index - 1]
  const current = orderedStages[index]

  assert.ok(
    previous[1] < current[1],
    `Invalid canonical stage order: ${previous[0]} must precede ${current[0]}`,
  )
}

assert.match(
  apiRoute,
  /finalAuthorization:\s*finalToolExecutionAllowed/,
  'The handoff must consume the final governed authorization.',
)

assert.match(
  apiRoute,
  /traceId:\s*traceResponse\.id/,
  'The handoff must preserve the response trace identity.',
)

assert.match(
  apiRoute,
  /executionKey:\s*effectiveExecutionKey/,
  'The handoff must preserve the effective execution identity.',
)

assert.doesNotMatch(
  apiRoute,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not apply real tool dispatch in the pre-dispatch pipeline.',
)

assert.doesNotMatch(
  apiRoute,
  /dispatchApplied:\s*true/,
  'The API must not claim that dispatch was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /executionApplied:\s*true/,
  'The API must not claim that execution was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /mutationApplied:\s*true/,
  'The API must not claim that mutation was applied.',
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
  owner: apiPath,
  dispatcherOwner: dispatcherPath,
  architecture:
    'governed-canonical-pre-dispatch-pipeline',
  stages: orderedStages.map(([label]) => label),
  ordered: true,
  finalAuthorizationConsumed: true,
  responseTracePreserved: true,
  executionIdentityPreserved: true,
  dispatcherCalledByApi: false,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed canonical pre-dispatch pipeline proof passed.',
)

console.log(result)
