import type {
  RuntimeToolControlledExternalReadTarget,
} from './runtime-tool-controlled-external-read-contract'

export type RuntimeToolControlledExternalReadTargetInputOrigin =
  | 'user-explicit'
  | 'runtime-derived'

export type RuntimeToolControlledExternalReadTargetInputBoundaryInput = {
  readonly target: {
    readonly protocol: unknown
    readonly host: unknown
    readonly resource: unknown
  }
  readonly origin: unknown
}

export type RuntimeToolControlledExternalReadTargetInputBoundaryDecision = {
  readonly targetInputEvaluated: true
  readonly targetInputEligible: boolean
  readonly target: RuntimeToolControlledExternalReadTarget | null
  readonly origin:
    | RuntimeToolControlledExternalReadTargetInputOrigin
    | null

  readonly networkAccess: false
  readonly externalReadApplied: false
  readonly executionApplied: false
  readonly mutationApplied: false
  readonly providerInvocation: false

  readonly reason: string
}

function isValidHost(host: string): boolean {
  if (host.length === 0) {
    return false
  }

  if (
    host.includes('://') ||
    host.includes('/') ||
    host.includes('\\') ||
    host.includes('@') ||
    host.includes(':') ||
    /\s/.test(host)
  ) {
    return false
  }

  if (
    host.startsWith('.') ||
    host.endsWith('.') ||
    host.includes('..')
  ) {
    return false
  }

  return /^[a-z0-9.-]+$/.test(host)
}

function isValidResource(resource: string): boolean {
  return (
    resource.length > 0 &&
    resource.startsWith('/') &&
    !resource.includes('\n') &&
    !resource.includes('\r')
  )
}

function isValidOrigin(
  origin: unknown,
): origin is RuntimeToolControlledExternalReadTargetInputOrigin {
  return (
    origin === 'user-explicit' ||
    origin === 'runtime-derived'
  )
}

export function evaluateRuntimeToolControlledExternalReadTargetInputBoundary(
  input: RuntimeToolControlledExternalReadTargetInputBoundaryInput,
): RuntimeToolControlledExternalReadTargetInputBoundaryDecision {
  const protocol =
    typeof input.target.protocol === 'string'
      ? input.target.protocol.trim().toLowerCase()
      : ''

  const host =
    typeof input.target.host === 'string'
      ? input.target.host.trim().toLowerCase()
      : ''

  const resource =
    typeof input.target.resource === 'string'
      ? input.target.resource.trim()
      : ''

  const protocolValid = protocol === 'https'
  const hostValid = isValidHost(host)
  const resourceValid = isValidResource(resource)
  const originValid = isValidOrigin(input.origin)

  const targetInputEligible =
    protocolValid &&
    hostValid &&
    resourceValid &&
    originValid

  if (!targetInputEligible) {
    return {
      targetInputEvaluated: true,
      targetInputEligible: false,
      target: null,
      origin: originValid ? input.origin : null,

      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
      providerInvocation: false,

      reason:
        'Controlled external read target input was rejected before authorization or effect execution.',
    }
  }

  return {
    targetInputEvaluated: true,
    targetInputEligible: true,

    target: {
      protocol: 'https:',
      host,
      resource,
    },

    origin: input.origin,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason:
      'Controlled external read target input was syntactically eligible for downstream governed evaluation.',
  }
}
