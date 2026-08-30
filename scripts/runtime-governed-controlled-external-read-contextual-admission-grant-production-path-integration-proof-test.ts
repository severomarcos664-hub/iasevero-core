import fs from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const route = fs.readFileSync(routePath, 'utf8')

function count(source: string, needle: string): number {
  return source.split(needle).length - 1
}

const grantModule =
  '@/app/lib/orchestrator/runtime-tool-controlled-external-read-contextual-admission-grant-boundary'

const preparationCall =
  'prepareRuntimeToolControlledExternalReadInvocation('

const executionAuthorityCall =
  'evaluateRuntimeExecutionBoundAuthority('

const grantCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary('

const admissionAuthorityCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority('

const executorCall =
  'evaluateRuntimeToolControlledExecutorBoundary('

const contractCall =
  'evaluateRuntimeToolControlledExternalReadContract('

const effectCall =
  'executeRuntimeToolControlledExternalReadEffect('

const preparationCallCount = count(route, preparationCall)
const executionAuthorityCallCount = count(route, executionAuthorityCall)
const grantCallCount = count(route, grantCall)
const admissionAuthorityCallCount = count(route, admissionAuthorityCall)
const executorCallCount = count(route, executorCall)
const contractCallCount = count(route, contractCall)
const effectCallCount = count(route, effectCall)
const fetchCallCount = count(route, 'fetch(')

const grantImportPresent = route.includes(grantModule)

const grantResponsePresent =
  /toolControlledExternalReadContextualAdmissionGrantBoundary,\s*\n/.test(route)

const preparationIndex = route.indexOf(preparationCall)
const authorityIndex = route.indexOf(executionAuthorityCall)
const grantIndex = route.indexOf(grantCall)
const responseIndex = route.lastIndexOf('return NextResponse.json(')

const orderingValid =
  preparationIndex >= 0 &&
  authorityIndex > preparationIndex &&
  grantIndex > authorityIndex &&
  responseIndex > grantIndex

const passed =
  preparationCallCount === 1 &&
  executionAuthorityCallCount === 1 &&
  grantImportPresent &&
  grantCallCount === 1 &&
  grantResponsePresent &&
  orderingValid &&
  admissionAuthorityCallCount === 0 &&
  executorCallCount === 0 &&
  contractCallCount === 0 &&
  effectCallCount === 0 &&
  fetchCallCount === 0

console.log({
  architecture:
    'governed-controlled-external-read-contextual-admission-grant-production-path-integration',
  preparationCallCount,
  executionAuthorityCallCount,
  grantImportPresent,
  grantCallCount,
  grantResponsePresent,
  orderingValid,
  admissionAuthorityCallCount,
  executorCallCount,
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
    'RED: contextual admission grant boundary is not yet integrated into the governed production path.',
  )
  process.exit(1)
}

console.log(
  'Runtime governed controlled external read contextual admission grant production path integration proof passed.',
)
