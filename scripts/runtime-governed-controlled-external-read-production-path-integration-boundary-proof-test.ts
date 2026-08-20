import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const routePath = path.join(
  root,
  'app/api/chat/route.ts',
)

const boundaryPath = path.join(
  root,
  'app/lib/orchestrator/runtime-tool-controlled-external-read-integration-boundary.ts',
)

const route = fs.readFileSync(routePath, 'utf8')

assert.equal(
  fs.existsSync(boundaryPath),
  true,
  'Controlled External Read Integration Boundary owner must exist.',
)

const boundary = fs.readFileSync(boundaryPath, 'utf8')

assert.equal(
  boundary.includes(
    'evaluateRuntimeToolControlledExternalReadIntegrationBoundary',
  ),
  true,
  'Canonical external-read integration boundary evaluator must exist.',
)

assert.equal(
  route.includes(
    'runtime-tool-controlled-external-read-integration-boundary',
  ),
  true,
  'Canonical /api/chat production path must import the external-read integration boundary.',
)

assert.equal(
  route.includes(
    'evaluateRuntimeToolControlledExternalReadIntegrationBoundary',
  ),
  true,
  'Canonical /api/chat production path must evaluate the external-read integration boundary.',
)

assert.equal(
  boundary.includes('networkAccess: false'),
  true,
  'Integration boundary must not apply network access.',
)

assert.equal(
  boundary.includes('externalReadApplied: false'),
  true,
  'Integration boundary must not perform an external read.',
)

assert.equal(
  boundary.includes('executionApplied: false'),
  true,
  'Integration boundary must not apply execution.',
)

assert.equal(
  boundary.includes('mutationApplied: false'),
  true,
  'Integration boundary must not apply mutation.',
)

assert.equal(
  route.includes(
    'executeRuntimeToolControlledExternalReadEffect(',
  ),
  false,
  'v287.33 must not invoke the real external-read effect from /api/chat.',
)

console.log(
  JSON.stringify(
    {
      architecture:
        'governed-controlled-external-read-production-path-integration-boundary',
      boundaryOwnerPresent: true,
      productionPathIntegrated: true,
      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
    },
    null,
    2,
  ),
)

console.log(
  'Runtime governed controlled external read production path integration boundary proof passed.',
)
