import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

import {
  evaluateRuntimeDecisionGate,
} from '../app/lib/runtime-core/runtime-decision-gate'

const routePath = path.join(
  process.cwd(),
  'app',
  'api',
  'chat',
  'route.ts',
)

const routeSource = fs.readFileSync(
  routePath,
  'utf8',
)

function countOccurrences(
  source: string,
  expression: RegExp,
): number {
  return [...source.matchAll(expression)].length
}

assert.equal(
  countOccurrences(
    routeSource,
    /evaluateRuntimeDecisionGate\s*\(/g,
  ),
  1,
  'The chat route must call the Runtime Decision Gate exactly once.',
)

assert.equal(
  countOccurrences(
    routeSource,
    /runRuntimeExecutionBridge\s*\(/g,
  ),
  0,
  'The chat route must not call the Execution Bridge directly.',
)

assert.equal(
  countOccurrences(
    routeSource,
    /runRuntimeCognitiveKernel\s*\(/g,
  ),
  0,
  'The chat route must not bypass the Decision Gate by calling the Kernel directly.',
)

assert.equal(
  countOccurrences(
    routeSource,
    /evaluateRuntimeExecutiveAuthorityGateway\s*\(/g,
  ),
  0,
  'The chat route must not evaluate Executive Authority in parallel.',
)

assert.equal(
  countOccurrences(
    routeSource,
    /createRuntimeTaskPlan\s*\(/g,
  ),
  0,
  'The chat route must not create a parallel task plan.',
)

assert.equal(
  countOccurrences(
    routeSource,
    /executeRuntimePipeline\s*\(/g,
  ),
  0,
  'The chat route must not execute a parallel runtime pipeline.',
)

assert.match(
  routeSource,
  /const\s+cognitiveKernel\s*=\s*decisionGate\.kernel/,
  'The chat route must reuse the Kernel returned by the Decision Gate.',
)

assert.match(
  routeSource,
  /const\s+pipelineResult\s*=\s*cognitiveKernel\.stages\.execution/,
  'The API pipeline result must come from the canonical Kernel execution stage.',
)

assert.match(
  routeSource,
  /const\s+executiveAuthority\s*=\s*cognitiveKernel\.stages\.authority/,
  'The API authority result must come from the canonical Kernel authority stage.',
)

const decisionGate =
  evaluateRuntimeDecisionGate(
    'Execute uma operação controlada pelo caminho canônico.',
    'canonical-api-test-user',
  )

assert.ok(
  decisionGate.kernel,
  'The Decision Gate must return the canonical Cognitive Kernel report.',
)

assert.ok(
  decisionGate.kernel.stages.executionEnforcement,
  'The Kernel returned by the Decision Gate must expose execution enforcement.',
)

assert.equal(
  decisionGate.kernel.stages
    .executionEnforcement.initialState.steps.length > 0,
  true,
  'The canonical Kernel must create an execution state.',
)

assert.ok(
  decisionGate.kernel.reasoning.some(
    (entry) =>
      entry.startsWith(
        'Execution enforcement preReason=',
      ),
  ),
  'The canonical Kernel must expose enforcement evidence.',
)

console.log(
  'OK: /api/chat uses the canonical governed execution path.',
)

console.log(
  JSON.stringify(
    {
      decisionGateCalls: 1,
      directExecutionBridgeCalls: 0,
      directKernelCalls: 0,
      parallelAuthorityCalls: 0,
      parallelPlannerCalls: 0,
      parallelPipelineCalls: 0,
      kernelReturnedByDecisionGate: true,
      executionEnforcementPresent: true,
      executionAllowed: decisionGate.allowed,
      finalReason:
        decisionGate.kernel.stages
          .executionEnforcement.finalDecision.reason,
    },
    null,
    2,
  ),
)
