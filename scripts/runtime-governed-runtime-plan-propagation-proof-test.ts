import assert from 'node:assert/strict'
import fs from 'node:fs'

const apiOwner = 'app/api/chat/route.ts'
const kernelOwner =
  'app/lib/runtime-core/runtime-cognitive-kernel-integration.ts'

const apiRoute = fs.readFileSync(apiOwner, 'utf8')
const kernelIntegration = fs.readFileSync(kernelOwner, 'utf8')

const locate = (
  source: string,
  pattern: RegExp,
  label: string,
): number => {
  const match = pattern.exec(source)

  assert.ok(
    match?.index !== undefined,
    `Required propagation stage not found: ${label}`,
  )

  return match.index
}

const kernelPlanningIndex = locate(
  apiRoute,
  /const\s+runtimePlan\s*=\s*cognitiveKernel\.stages\.planning/,
  'cognitive kernel planning result assigned to runtimePlan',
)

const responsePlanIndex = locate(
  apiRoute,
  /plan:\s*runtimePlan/,
  'runtimePlan exposed in the API response',
)

const responseIndex = locate(
  apiRoute,
  /return\s+NextResponse\.json\s*\(/,
  'HTTP response',
)

assert.ok(
  kernelPlanningIndex < responseIndex,
  'The runtime plan must be resolved before the HTTP response.',
)

assert.ok(
  responseIndex < responsePlanIndex,
  'The plan field must be contained in the HTTP response object.',
)

assert.match(
  kernelIntegration,
  /createRuntimeTaskPlan\s*\(/,
  'The Cognitive Kernel Integration must create a canonical runtime task plan.',
)

assert.match(
  kernelIntegration,
  /planning\s*[:,]/,
  'The Cognitive Kernel Integration must preserve a planning stage.',
)

assert.match(
  apiRoute,
  /const\s+runtimePlan\s*=\s*cognitiveKernel\.stages\.planning/,
  'The API must derive runtimePlan from the Cognitive Kernel planning stage.',
)

assert.match(
  apiRoute,
  /plan:\s*runtimePlan/,
  'The API must propagate runtimePlan to its response contract.',
)

assert.match(
  apiRoute,
  /executionApplied:\s*false/,
  'Propagation of the runtime plan must not claim execution.',
)

assert.doesNotMatch(
  apiRoute,
  /executionApplied:\s*true/,
  'The API route must not claim that execution was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /(?:dispatchRuntimeTool|executeRuntimeTool|toolDispatcher)\s*\(/,
  'Runtime-plan propagation must not dispatch or execute tools.',
)

const coreCall = apiRoute.match(
  /const\s+coreResult\s*=\s*await\s+iaseveroCore\s*\(([\s\S]*?)\n\s*\)/,
)

assert.ok(
  coreCall,
  'The canonical iaseveroCore call must remain observable.',
)

assert.doesNotMatch(
  coreCall[1],
  /\bruntimePlan\b/,
  'This proof must not falsely claim that runtimePlan is an iaseveroCore input.',
)

const result = {
  owners: {
    api: apiOwner,
    kernelIntegration: kernelOwner,
  },
  architecture: 'governed-runtime-plan-propagation',
  kernelPlanningStageProved: true,
  runtimePlanAssignmentProved: true,
  apiResponsePropagationProved: true,
  coreInputClaimed: false,
  planningIsNotAuthorization: true,
  authorizationIsNotExecution: true,
  realToolExecutionClaimed: false,
  externalProviderRequired: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed runtime plan propagation proof passed.',
)
console.log(result)
