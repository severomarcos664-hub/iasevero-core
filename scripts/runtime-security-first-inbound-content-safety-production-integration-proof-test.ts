import { readFileSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const routePath = 'app/api/chat/route.ts'
const ownerPath =
  'app/lib/orchestrator/runtime-tool-inbound-content-safety.ts'

const route = readFileSync(routePath, 'utf8')
const owner = readFileSync(ownerPath, 'utf8')

assert.match(
  owner,
  /export function evaluateRuntimeToolInboundContentSafety/,
  'Canonical inbound-content safety owner must export its evaluator.',
)

assert.match(
  route,
  /runtime-tool-inbound-content-safety/,
  'Production route must import the canonical inbound-content safety owner.',
)

assert.match(
  route,
  /evaluateRuntimeToolInboundContentSafety\s*\(/,
  'Production route must evaluate inbound content before cognitive consumption.',
)

const externalReadEffectIndex = route.indexOf(
  'executeRuntimeToolControlledExternalReadEffect(',
)
const inboundSafetyIndex = route.indexOf(
  'evaluateRuntimeToolInboundContentSafety(',
)

assert.notEqual(
  externalReadEffectIndex,
  -1,
  'Production route must retain the controlled external-read effect.',
)

assert.notEqual(
  inboundSafetyIndex,
  -1,
  'Production route must contain the inbound-content safety evaluation.',
)

assert.ok(
  inboundSafetyIndex > externalReadEffectIndex,
  'Inbound-content safety must evaluate the returned external content after the controlled read.',
)

console.log(
  'Runtime Security-First inbound-content safety production integration proof passed.',
)
