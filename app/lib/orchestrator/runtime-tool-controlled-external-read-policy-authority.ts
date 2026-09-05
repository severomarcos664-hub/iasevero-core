import type {
  RuntimeToolControlledExternalReadPolicy,
} from './runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolControlledExternalReadAllowlistSourceDecision,
} from './runtime-tool-controlled-external-read-allowlist-source'

export type RuntimeToolControlledExternalReadPolicyAuthorityDecision = {
  policyAuthorityEvaluated: true
  policyAuthorized: boolean

  policy: RuntimeToolControlledExternalReadPolicy

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  externalMutation: false
  providerInvocation: false

  reason: string
}

function failClosedPolicy(): RuntimeToolControlledExternalReadPolicy {
  return {
    allowedHosts: [],
    allowedResources: [],
    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  }
}

function isGovernedSourceValid(
  source:
    | RuntimeToolControlledExternalReadAllowlistSourceDecision
    | undefined,
): source is RuntimeToolControlledExternalReadAllowlistSourceDecision {
  if (
    source === undefined ||
    source.sourceEvaluated !== true ||
    source.configured !== true ||
    source.sourceId === null ||
    source.sourceId.trim().length === 0
  ) {
    return false
  }

  if (
    source.networkAccess !== false ||
    source.externalReadApplied !== false ||
    source.executionApplied !== false ||
    source.mutationApplied !== false ||
    source.providerInvocation !== false
  ) {
    return false
  }

  const policy = source.policy

  if (
    policy.readOnly !== true ||
    policy.externalCostAllowed !== false ||
    policy.secretsPermitted !== false ||
    policy.auditRequired !== true
  ) {
    return false
  }

  if (
    policy.allowedHosts.length === 0 ||
    policy.allowedResources.length === 0
  ) {
    return false
  }

  const hostsValid = policy.allowedHosts.every(
    (host) =>
      host.length > 0 &&
      host === host.trim() &&
      host === host.toLowerCase(),
  )

  const resourcesValid = policy.allowedResources.every(
    (resource) =>
      resource.length > 0 &&
      resource === resource.trim() &&
      resource.startsWith('/'),
  )

  return hostsValid && resourcesValid
}

export function evaluateRuntimeToolControlledExternalReadPolicyAuthority(
  source?: RuntimeToolControlledExternalReadAllowlistSourceDecision,
): RuntimeToolControlledExternalReadPolicyAuthorityDecision {
  const policyAuthorized = isGovernedSourceValid(source)

  const policy: RuntimeToolControlledExternalReadPolicy =
    policyAuthorized
      ? {
          allowedHosts: [...source.policy.allowedHosts],
          allowedResources: [...source.policy.allowedResources],
          readOnly: true,
          externalCostAllowed: false,
          secretsPermitted: false,
          auditRequired: true,
        }
      : failClosedPolicy()

  return {
    policyAuthorityEvaluated: true,
    policyAuthorized,
    policy,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    externalMutation: false,
    providerInvocation: false,

    reason: policyAuthorized
      ? 'Controlled external-read policy authority accepted an explicit governed allowlist source without authorizing network execution.'
      : 'Controlled external-read policy authority remains fail-closed until an explicit governed allowlist source is configured.',
  }
}
