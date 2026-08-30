import type {
  RuntimeToolControlledExternalReadInvocationPreparation,
} from './runtime-tool-controlled-external-read-invocation-preparation'

import type {
  RuntimeToolControlledExternalReadContextualAdmissionGrant,
} from './runtime-tool-controlled-external-read-contextual-admission-authority'

import type {
  RuntimeExecutionBoundAuthorityDecision,
} from '../runtime-executive-authority-gateway/runtime-execution-bound-authority'

export type RuntimeToolControlledExternalReadContextualAdmissionGrantBoundaryInput = {
  preparation: RuntimeToolControlledExternalReadInvocationPreparation
  executionAuthority: RuntimeExecutionBoundAuthorityDecision
}

export type RuntimeToolControlledExternalReadContextualAdmissionGrantBoundaryDecision = {
  toolId: 'external.read'
  executionKey: string

  grantPrepared: boolean
  contextualGrant: RuntimeToolControlledExternalReadContextualAdmissionGrant | null

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function evaluateRuntimeToolControlledExternalReadContextualAdmissionGrantBoundary(
  input: RuntimeToolControlledExternalReadContextualAdmissionGrantBoundaryInput,
): RuntimeToolControlledExternalReadContextualAdmissionGrantBoundaryDecision {
  const { preparation, executionAuthority } = input

  const preparationEligible =
    preparation.toolId === 'external.read' &&
    preparation.invocationPreparationValidated === true &&
    nonEmpty(preparation.executionKey) &&
    nonEmpty(preparation.correlationId) &&
    nonEmpty(preparation.traceId) &&
    nonEmpty(preparation.stepId) &&
    preparation.networkAccess === false &&
    preparation.externalReadApplied === false &&
    preparation.executionApplied === false &&
    preparation.mutationApplied === false &&
    preparation.providerInvocation === false

  const authorityEligible =
    executionAuthority.authorityBindingEvaluated === true &&
    executionAuthority.authorityBound === true &&
    executionAuthority.executionAllowed === true &&
    nonEmpty(executionAuthority.executionKey) &&
    executionAuthority.executionKey === preparation.executionKey &&
    executionAuthority.networkAccess === false &&
    executionAuthority.executionApplied === false &&
    executionAuthority.mutationApplied === false &&
    executionAuthority.externalMutation === false &&
    executionAuthority.providerInvocation === false

  const grantPrepared =
    preparationEligible &&
    authorityEligible

  const contextualGrant: RuntimeToolControlledExternalReadContextualAdmissionGrant | null =
    grantPrepared
      ? {
          toolId: 'external.read',
          executionKey: preparation.executionKey,
          admissionAllowed: true,
        }
      : null

  return {
    toolId: 'external.read',
    executionKey: preparation.executionKey,

    grantPrepared,
    contextualGrant,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: grantPrepared
      ? 'Governed external.read contextual admission grant prepared without tool execution.'
      : 'Governed external.read contextual admission grant denied.',
  }
}
