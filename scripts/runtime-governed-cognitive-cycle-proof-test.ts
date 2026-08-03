import assert from 'node:assert/strict'
import fs from 'node:fs'

const kernelOwner =
  'app/lib/runtime-core/runtime-cognitive-kernel-integration.ts'

const apiOwner =
  'app/api/chat/route.ts'

const kernel = fs.readFileSync(kernelOwner, 'utf8')
const apiRoute = fs.readFileSync(apiOwner, 'utf8')

function locate(
  source: string,
  pattern: RegExp,
  label: string,
): number {
  const match = pattern.exec(source)

  assert.ok(
    match?.index !== undefined,
    `Required cognitive-cycle stage not found: ${label}`,
  )

  return match.index
}

function assertOrdered(
  stages: Array<{
    label: string
    index: number
  }>,
): void {
  for (let index = 1; index < stages.length; index += 1) {
    const previous = stages[index - 1]
    const current = stages[index]

    assert.ok(
      previous.index < current.index,
      `Invalid cognitive-cycle order: ${previous.label} must precede ${current.label}`,
    )
  }
}

/*
 * Cognitive Kernel Integration:
 * memory → planning → reflection
 * → governed execution decision → learning
 * → adaptive-state persistence → return
 */

const memoryRoutingIndex = locate(
  kernel,
  /const\s+memoryRouting\s*=/,
  'governed memory routing',
)

const planningIndex = locate(
  kernel,
  /const\s+(?:basePlanning|planning)\s*=\s*planRuntimeTask\s*\(/,
  'canonical runtime planning',
)

const reflectionIndex = locate(
  kernel,
  /const\s+reflection\s*=/,
  'runtime reflection',
)

const executionDecisionIndex = locate(
  kernel,
  /const\s+finalExecutionDecision\s*=/,
  'final governed execution decision',
)

const learningStateIndex = locate(
  kernel,
  /const\s+currentLearningState\s*=/,
  'current cognitive learning state',
)

const persistenceWriteIndex = kernel.indexOf(
  'persistRuntimeAdaptiveExecutionState(',
  learningStateIndex,
)

assert.ok(
  persistenceWriteIndex >= 0,
  'Adaptive execution-state persistence after learning-state update must exist.',
)

const kernelReturnIndex = locate(
  kernel,
  /return\s*\{[\s\S]*?kernelId/,
  'Cognitive Kernel Integration return contract',
)

assertOrdered([
  {
    label: 'memory routing',
    index: memoryRoutingIndex,
  },
  {
    label: 'planning',
    index: planningIndex,
  },
  {
    label: 'reflection',
    index: reflectionIndex,
  },
  {
    label: 'governed execution decision',
    index: executionDecisionIndex,
  },
  {
    label: 'learning-state update',
    index: learningStateIndex,
  },
  {
    label: 'adaptive execution-state persistence',
    index: persistenceWriteIndex,
  },
  {
    label: 'kernel return',
    index: kernelReturnIndex,
  },
])

assert.match(
  kernel,
  /import\s*\{\s*planRuntimeTask\s*\}\s*from\s*['"].*runtime-task-planner['"]/,
  'The Cognitive Kernel Integration must consume the canonical task planner.',
)

assert.match(
  kernel,
  /memoryRouting\s*[:,]/,
  'The kernel result must preserve governed memory routing.',
)

assert.match(
  kernel,
  /planning\s*[:,]/,
  'The kernel result must preserve planning evidence.',
)

assert.match(
  kernel,
  /executionPersistence\s*[:,]/,
  'The kernel result must preserve execution-persistence evidence.',
)

assert.match(
  kernel,
  /reflection\s*[:,]/,
  'The kernel result must preserve reflection evidence.',
)

assert.match(
  kernel,
  /learning:\s*\{/,
  'The kernel result must preserve learning-state evidence.',
)

assert.match(
  kernel,
  /executionAllowed:\s*authority\.executionAllowed/,
  'Execution authorization must remain explicitly governed.',
)

assert.match(
  kernel,
  /stopReason:\s*completed\s*\?\s*['"]completed['"]\s*:\s*['"]blocked-by-authority['"]/,
  'Kernel stopReason must remain conditioned by governed authority.',
)

/*
 * API:
 * Cognitive Kernel → Core → response evaluation
 * → evaluation decision → tool gate → trace → HTTP response
 */

const cognitiveKernelIndex = locate(
  apiRoute,
  /const\s+cognitiveKernel\s*=/,
  'Cognitive Kernel invocation in API',
)

const coreIndex = locate(
  apiRoute,
  /const\s+coreResult\s*=\s*await\s+iaseveroCore\s*\(/,
  'IASevero Core invocation',
)

const responseEvaluationIndex = locate(
  apiRoute,
  /const\s+responseEvaluation\s*=\s*evaluateRuntimeResponseCase\s*\(/,
  'response evaluation',
)

const evaluationDecisionIndex = locate(
  apiRoute,
  /const\s+evaluationDecision\s*=/,
  'evaluation decision',
)

const toolOrchestrationIndex = locate(
  apiRoute,
  /const\s+toolOrchestration\s*=\s*orchestrateRuntimeTools\s*\(/,
  'tool orchestration gate',
)

const traceResponseIndex = locate(
  apiRoute,
  /const\s+traceResponse\s*=\s*createRuntimeTraceNode\s*\(/,
  'response trace',
)

const finalResponseIndex = apiRoute.lastIndexOf(
  'return NextResponse.json(',
)

assert.ok(
  finalResponseIndex >= 0,
  'The final API response must exist.',
)

assertOrdered([
  {
    label: 'Cognitive Kernel',
    index: cognitiveKernelIndex,
  },
  {
    label: 'IASevero Core',
    index: coreIndex,
  },
  {
    label: 'response evaluation',
    index: responseEvaluationIndex,
  },
  {
    label: 'evaluation decision',
    index: evaluationDecisionIndex,
  },
  {
    label: 'tool orchestration gate',
    index: toolOrchestrationIndex,
  },
  {
    label: 'response trace',
    index: traceResponseIndex,
  },
  {
    label: 'final HTTP response',
    index: finalResponseIndex,
  },
])

assert.match(
  apiRoute,
  /const\s+runtimePlan\s*=\s*cognitiveKernel\.stages\.planning/,
  'The API must derive runtimePlan from the Cognitive Kernel planning stage.',
)

assert.match(
  apiRoute,
  /plan:\s*runtimePlan/,
  'The API response must propagate the governed runtime plan.',
)

assert.match(
  apiRoute,
  /responseEvaluation:\s*\{[\s\S]*?decision:\s*evaluationDecision/,
  'The response must expose its governed evaluation decision.',
)

assert.match(
  apiRoute,
  /cognitiveEvaluation:\s*\{[\s\S]*?decision:\s*evaluationDecision/,
  'The response trace must preserve cognitive evaluation evidence.',
)

assert.match(
  apiRoute,
  /executionAllowed:\s*finalToolExecutionAllowed/,
  'Tool authorization must remain conditioned by the final cognitive gate.',
)

assert.match(
  apiRoute,
  /executionApplied:\s*false/,
  'The API must preserve authorization/execution separation.',
)

assert.doesNotMatch(
  apiRoute,
  /executionApplied:\s*true/,
  'The API must not claim that tool execution was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /mutationApplied:\s*true/,
  'The API must not claim that mutation was applied.',
)

assert.doesNotMatch(
  apiRoute,
  /(?:dispatchRuntimeTool|executeRuntimeTool|toolDispatcher)\s*\(/,
  'The audited API path must not directly dispatch a tool.',
)

const result = {
  owners: {
    kernelIntegration: kernelOwner,
    api: apiOwner,
  },
  architecture: 'governed-cognitive-cycle-order',
  kernelCycle: {
    memoryRoutingProved: true,
    planningProved: true,
    governedExecutionDecisionProved: true,
    executionPersistenceProved: true,
    reflectionProved: true,
    learningStateProved: true,
    ordered: true,
  },
  apiCycle: {
    cognitiveKernelProved: true,
    coreProved: true,
    responseEvaluationProved: true,
    evaluationDecisionProved: true,
    toolGateProved: true,
    traceProved: true,
    responsePropagationProved: true,
    ordered: true,
  },
  planningIsNotAuthorization: true,
  authorizationIsNotExecution: true,
  realToolExecutionClaimed: false,
  externalProviderRequired: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed cognitive cycle order proof passed.',
)
console.log(result)
