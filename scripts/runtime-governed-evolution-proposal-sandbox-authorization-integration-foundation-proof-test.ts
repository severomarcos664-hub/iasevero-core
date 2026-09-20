import assert from 'node:assert/strict'
import { evaluateRuntimeGovernedEvolutionProposalSandboxAuthorizationIntegration } from '../app/lib/runtime-core/runtime-governed-evolution-proposal-sandbox-authorization-integration'

const proposal = {
  id: 'self-development-v287749-proof',
  allowedEnvironment: 'sandbox-only' as const,
  reversible: true,
  requiresHumanApproval: true,
}

const authorized = evaluateRuntimeGovernedEvolutionProposalSandboxAuthorizationIntegration({
  executionKey: proposal.id,
  proposal,
  sandboxExecutionAuthorized: true,
  toolRegistered: true,
  toolAllowed: true,
  governanceApproved: true,
  finalAuthorizationGranted: true,
})

assert.equal(authorized.integrationEvaluated, true)
assert.equal(authorized.proposalIdentityBound, true)
assert.equal(authorized.sandboxOnlyVerified, true)
assert.equal(authorized.executionAuthorized, true)
assert.equal(authorized.dispatchApplied, false)
assert.equal(authorized.executionApplied, false)
assert.equal(authorized.mutationApplied, false)
assert.equal(authorized.networkAuthorityGranted, false)
assert.equal(authorized.productionMutationApplied, false)
assert.equal(authorized.selfPromotionApplied, false)

const invalidEnvironment = evaluateRuntimeGovernedEvolutionProposalSandboxAuthorizationIntegration({
  executionKey: proposal.id,
  proposal: { ...proposal, allowedEnvironment: 'production' as 'sandbox-only' },
  sandboxExecutionAuthorized: true,
  toolRegistered: true,
  toolAllowed: true,
  governanceApproved: true,
  finalAuthorizationGranted: true,
})

assert.equal(invalidEnvironment.proposalIdentityBound, false)
assert.equal(invalidEnvironment.executionAuthorized, false)
assert.equal(invalidEnvironment.executionApplied, false)
assert.equal(invalidEnvironment.mutationApplied, false)

console.log('Runtime governed evolution proposal sandbox authorization integration foundation proof passed.')
