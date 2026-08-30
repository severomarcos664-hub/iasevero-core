import type {
  RuntimeToolControlledExternalReadInvocationPreparation,
} from './runtime-tool-controlled-external-read-invocation-preparation'

import type {
  RuntimeExecutionBoundAuthorityDecision,
} from '../runtime-executive-authority-gateway/runtime-execution-bound-authority'

export type RuntimeToolControlledExternalReadContextualAdmissionGrant = {
  toolId: 'external.read'
  executionKey: string
  admissionAllowed: boolean
}

export type RuntimeToolControlledExternalReadContextualAdmissionInput = {
  preparation: RuntimeToolControlledExternalReadInvocationPreparation
  executionAuthority: RuntimeExecutionBoundAuthorityDecision
  contextualGrant: RuntimeToolControlledExternalReadContextualAdmissionGrant
}

export type RuntimeToolControlledExternalReadContextualAdmissionDecision = {
  toolId: 'external.read'

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  invocationPrepared: boolean
  executionAuthorityMatched: boolean
  contextualAuthorityMatched: boolean
  contextualAdmission: boolean

  registryMutationApplied: false

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

export function evaluateRuntimeToolControlledExternalReadContextualAdmissionAuthority(
  input: RuntimeToolControlledExternalReadContextualAdmissionInput,
): RuntimeToolControlledExternalReadContextualAdmissionDecision {
  const preparation = input.preparation
  const executionAuthority = input.executionAuthority
  const contextualGrant = input.contextualGrant

  const invocationPrepared =
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

  const executionAuthorityMatched =
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

  const contextualAuthorityMatched =
    contextualGrant.toolId === 'external.read' &&
    contextualGrant.admissionAllowed === true &&
    nonEmpty(contextualGrant.executionKey) &&
    contextualGrant.executionKey === preparation.executionKey

  const contextualAdmission =
    invocationPrepared &&
    executionAuthorityMatched &&
    contextualAuthorityMatched

  return {
    toolId: 'external.read',

    executionKey: preparation.executionKey,
    correlationId: preparation.correlationId,
    traceId: preparation.traceId,
    stepId: preparation.stepId,

    invocationPrepared,
    executionAuthorityMatched,
    contextualAuthorityMatched,
    contextualAdmission,

    registryMutationApplied: false,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: contextualAdmission
      ? 'Governed external.read contextual admission granted for the bound execution without tool execution.'
      : 'Governed external.read contextual admission denied.',
  }
}
