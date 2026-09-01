import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from './runtime-tool-controlled-executor-boundary'

import type {
  RuntimeToolControlledExternalReadContextualAdmissionDecision,
} from './runtime-tool-controlled-external-read-contextual-admission-authority'

export type RuntimeToolControlledExternalReadExecutorAdmissionBoundaryInput = {
  executorBoundary: RuntimeToolControlledExecutorBoundaryDecision
  contextualAdmissionAuthority:
    RuntimeToolControlledExternalReadContextualAdmissionDecision
}

export type RuntimeToolControlledExternalReadExecutorAdmissionBoundaryDecision = {
  toolId: 'external.read'

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  identityMatched: boolean
  invocationPrepared: boolean

  toolRegistered: boolean
  registryDefaultDenied: boolean
  policyMatched: boolean

  contextualAdmissionMatched: boolean
  executorEligible: boolean

  registryMutationApplied: false

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

export function evaluateRuntimeToolControlledExternalReadExecutorAdmissionBoundary(
  input: RuntimeToolControlledExternalReadExecutorAdmissionBoundaryInput,
): RuntimeToolControlledExternalReadExecutorAdmissionBoundaryDecision {
  const executorBoundary = input.executorBoundary
  const contextualAdmissionAuthority = input.contextualAdmissionAuthority

  const identityMatched =
    executorBoundary.toolId === 'external.read' &&
    contextualAdmissionAuthority.toolId === 'external.read' &&
    executorBoundary.executionKey === contextualAdmissionAuthority.executionKey &&
    executorBoundary.correlationId === contextualAdmissionAuthority.correlationId &&
    executorBoundary.traceId === contextualAdmissionAuthority.traceId &&
    executorBoundary.stepId === contextualAdmissionAuthority.stepId

  const invocationPrepared =
    executorBoundary.invocationPrepared === true &&
    contextualAdmissionAuthority.invocationPrepared === true

  const registryDefaultDenied =
    executorBoundary.toolRegistered === true &&
    executorBoundary.toolAllowed === false

  const genericBoundarySafelyBlocked =
    executorBoundary.executorEligible === false &&
    executorBoundary.executorBoundaryStatus === 'blocked' &&
    executorBoundary.executionApplied === false &&
    executorBoundary.mutationApplied === false

  const contextualAdmissionMatched =
    contextualAdmissionAuthority.executionAuthorityMatched === true &&
    contextualAdmissionAuthority.contextualAuthorityMatched === true &&
    contextualAdmissionAuthority.contextualAdmission === true &&
    contextualAdmissionAuthority.registryMutationApplied === false &&
    contextualAdmissionAuthority.networkAccess === false &&
    contextualAdmissionAuthority.externalReadApplied === false &&
    contextualAdmissionAuthority.executionApplied === false &&
    contextualAdmissionAuthority.mutationApplied === false &&
    contextualAdmissionAuthority.providerInvocation === false

  const executorEligible =
    identityMatched &&
    invocationPrepared &&
    executorBoundary.toolRegistered === true &&
    registryDefaultDenied &&
    executorBoundary.policyMatched === true &&
    genericBoundarySafelyBlocked &&
    contextualAdmissionMatched

  return {
    toolId: 'external.read',

    executionKey: executorBoundary.executionKey,
    correlationId: executorBoundary.correlationId,
    traceId: executorBoundary.traceId,
    stepId: executorBoundary.stepId,

    identityMatched,
    invocationPrepared,

    toolRegistered: executorBoundary.toolRegistered,
    registryDefaultDenied,
    policyMatched: executorBoundary.policyMatched,

    contextualAdmissionMatched,
    executorEligible,

    registryMutationApplied: false,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason: executorEligible
      ? 'Governed external.read contextual admission reconciled with the fail-closed executor boundary without registry mutation or tool execution.'
      : 'Governed external.read executor admission denied.',
  }
}
