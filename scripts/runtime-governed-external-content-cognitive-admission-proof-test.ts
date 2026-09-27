import assert from 'node:assert/strict'

import { evaluateRuntimeToolGovernedExternalContentCognitiveAdmission } from '../app/lib/orchestrator/runtime-tool-governed-external-content-cognitive-admission'
import { evaluateRuntimeToolGovernedExternalContentCognitiveUseAuthority } from '../app/lib/orchestrator/runtime-tool-governed-external-content-cognitive-use-authority'

const identity = {
  executionKey: 'research-001',
  correlationId: 'correlation-001',
  traceId: 'trace-001',
  stepId: 'step-001',
}

const admitted = evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
  ...identity,
  evidenceVerified: true,
  inboundContentAccepted: true,
  cognitiveUseAuthorizationGranted: true,
})

assert.equal(admitted.admissionEvaluated, true)
assert.equal(admitted.identityBound, true)
assert.equal(admitted.cognitiveUseEligible, true)
assert.equal(admitted.safeForCognitiveUse, true)

assert.equal(admitted.trustEstablished, false)
assert.equal(admitted.memoryEligible, false)
assert.equal(admitted.learningEligible, false)
assert.equal(admitted.executionApplied, false)
assert.equal(admitted.mutationApplied, false)
assert.equal(admitted.providerInvocation, false)
assert.equal(admitted.productionMutationApplied, false)
assert.equal(admitted.selfPromotionApplied, false)

const unauthorized =
  evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
    ...identity,
    evidenceVerified: true,
    inboundContentAccepted: true,
    cognitiveUseAuthorizationGranted: false,
  })

assert.equal(unauthorized.admissionEvaluated, true)
assert.equal(unauthorized.cognitiveUseEligible, false)
assert.equal(unauthorized.safeForCognitiveUse, false)

const unsafe =
  evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
    ...identity,
    evidenceVerified: true,
    inboundContentAccepted: false,
    cognitiveUseAuthorizationGranted: true,
  })

assert.equal(unsafe.cognitiveUseEligible, false)
assert.equal(unsafe.safeForCognitiveUse, false)

const unverified =
  evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
    ...identity,
    evidenceVerified: false,
    inboundContentAccepted: true,
    cognitiveUseAuthorizationGranted: true,
  })

assert.equal(unverified.cognitiveUseEligible, false)
assert.equal(unverified.safeForCognitiveUse, false)

const authority = evaluateRuntimeToolGovernedExternalContentCognitiveUseAuthority({
  ...identity,
  purpose: 'research',
  explicitAuthorization: true,
})

assert.equal(authority.authorityEvaluated, true)
assert.equal(authority.identityBound, true)
assert.equal(authority.purposeAuthorized, true)
assert.equal(authority.cognitiveUseAuthorizationGranted, true)
assert.equal(authority.trustEstablished, false)
assert.equal(authority.memoryAuthorityGranted, false)
assert.equal(authority.learningAuthorityGranted, false)
assert.equal(authority.executionAuthorityGranted, false)
assert.equal(authority.mutationAuthorityGranted, false)
assert.equal(authority.providerAuthorityGranted, false)
assert.equal(authority.productionMutationAuthorityGranted, false)
assert.equal(authority.selfPromotionAuthorityGranted, false)

const composedAdmission =
  evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
    ...identity,
    evidenceVerified: true,
    inboundContentAccepted: true,
    cognitiveUseAuthorizationGranted:
      authority.cognitiveUseAuthorizationGranted,
  })

assert.equal(composedAdmission.cognitiveUseEligible, true)
assert.equal(composedAdmission.safeForCognitiveUse, true)
assert.equal(composedAdmission.trustEstablished, false)
assert.equal(composedAdmission.memoryEligible, false)
assert.equal(composedAdmission.learningEligible, false)

const deniedAuthority =
  evaluateRuntimeToolGovernedExternalContentCognitiveUseAuthority({
    ...identity,
    purpose: 'research',
    explicitAuthorization: false,
  })

const deniedComposition =
  evaluateRuntimeToolGovernedExternalContentCognitiveAdmission({
    ...identity,
    evidenceVerified: true,
    inboundContentAccepted: true,
    cognitiveUseAuthorizationGranted:
      deniedAuthority.cognitiveUseAuthorizationGranted,
  })

assert.equal(deniedAuthority.cognitiveUseAuthorizationGranted, false)
assert.equal(deniedComposition.cognitiveUseEligible, false)
assert.equal(deniedComposition.safeForCognitiveUse, false)

console.log(
  'Runtime governed external content cognitive admission proof passed.',
)
