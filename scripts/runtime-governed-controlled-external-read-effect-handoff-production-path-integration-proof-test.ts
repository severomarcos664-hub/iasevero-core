import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const ownerPath =
  'app/lib/orchestrator/runtime-tool-controlled-external-read-effect-handoff-boundary.ts'

const route = readFileSync(routePath, 'utf8')
const owner = readFileSync(ownerPath, 'utf8')

const importPath =
  '@/app/lib/orchestrator/runtime-tool-controlled-external-read-effect-handoff-boundary'

const handoffFunction =
  'evaluateRuntimeToolControlledExternalReadEffectHandoffBoundary'

const authorizationDeclaration =
  'const toolControlledExternalReadAuthorizationBoundary ='

const executionGateDeclaration =
  'const toolControlledExternalReadExecutionGate ='

const handoffDeclaration =
  'const toolControlledExternalReadEffectHandoffBoundary ='

const responseBoundary =
  'return NextResponse.json('

const importCount = route.split(importPath).length - 1

const callPattern =
  /evaluateRuntimeToolControlledExternalReadEffectHandoffBoundary\s*\(\s*toolControlledExternalReadExecutionGate\s*,?\s*\)/g

const callCount = (route.match(callPattern) ?? []).length

const authorizationIndex = route.indexOf(authorizationDeclaration)
const executionGateIndex = route.indexOf(executionGateDeclaration)
const handoffIndex = route.indexOf(handoffDeclaration)
const responseIndex = route.indexOf(responseBoundary, handoffIndex >= 0 ? handoffIndex : 0)

const authorizationBeforeExecutionGate =
  authorizationIndex >= 0 &&
  executionGateIndex > authorizationIndex

const executionGateBeforeEffectHandoff =
  executionGateIndex >= 0 &&
  handoffIndex > executionGateIndex

const effectHandoffBeforeResponse =
  handoffIndex >= 0 &&
  responseIndex > handoffIndex

const canonicalExecutionGatePropagation =
  callCount === 1

const ownerPresent =
  owner.includes(
    'export function evaluateRuntimeToolControlledExternalReadEffectHandoffBoundary',
  )

const ownerPreservesZeroEffects =
  owner.includes('networkAccess: false') &&
  owner.includes('externalReadApplied: false') &&
  owner.includes('executionApplied: false') &&
  owner.includes('mutationApplied: false') &&
  owner.includes('providerInvocation: false')

const productionEffectCallCount =
  route.split('executeRuntimeToolControlledExternalReadEffect(').length - 1

const productionFetchCount =
  route.split('fetch(').length - 1

assert.equal(
  ownerPresent,
  true,
  'Controlled External Read Effect Handoff Boundary owner must exist.',
)

assert.equal(
  ownerPreservesZeroEffects,
  true,
  'Effect Handoff owner must preserve zero-effect invariants.',
)

assert.equal(
  importCount,
  1,
  'Production path must import the Effect Handoff Boundary exactly once.',
)

assert.equal(
  callCount,
  1,
  'Production path must invoke the Effect Handoff Boundary exactly once with the canonical Execution Gate decision.',
)

assert.equal(
  authorizationBeforeExecutionGate,
  true,
  'Authorization Boundary must execute before Execution Gate.',
)

assert.equal(
  executionGateBeforeEffectHandoff,
  true,
  'Execution Gate must execute before Effect Handoff Boundary.',
)

assert.equal(
  effectHandoffBeforeResponse,
  true,
  'Effect Handoff Boundary must execute before the production response.',
)

assert.equal(
  canonicalExecutionGatePropagation,
  true,
  'Effect Handoff Boundary must consume the canonical Execution Gate decision.',
)

assert.equal(
  productionEffectCallCount,
  0,
  'Production path must not invoke the real external-read effect.',
)

assert.equal(
  productionFetchCount,
  0,
  'Production path must not perform fetch during Effect Handoff integration.',
)

console.log(
  JSON.stringify(
    {
      architecture:
        'governed-controlled-external-read-effect-handoff-production-path-integration',
      ownerPresent,
      ownerPreservesZeroEffects,
      importCount,
      callCount,
      authorizationBeforeExecutionGate,
      executionGateBeforeEffectHandoff,
      effectHandoffBeforeResponse,
      canonicalExecutionGatePropagation,
      productionEffectCallCount,
      productionFetchCount,
      networkEffectInvoked: false,
      executionApplied: false,
      mutationApplied: false,
    },
    null,
    2,
  ),
)
