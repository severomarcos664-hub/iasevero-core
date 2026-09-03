import type { RuntimeToolControlledExternalReadPolicy } from './runtime-tool-controlled-external-read-contract'

export type RuntimeToolControlledExternalReadPolicyAuthorityDecision = {
  policyAuthorityEvaluated: true
  policyAuthorized: false
  policy: RuntimeToolControlledExternalReadPolicy
  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  externalMutation: false
  providerInvocation: false
  reason: string
}

export function evaluateRuntimeToolControlledExternalReadPolicyAuthority():
  RuntimeToolControlledExternalReadPolicyAuthorityDecision {
  return {
    policyAuthorityEvaluated: true,
    policyAuthorized: false,
    policy: {
      allowedHosts: [],
      allowedResources: [],
      readOnly: true,
      externalCostAllowed: false,
      secretsPermitted: false,
      auditRequired: true,
    },
    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    externalMutation: false,
    providerInvocation: false,
    reason: 'Controlled external-read policy authority remains fail-closed until an explicit governed allowlist source is configured.',
  }
}
