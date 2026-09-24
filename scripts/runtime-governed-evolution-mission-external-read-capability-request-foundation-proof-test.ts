import assert from 'node:assert/strict'
import { prepareGovernedEvolutionMissionExternalReadCapabilityRequest } from '../app/lib/runtime-core/runtime-governed-evolution-mission-external-read-capability-request'

const decision = prepareGovernedEvolutionMissionExternalReadCapabilityRequest({
  cognitiveKernelAdmissionIntegrationDecision: {
    integrationEvaluated: true,
    missionIdentityBound: true,
    cognitiveKernelAdmissionPrepared: true,
    permanentMissionIntegrationEligible: true,
    permanentMissionIntegrationPrepared: true,
    executionKey: 'mission-v287.74.22',
    correlationId: 'correlation-v287.74.22',
    traceId: 'trace-v287.74.22',
    stepId: 'step-v287.74.22',
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  },
  targetInput: {
    target: {
      protocol: 'https:',
      host: 'example.com',
      resource: '/',
    },
    origin: 'runtime-derived',
  },
})

assert.equal(decision.capabilityRequestEvaluated, true)
assert.equal(decision.missionIdentityBound, true)
assert.equal(decision.externalReadCapabilityRequested, true)
assert.equal(decision.externalReadCapabilityRequestPrepared, true)
assert.equal(decision.requestTargetEvaluated, true)
assert.equal(decision.requestTargetEligible, true)

assert.equal(decision.executionKey, 'mission-v287.74.22')
assert.equal(decision.correlationId, 'correlation-v287.74.22')
assert.equal(decision.traceId, 'trace-v287.74.22')
assert.equal(decision.stepId, 'step-v287.74.22')

assert.equal(decision.networkAuthorityGranted, false)
assert.equal(decision.networkAccess, false)
assert.equal(decision.externalReadApplied, false)
assert.equal(decision.dispatchApplied, false)
assert.equal(decision.executionApplied, false)
assert.equal(decision.mutationApplied, false)
assert.equal(decision.providerInvocation, false)

console.log('v287.74.22 governed evolution mission external read capability request foundation proof passed.')
