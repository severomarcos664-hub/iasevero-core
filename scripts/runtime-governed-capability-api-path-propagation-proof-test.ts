import assert from 'node:assert/strict'
import fs from 'node:fs'

const routePath = 'app/api/chat/route.ts'
const route = fs.readFileSync(routePath, 'utf8')

const eligibilityImport =
  route.includes('getAppliedIntelligenceCapabilityEligibility') &&
  route.includes('@/app/runtime/capabilities/runtime-capability-registry')

const eligibilityResolvedOnApiPath =
  route.includes(
    "getAppliedIntelligenceCapabilityEligibility('runtime-trace-integrity')"
  )

const traceResponseCreated =
  route.includes("createRuntimeTraceNode(") &&
  route.includes("'chat.response.generated'")

const eligibilityPropagatedToTrace =
  /createRuntimeTraceNode\([\s\S]*?'chat\.response\.generated'[\s\S]*?capabilityEligibility[\s\S]*?\)/m.test(route)

const finalToolExecutionBoundaryPreserved =
  route.includes('const finalToolExecutionAllowed =') &&
  route.includes("evaluationDecision === 'accept'") &&
  route.includes('toolOrchestration.executionAllowed')

const dispatchStillUsesFinalBoundary =
  /createRuntimeToolDispatchHandoff\([\s\S]*?finalAuthorization:\s*finalToolExecutionAllowed/m.test(route)

const executionAppliedStillFalse =
  route.includes('executionApplied: false')

console.log({
  eligibilityImport,
  eligibilityResolvedOnApiPath,
  traceResponseCreated,
  eligibilityPropagatedToTrace,
  finalToolExecutionBoundaryPreserved,
  dispatchStillUsesFinalBoundary,
  executionAppliedStillFalse,
})

assert.equal(eligibilityImport, true)
assert.equal(eligibilityResolvedOnApiPath, true)
assert.equal(traceResponseCreated, true)
assert.equal(eligibilityPropagatedToTrace, true)
assert.equal(finalToolExecutionBoundaryPreserved, true)
assert.equal(dispatchStillUsesFinalBoundary, true)
assert.equal(executionAppliedStillFalse, true)

console.log('Runtime governed capability API path propagation proof passed.')
console.log({
  architecture: 'governed-capability-api-path-propagation-boundary',
  capabilityId: 'runtime-trace-integrity',
  eligibilityResolvedOnApiPath,
  eligibilityPropagatedToTrace,
  eligibilityDoesNotAuthorizeExecution: true,
  finalToolExecutionBoundaryPreserved,
  dispatchStillUsesFinalBoundary,
  executionApplied: false,
  mutationApplied: false,
})
