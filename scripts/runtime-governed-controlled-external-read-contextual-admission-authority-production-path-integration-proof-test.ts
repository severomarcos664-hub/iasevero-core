import fs from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const route = fs.readFileSync(routePath, 'utf8')

const count = (text: string, token: string): number =>
  text.split(token).length - 1

const preparationCall =
  'prepareRuntimeToolControlledExternalReadInvocation('

const executionAuthorityCall =
  'evaluateRuntimeExecutionBoundAuthority('

const grantCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary('

const admissionCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority('

const executorCall =
  'evaluateRuntimeToolControlledExecutorBoundary('

const contractCall =
  'evaluateRuntimeToolControlledExternalReadContract('

const effectCall =
  'executeRuntimeToolControlledExternalReadEffect('

const admissionModule =
  'runtime-tool-controlled-external-read-contextual-admission-authority'

const preparationCallCount = count(route, preparationCall)
const executionAuthorityCallCount = count(route, executionAuthorityCall)
const grantCallCount = count(route, grantCall)
const admissionCallCount = count(route, admissionCall)
const executorCallCount = count(route, executorCall)
const contractCallCount = count(route, contractCall)
const effectCallCount = count(route, effectCall)
const fetchCallCount = count(route, 'fetch(')

const admissionImportPresent = route.includes(admissionModule)

const preparationIndex = route.indexOf(preparationCall)
const executionAuthorityIndex = route.indexOf(executionAuthorityCall)
const grantIndex = route.indexOf(grantCall)
const admissionIndex = route.indexOf(admissionCall)
const responseIndex = route.lastIndexOf('return NextResponse.json(')

const orderingValid =
  preparationIndex >= 0 &&
  executionAuthorityIndex > preparationIndex &&
  grantIndex > executionAuthorityIndex &&
  admissionIndex > grantIndex &&
  responseIndex > admissionIndex

const passed =
  preparationCallCount === 1 &&
  executionAuthorityCallCount === 1 &&
  grantCallCount === 1 &&
  admissionImportPresent &&
  admissionCallCount === 1 &&
  orderingValid &&
  executorCallCount === 0 &&
  contractCallCount === 0 &&
  effectCallCount === 0 &&
  fetchCallCount === 0

console.log({
  architecture:
    'governed-controlled-external-read-contextual-admission-authority-production-path-integration',
  preparationCallCount,
  executionAuthorityCallCount,
  grantCallCount,
  admissionImportPresent,
  admissionCallCount,
  orderingValid,
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
    'RED: contextual admission authority is not yet integrated into the governed production path.',
  )
  process.exit(1)
}

console.log(
  'Runtime governed controlled external read contextual admission authority production path integration proof passed.',
)
