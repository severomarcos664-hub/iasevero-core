import assert from 'node:assert/strict'

import {
  assessAppliedIntelligenceCapabilityAuthorization,
} from '../app/runtime/capabilities/runtime-capability-registry'

import {
  evaluateRuntimeExecutiveAuthorityGateway,
} from '../app/lib/runtime-executive-authority-gateway/runtime-executive-authority-gateway'

const eligibleAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(
    'runtime-trace-integrity',
  )

assert.equal(eligibleAssessment.decision, 'eligible')
assert.equal(eligibleAssessment.authorizationAssessed, true)
assert.equal(eligibleAssessment.executionAuthorized, false)
assert.equal(eligibleAssessment.dispatchApplied, false)
assert.equal(eligibleAssessment.executionApplied, false)
assert.equal(eligibleAssessment.mutationApplied, false)

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
 * Capability governance may preserve an executive authority
 * that already exists, but must never create or elevate it.
 */
const baselineExecutionAllowed =
  eligibleAuthority.executionAllowed

assert.equal(
  eligibleAuthority.executionAllowed,
  baselineExecutionAllowed,
)

const unknownAssessment =
  assessAppliedIntelligenceCapabilityAuthorization(
    'non-existent-capability-v28613-closure-proof',
  )

assert.equal(unknownAssessment.decision, 'unknown')
assert.equal(unknownAssessment.authorizationAssessed, true)
assert.equal(unknownAssessment.executionAuthorized, false)
assert.equal(unknownAssessment.dispatchApplied, false)
assert.equal(unknownAssessment.executionApplied, false)
assert.equal(unknownAssessment.mutationApplied, false)

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
  'Runtime governed capability end-to-end closure proof passed.',
)

console.log({
  architecture:
    'governed-capability-end-to-end-closure',

  eligibleDecision:
    eligibleAssessment.decision,

  eligibleAssessmentDoesNotGrantExecution:
    eligibleAssessment.executionAuthorized === false,

  eligibleConstraintAllowsAuthorityEvaluation:
    eligibleAuthority.capabilityAuthorizationAllowsExecution,

  capabilityDoesNotElevateExecutiveAuthority:
    eligibleAuthority.executionAllowed ===
    baselineExecutionAllowed,

  unknownDecision:
    unknownAssessment.decision,

  unknownCapabilityRestrictsAuthority:
    unknownAuthority.executionAllowed === false,

  dispatchApplied:
    eligibleAssessment.dispatchApplied ||
    unknownAssessment.dispatchApplied,

  executionApplied:
    eligibleAssessment.executionApplied ||
    unknownAssessment.executionApplied,

  mutationApplied:
    eligibleAssessment.mutationApplied ||
    unknownAssessment.mutationApplied,
})
