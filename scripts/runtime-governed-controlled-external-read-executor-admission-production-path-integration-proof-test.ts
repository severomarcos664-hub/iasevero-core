import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const registryPath = 'app/lib/runtime-core/runtime-tool-registry.ts'

const route = readFileSync(routePath, 'utf8')
const registry = readFileSync(registryPath, 'utf8')

const count = (token: string): number =>
  route.split(token).length - 1

const admissionImportCount = count(
  'runtime-tool-controlled-external-read-executor-admission-boundary',
)

const admissionCallCount = count(
  'evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary(',
)

const genericExecutorCallCount = count(
  'evaluateRuntimeToolControlledExecutorBoundary(',
)

const contractCallCount = count(
  'evaluateRuntimeToolControlledExternalReadContract(',
)

const effectCallCount = count(
  'executeRuntimeToolControlledExternalReadEffect(',
)

const fetchCallCount = count('fetch(')

const externalReadBlock =
  registry.match(
    /\{\s*id:\s*['"]external\.read['"][\s\S]*?\n\s*\},/,
  )?.[0] ?? ''

const externalReadRegistered =
  externalReadBlock.includes("id: 'external.read'") ||
  externalReadBlock.includes('id: "external.read"')

const externalReadFailClosed =
  /allowed:\s*false/.test(externalReadBlock)

console.log({
  architecture:
    'governed-controlled-external-read-executor-admission-production-path-integration',
  admissionImportCount,
  admissionCallCount,
  genericExecutorCallCount,
  externalReadRegistered,
  externalReadFailClosed,
  contractCallCount,
  effectCallCount,
  fetchCallCount,
  registryMutationApplied: false,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

assert.equal(
  admissionImportCount,
  1,
  'controlled external.read executor admission import must exist exactly once',
)

assert.equal(
  admissionCallCount,
  1,
  'controlled external.read executor admission must be evaluated exactly once',
)

assert.equal(
  genericExecutorCallCount,
  1,
  'generic controlled executor boundary must remain present exactly once',
)

assert.equal(
  externalReadRegistered,
  true,
  'external.read must remain registered',
)

assert.equal(
  externalReadFailClosed,
  true,
  'external.read must remain globally fail-closed',
)

assert.equal(
  contractCallCount,
  0,
  'external-read contract must not be production-integrated in this version',
)

assert.equal(
  effectCallCount,
  0,
  'external-read effect must not be production-integrated in this version',
)

assert.equal(
  fetchCallCount,
  0,
  'fetch must not exist in the production route in this version',
)

console.log(
  'Runtime governed controlled external.read executor admission production path integration proof passed.',
)
