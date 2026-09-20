import { evaluateRuntimeGovernedSandboxExecutionBoundAuthorization } from './runtime-governed-sandbox-execution-bound-authorization'

export type RuntimeGovernedEvolutionProposalSandboxAuthorizationIntegrationInput = {
  executionKey: string
  proposal: {
    id: string
    allowedEnvironment: string
    reversible: boolean
    requiresHumanApproval: boolean
  }
  sandboxExecutionAuthorized: boolean
  toolRegistered: boolean
  toolAllowed: boolean
  governanceApproved: boolean
  finalAuthorizationGranted: boolean
}

export type RuntimeGovernedEvolutionProposalSandboxAuthorizationIntegrationDecision = {
  integrationEvaluated: true
  proposalIdentityBound: boolean
  sandboxOnlyVerified: boolean
  executionAuthorized: boolean
  dispatchApplied: false
  executionApplied: false
  mutationApplied: false
  networkAuthorityGranted: false
  productionMutationApplied: false
  selfPromotionApplied: false
}

export function evaluateRuntimeGovernedEvolutionProposalSandboxAuthorizationIntegration(
  input: RuntimeGovernedEvolutionProposalSandboxAuthorizationIntegrationInput,
): RuntimeGovernedEvolutionProposalSandboxAuthorizationIntegrationDecision {
  const executionKey = input.executionKey.trim()
  const proposalId = input.proposal.id.trim()
  const proposalIdentityBound =
    executionKey.length > 0 &&
    proposalId.length > 0 &&
    executionKey === proposalId &&
    input.proposal.reversible === true

  const sandboxOnlyVerified =
    proposalIdentityBound && input.proposal.allowedEnvironment === 'sandbox-only'

  const authorization =
    evaluateRuntimeGovernedSandboxExecutionBoundAuthorization({
      executionKey: sandboxOnlyVerified ? executionKey : '',
      sandboxExecutionAuthorized:
        sandboxOnlyVerified && input.sandboxExecutionAuthorized === true,
      toolRegistered: input.toolRegistered,
      toolAllowed: input.toolAllowed,
      governanceApproved: input.governanceApproved,
      finalAuthorizationGranted: input.finalAuthorizationGranted,
    })

  return {
    integrationEvaluated: true,
    proposalIdentityBound: proposalIdentityBound && sandboxOnlyVerified,
    sandboxOnlyVerified,
    executionAuthorized: authorization.executionAuthorized,
    dispatchApplied: false,
    executionApplied: false,
    mutationApplied: false,
    networkAuthorityGranted: false,
    productionMutationApplied: false,
    selfPromotionApplied: false,
  }
}
