import fs from 'node:fs'
import path from 'node:path'

const routePath = path.resolve('app/api/chat/route.ts')
const source = fs.readFileSync(routePath, 'utf8')

const count = (pattern: RegExp): number =>
  [...source.matchAll(pattern)].length

const materialCallCount = count(
  /evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary\s*\(/g,
)

const preparationImportPresent =
  source.includes(
    'runtime-tool-controlled-external-read-invocation-preparation',
  )

const preparationCallCount = count(
  /prepareRuntimeToolControlledExternalReadInvocation\s*\(/g,
)

const effectCallCount = count(
  /executeRuntimeToolControlledExternalReadEffect\s*\(/g,
)

const fetchCallCount = count(/\bfetch\s*\(/g)

const result = {
  architecture:
    'governed-controlled-external-read-invocation-preparation-production-path-integration',
  materialCallCount,
  preparationImportPresent,
  preparationCallCount,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
}

console.log(result)

if (materialCallCount !== 1) process.exit(1)
if (!preparationImportPresent) process.exit(1)
if (preparationCallCount !== 1) process.exit(1)
if (effectCallCount !== 0) process.exit(1)
if (fetchCallCount !== 0) process.exit(1)
