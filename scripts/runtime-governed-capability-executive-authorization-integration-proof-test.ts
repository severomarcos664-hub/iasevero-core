import assert from 'node:assert/strict'

import {
  assessAppliedIntelligenceCapabilityAuthorization,
} from '../app/runtime/capabilities/runtime-capability-registry'

import {
  evaluateRuntimeExecutiveAuthorityGateway,
} from '../app/lib/runtime-executive-authority-gateway/runtime-executive-authority-gateway'

const baseline =
  evaluateRuntimeExecutiveAuthorityGateway()

const eligibleAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(
    'runtime-trace-integrity',
  )

assert.equal(
  eligibleAssessment.decision,
  'eligible',
)

assert.equal(
  eligibleAssessment.authorizationAssessed,
  true,
)

assert.equal(
  eligibleAssessment.executionAuthorized,
  false,
)

const eligibleAuthority =
  evaluateRuntimeExecutiveAuthorityGateway({
    authorizationAssessed:
      eligibleAssessment.authorizationAssessed,
    decision:
      eligibleAssessment.decision,
    executionAuthorized:
      eligibleAssessment.executionAuthorized,
  })

assert.equal(
  eligibleAuthority.capabilityAuthorizationIntegrated,
  true,
)

assert.equal(
  eligibleAuthority.capabilityAuthorizationAllowsExecution,
  true,
)

/*
 * Capability eligibility must never elevate executive authority.
 * When the capability constraint allows progression, the result
 * must remain exactly the authority result that already existed.
 */
assert.equal(
  eligibleAuthority.executionAllowed,
  baseline.executionAllowed,
)

const unknownAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(
    'non-existent-capability-v28612-proof',
  )

assert.equal(
  unknownAssessment.decision,
  'unknown',
)

assert.equal(
  unknownAssessment.authorizationAssessed,
  true,
)

assert.equal(
  unknownAssessment.executionAuthorized,
  false,
)

const unknownAuthority =
  evaluateRuntimeExecutiveAuthorityGateway({
    authorizationAssessed:
      unknownAssessment.authorizationAssessed,
    decision:
      unknownAssessment.decision,
    executionAuthorized:
      unknownAssessment.executionAuthorized,
  })

assert.equal(
  unknownAuthority.capabilityAuthorizationIntegrated,
  true,
)

assert.equal(
  unknownAuthority.capabilityAuthorizationAllowsExecution,
  false,
)

assert.equal(
  unknownAuthority.executionAllowed,
  false,
)

console.log(
  'Runtime governed capability executive authorization integration proof passed.',
)

console.log({
  architecture:
    'governed-capability-executive-authorization-integration',

  baselineExecutionAllowed:
    baseline.executionAllowed,

  eligibleDecision:
    eligibleAssessment.decision,

  authorizationAssessed:
    eligibleAssessment.authorizationAssessed,

  assessmentDoesNotGrantExecution:
    eligibleAssessment.executionAuthorized === false,

  eligibleConstraintAllowsAuthorityEvaluation:
    eligibleAuthority.capabilityAuthorizationAllowsExecution,

  eligibleDoesNotElevateExecutiveAuthority:
    eligibleAuthority.executionAllowed ===
    baseline.executionAllowed,

  unknownCapabilityRestrictsAuthority:
    unknownAuthority.executionAllowed === false,

  executiveAuthorityOwnerPreserved: true,

  dispatchApplied: false,
  executionApplied: false,
  mutationApplied: false,
})
