import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiPath = 'app/api/chat/route.ts'
const dispatcherPath =
  'app/lib/orchestrator/runtime-tool-dispatcher.ts'

const apiRoute = readFileSync(apiPath, 'utf8')
const dispatcher = readFileSync(dispatcherPath, 'utf8')

assert.match(
  dispatcher,
  /export\s+function\s+dispatchRuntimeTool\s*\(/,
  'The Runtime Tool Dispatcher must own the canonical dispatch function.',
)

assert.match(
  dispatcher,
  /export\s+function\s+createRuntimeToolDispatchHandoff\s*\(/,
  'The Runtime Tool Dispatcher must own the governed handoff creator.',
)

assert.match(
  apiRoute,
  /createRuntimeToolDispatchHandoff/,
  'The API must consume the governed handoff contract.',
)

assert.doesNotMatch(
  apiRoute,
  /import\s*\{[^}]*\bdispatchRuntimeTool\b[^}]*\}\s*from\s*['"]@\/app\/lib\/orchestrator\/runtime-tool-dispatcher['"]/,
  'The API must not import the canonical real dispatch function.',
)

assert.doesNotMatch(
  apiRoute,
  /\bdispatchRuntimeTool\s*\(/,
  'The API must not directly invoke the canonical dispatcher.',
)

assert.match(
  dispatcher,
  /executionAllowed/,
  'Canonical dispatch must require an execution authorization signal.',
)

assert.match(
  dispatcher,
  /governance/,
  'Canonical dispatch must consume governance state.',
)

assert.match(
  dispatcher,
  /executionKey/,
  'The dispatcher boundary must preserve execution identity.',
)

assert.match(
  dispatcher,
  /correlationId/,
  'The dispatcher boundary must preserve correlation identity.',
)

assert.match(
  dispatcher,
  /traceId/,
  'The dispatcher boundary must preserve trace identity.',
)

assert.match(
  dispatcher,
  /stepId/,
  'The dispatcher boundary must preserve step identity.',
)

assert.match(
  dispatcher,
  /finalAuthorization/,
  'The governed handoff must carry final authorization.',
)

assert.match(
  dispatcher,
  /handoffStatus:\s*authorized\s*\?\s*['"]authorized['"]\s*:\s*['"]blocked['"]/,
  'The governed handoff must expose an authorized-or-blocked state.',
)

assert.match(
  dispatcher,
  /dispatchApplied:\s*false/,
  'The governed handoff must not claim dispatch application.',
)

assert.match(
  dispatcher,
  /executionApplied:\s*false/,
  'The governed handoff must not claim execution application.',
)

assert.match(
  dispatcher,
  /mutationApplied:\s*false/,
  'The governed handoff must not claim mutation application.',
)

assert.doesNotMatch(
  apiRoute,
  /dispatchApplied:\s*true/,
  'The API must not claim that real dispatch was applied.',
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

const result = {
  owners: {
    api: apiPath,
    dispatcher: dispatcherPath,
  },
  architecture: 'governed-dispatch-boundary',
  canonicalDispatcherOwner: true,
  canonicalHandoffOwner: true,
  apiConsumesGovernedHandoff: true,
  dispatcherImportedByApi: false,
  dispatcherCalledByApi: false,
  executionIdentityPreserved: true,
  correlationIdentityPreserved: true,
  traceIdentityPreserved: true,
  stepIdentityPreserved: true,
  finalAuthorizationRequired: true,
  governanceRequired: true,
  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
}

console.log(
  'Runtime governed dispatch boundary proof passed.',
)

console.log(result)
