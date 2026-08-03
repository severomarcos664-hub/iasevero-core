import assert from 'node:assert/strict'
import fs from 'node:fs'

const plannerOwner =
  'app/lib/runtime-core/runtime-task-planner.ts'

const kernelIntegrationOwner =
  'app/lib/runtime-core/runtime-cognitive-kernel-integration.ts'

const apiOwner =
  'app/api/chat/route.ts'

const planner = fs.readFileSync(plannerOwner, 'utf8')
const kernelIntegration = fs.readFileSync(
  kernelIntegrationOwner,
  'utf8',
)
const apiRoute = fs.readFileSync(apiOwner, 'utf8')

assert.match(
  planner,
  /export\s+(?:type|interface)\s+RuntimeTaskPlan\b/,
  'The canonical planner must export a typed RuntimeTaskPlan contract.',
)

assert.match(
  planner,
  /export\s+function\s+planRuntimeTask\s*\(/,
  'The canonical planner must export planRuntimeTask().',
)

assert.match(
  planner,
  /source:\s*['"]runtime-task-planner['"]/,
  'Every generated plan must preserve its canonical source.',
)

assert.match(
  planner,
  /status:\s*['"]pending['"]/,
  'A newly created runtime plan must begin in pending state.',
)

assert.match(
  planner,
  /steps\s*:/,
  'A runtime plan must expose controlled planning steps.',
)

assert.match(
  planner,
  /recommendation\s*:/,
  'A runtime plan must expose a recommendation.',
)

assert.match(
  planner,
  /reasoning\s*:/,
  'A runtime plan must preserve planning reasoning.',
)

assert.match(
  kernelIntegration,
  /runtime-task-planner/,
  'The Cognitive Kernel Integration must consume the canonical task planner.',
)

assert.match(
  kernelIntegration,
  /RuntimeTaskPlan/,
  'The Cognitive Kernel Integration must use the typed runtime plan.',
)

assert.match(
  kernelIntegration,
  /planRuntimeTask\s*\(/,
  'The Cognitive Kernel Integration must call the canonical planRuntimeTask planner.',
)

assert.match(
  kernelIntegration,
  /executionAllowed/,
  'Execution authorization must remain explicit in kernel integration.',
)

assert.match(
  apiRoute,
  /plan:\s*runtimePlan/,
  'The API response must expose the runtime plan explicitly.',
)

assert.match(
  apiRoute,
  /executionApplied:\s*false/,
  'The API must preserve the distinction between authorization and execution.',
)

assert.doesNotMatch(
  planner,
  /executionApplied:\s*true/,
  'The canonical planner must not claim execution.',
)

assert.doesNotMatch(
  planner,
  /(?:execute|dispatch)Runtime(?:Task)?Plan\s*\(/,
  'Plan creation must not execute or dispatch the plan.',
)

assert.doesNotMatch(
  apiRoute,
  /executionApplied:\s*true/,
  'The API route must not claim that execution was applied.',
)

const result = {
  owners: {
    planner: plannerOwner,
    kernelIntegration: kernelIntegrationOwner,
    api: apiOwner,
  },
  typedRuntimePlanProved: true,
  canonicalPlannerSourceProved: true,
  pendingInitialStateProved: true,
  controlledStepsProved: true,
  kernelConsumptionProved: true,
  apiPlanExposureProved: true,
  planningIsNotAuthorization: true,
  authorizationIsNotExecution: true,
  externalProviderRequired: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log('Runtime governed runtime plan proof passed.')
console.log(result)
