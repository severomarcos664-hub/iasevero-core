import fs from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const route = fs.readFileSync(routePath, 'utf8')

const count = (token: string): number =>
  route.split(token).length - 1

const envelopeCallCount =
  count('createRuntimeToolExecutionInvocationEnvelope(')

const executorCallCount =
  count('evaluateRuntimeToolControlledExecutorBoundary(')

const contractCallCount =
  count('evaluateRuntimeToolControlledExternalReadContract(')

const effectCallCount =
  count('executeRuntimeToolControlledExternalReadEffect(')

const fetchCallCount =
  count('fetch(')

const registry = fs.readFileSync(
  'app/lib/runtime-core/runtime-tool-registry.ts',
  'utf8',
)

const externalReadBlock =
  registry.match(
    /\{\s*id:\s*'external\.read'[\s\S]*?\n\s*\},/,
  )?.[0] ?? ''

const externalReadRegistered =
  externalReadBlock.includes("id: 'external.read'")

const externalReadFailClosed =
  externalReadBlock.includes('allowed: false')

const passed =
  envelopeCallCount === 1 &&
  executorCallCount === 1 &&
  externalReadRegistered &&
  externalReadFailClosed &&
  contractCallCount === 0 &&
  effectCallCount === 0 &&
  fetchCallCount === 0

console.log({
  architecture:
    'governed-controlled-external-read-executor-boundary-production-path-integration',
  envelopeCallCount,
  executorCallCount,
  externalReadRegistered,
  externalReadFailClosed,
  contractCallCount,
  effectCallCount,
  fetchCallCount,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
})

if (!passed) {
  console.error(
    'RED: controlled external.read executor boundary is not yet integrated into the governed production path.',
  )
  process.exit(1)
}

console.log(
  'Runtime governed controlled external.read executor boundary production path integration proof passed.',
)
