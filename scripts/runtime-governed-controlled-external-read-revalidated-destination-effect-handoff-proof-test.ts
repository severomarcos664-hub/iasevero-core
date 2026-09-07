import assert from 'node:assert/strict'

import {
  evaluateRuntimeToolControlledExternalReadRevalidatedEffectHandoffBoundary,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect-handoff-boundary'

const executionGate: any = {
  executionKey: 'v28771:test',
  correlationId: 'corr-v28771',
  traceId: 'trace-v28771',
  stepId: 'step-v28771',
  externalReadAuthorizationEvaluated: true,
  externalReadAuthorized: true,
  executionGateStatus: 'eligible',
  externalReadExecutionEligible: true,
  networkAccess: false,
  externalReadApplied: false,
  executionApplied: false,
  mutationApplied: false,
  providerInvocation: false,
}

const acceptedRevalidation: any = {
  revalidationStatus: 'accepted',
  hostname: 'example.com',
  bindingKey: 'example.com:203.0.113.10',
  originalApprovedAddresses: ['203.0.113.10'],
  revalidatedApprovedAddresses: ['203.0.113.10'],
  reason: 'test accepted',
}

const blockedRevalidation: any = {
  ...acceptedRevalidation,
  revalidationStatus: 'blocked',
  reason: 'test blocked',
}

const accepted =
  evaluateRuntimeToolControlledExternalReadRevalidatedEffectHandoffBoundary(
    executionGate,
    acceptedRevalidation,
  )

const blocked =
  evaluateRuntimeToolControlledExternalReadRevalidatedEffectHandoffBoundary(
    executionGate,
    blockedRevalidation,
  )

assert.equal(accepted.effectHandoffStatus, 'prepared')
assert.equal(accepted.effectHandoffPrepared, true)

assert.equal(
  blocked.effectHandoffStatus,
  'blocked',
  'blocked DNS revalidation must block effect handoff',
)

assert.equal(
  blocked.effectHandoffPrepared,
  false,
  'blocked DNS revalidation must prevent handoff preparation',
)

console.log({
  architecture:
    'authorization -> dns-revalidation -> canonical-effect-handoff -> future-https-effect',
  acceptedStatus: accepted.effectHandoffStatus,
  blockedStatus: blocked.effectHandoffStatus,
  networkAccess: false,
  executionApplied: false,
})

console.log('V287.71 semantic handoff proof passed.')
