import type {
  RuntimeToolControlledExternalReadPolicy,
} from './runtime-tool-controlled-external-read-contract'

export type RuntimeToolControlledExternalReadAllowlistSourceInput = {
  sourceId: string
  allowedHosts: readonly string[]
  allowedResources: readonly string[]
}

export type RuntimeToolControlledExternalReadAllowlistSourceDecision = {
  sourceEvaluated: true
  configured: boolean
  sourceId: string | null

  policy: RuntimeToolControlledExternalReadPolicy

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

function normalizeUnique(
  values: readonly string[],
  transform: (value: string) => string,
): string[] {
  return [...new Set(
    values
      .map(transform)
      .filter((value) => value.length > 0),
  )]
}

function normalizeHost(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeResource(value: string): string {
  const normalized = value.trim()
  return normalized.startsWith('/') ? normalized : ''
}

export function evaluateRuntimeToolControlledExternalReadAllowlistSource(
  input?: RuntimeToolControlledExternalReadAllowlistSourceInput,
): RuntimeToolControlledExternalReadAllowlistSourceDecision {
  const sourceId = input?.sourceId.trim() || null

  const candidateHosts =
    input === undefined
      ? []
      : normalizeUnique(input.allowedHosts, normalizeHost)

  const candidateResources =
    input === undefined
      ? []
      : normalizeUnique(input.allowedResources, normalizeResource)

  const configured =
    sourceId !== null &&
    candidateHosts.length > 0 &&
    candidateResources.length > 0

  const policy: RuntimeToolControlledExternalReadPolicy = {
    allowedHosts: configured ? candidateHosts : [],
    allowedResources: configured ? candidateResources : [],
    readOnly: true,
    externalCostAllowed: false,
    secretsPermitted: false,
    auditRequired: true,
  }

  return {
    sourceEvaluated: true,
    configured,
    sourceId,

    policy,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: configured
      ? 'Governed controlled external.read allowlist source configured without authorizing network execution.'
      : 'Governed controlled external.read allowlist source remains fail-closed until an explicit valid source is configured.',
  }
}
