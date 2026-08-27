import type {
  RuntimeToolControlledExternalReadTargetInputBoundaryInput,
} from './runtime-tool-controlled-external-read-target-input-boundary'

export type RuntimeToolControlledExternalReadRequestTargetContractInput = {
  readonly externalReadTarget?: unknown
}

export type RuntimeToolControlledExternalReadRequestTargetContractDecision = {
  readonly requestTargetEvaluated: true
  readonly requestTargetEligible: boolean
  readonly targetInput:
    | RuntimeToolControlledExternalReadTargetInputBoundaryInput
    | null

  readonly networkAccess: false
  readonly externalReadApplied: false
  readonly executionApplied: false
  readonly mutationApplied: false
  readonly providerInvocation: false

  readonly reason: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

export function evaluateRuntimeToolControlledExternalReadRequestTargetContract(
  input: RuntimeToolControlledExternalReadRequestTargetContractInput,
): RuntimeToolControlledExternalReadRequestTargetContractDecision {
  const rawTarget = input.externalReadTarget

  const structurallyEligible =
    isRecord(rawTarget) &&
    Object.prototype.hasOwnProperty.call(rawTarget, 'protocol') &&
    Object.prototype.hasOwnProperty.call(rawTarget, 'host') &&
    Object.prototype.hasOwnProperty.call(rawTarget, 'resource')

  if (!structurallyEligible) {
    return {
      requestTargetEvaluated: true,
      requestTargetEligible: false,
      targetInput: null,

      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
      providerInvocation: false,

      reason: 'request-external-read-target-absent-or-malformed',
    }
  }

  return {
    requestTargetEvaluated: true,
    requestTargetEligible: true,

    targetInput: {
      target: {
        protocol:
          typeof rawTarget.protocol === 'string'
            ? rawTarget.protocol.trim()
            : rawTarget.protocol,
        host:
          typeof rawTarget.host === 'string'
            ? rawTarget.host.trim()
            : rawTarget.host,
        resource:
          typeof rawTarget.resource === 'string'
            ? rawTarget.resource.trim()
            : rawTarget.resource,
      },
      origin: 'user-explicit',
    },

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: 'request-external-read-target-structurally-accepted',
  }
}
