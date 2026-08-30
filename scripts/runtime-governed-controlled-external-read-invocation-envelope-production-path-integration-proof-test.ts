import fs from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const route = fs.readFileSync(routePath, 'utf8')

const count = (token: string): number =>
  route.split(token).length - 1

const preparationCall =
  'prepareRuntimeToolControlledExternalReadInvocation('

const executionAuthorityCall =
  'evaluateRuntimeExecutionBoundAuthority('

const grantCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary('

const admissionCall =
  'evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority('

const envelopeCall =
  'createRuntimeToolExecutionInvocationEnvelope('

const executorCall =
  'evaluateRuntimeToolControlledExecutorBoundary('

const contractCall =
  'evaluateRuntimeToolControlledExternalReadContract('

const effectCall =
  'executeRuntimeToolControlledExternalReadEffect('

const preparationCallCount = count(preparationCall)
const executionAuthorityCallCount = count(executionAuthorityCall)
const grantCallCount = count(grantCall)
const admissionCallCount = count(admissionCall)
const envelopeCallCount = count(envelopeCall)
const executorCallCount = count(executorCall)
const contractCallCount = count(contractCall)
const effectCallCount = count(effectCall)
const fetchCallCount = count('fetch(')

const envelopeImportPresent =
  route.includes('runtime-tool-execution-invocation-envelope')

const envelopeResponsePresent =
  /toolControlledExternalReadInvocationEnvelope,\s*(?:\r?\n)/.test(route)

const preparationIndex = route.indexOf(preparationCall)
const executionAuthorityIndex = route.indexOf(executionAuthorityCall)
const grantIndex = route.indexOf(grantCall)
const admissionIndex = route.indexOf(admissionCall)
const envelopeIndex = route.indexOf(envelopeCall)
const responseIndex = route.lastIndexOf('return NextResponse.json(')

const orderingValid =
  preparationIndex >= 0 &&
  executionAuthorityIndex > preparationIndex &&
  grantIndex > executionAuthorityIndex &&
  admissionIndex > grantIndex &&
  envelopeIndex > admissionIndex &&
  responseIndex > envelopeIndex

const passed =
  preparationCallCount === 1 &&
  executionAuthorityCallCount === 1 &&
  grantCallCount === 1 &&
  admissionCallCount === 1 &&
  envelopeImportPresent &&
  envelopeCallCount === 1 &&
  envelopeResponsePresent &&
  orderingValid &&
  executorCallCount === 0 &&
  contractCallCount === 0 &&
  effectCallCount === 0 &&
  fetchCallCount === 0

console.log({
  architecture:
    'governed-controlled-external-read-invocation-envelope-production-path-integration',
  preparationCallCount,
  executionAuthorityCallCount,
  grantCallCount,
  admissionCallCount,
  envelopeImportPresent,
  envelopeCallCount,
  envelopeResponsePresent,
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
    'RED: controlled external read invocation envelope is not yet integrated into the governed production path.',
  )
  process.exit(1)
}

console.log(
  'Runtime governed controlled external read invocation envelope production path integration proof passed.',
)
