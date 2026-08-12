import { createRuntimeToolRegistry } from '../runtime-core/runtime-tool-registry'
import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from './runtime-tool-controlled-executor-boundary'

export type RuntimeToolControlledExternalReadTarget = {
  protocol: 'https:'
  host: string
  resource: string
}

export type RuntimeToolControlledExternalReadPolicy = {
  allowedHosts: readonly string[]
  allowedResources: readonly string[]

  readOnly: true
  externalCostAllowed: false
  secretsPermitted: false
  auditRequired: true
}

export type RuntimeToolControlledExternalReadContractInput = {
  envelope: RuntimeToolExecutionInvocationEnvelope
  boundary: RuntimeToolControlledExecutorBoundaryDecision

  target: RuntimeToolControlledExternalReadTarget
  policy: RuntimeToolControlledExternalReadPolicy
}

export type RuntimeToolControlledExternalReadContractDecision = {
  toolId: string
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  invocationPrepared: boolean
  boundaryEligible: boolean
  identityMatched: boolean

  targetValid: boolean
  hostAllowed: boolean
  resourceAllowed: boolean

  readOnly: boolean
  costPolicyMatched: boolean
  secretPolicyMatched: boolean
  auditRequired: boolean

  contractEligible: boolean
  contractStatus: 'eligible' | 'blocked'

  networkAccess: false
  externalReadApplied: false
  executionApplied: false

  externalMutation: false
  mutationApplied: false

  providerInvocation: false

  reason: string
}

function normalizeHost(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeResource(value: string): string {
  return value.trim()
}

export function evaluateRuntimeToolControlledExternalReadContract(
  input: RuntimeToolControlledExternalReadContractInput,
): RuntimeToolControlledExternalReadContractDecision {
  const {
    envelope,
    boundary,
    target,
    policy,
  } = input

  const invocationPrepared =
    envelope.adapterAccepted === true &&
    envelope.invocationPrepared === true &&
    envelope.executionApplied === false &&
    envelope.mutationApplied === false &&
    envelope.toolId.trim().length > 0 &&
    envelope.executionKey.trim().length > 0 &&
    envelope.correlationId.trim().length > 0 &&
    envelope.traceId.trim().length > 0 &&
    envelope.stepId.trim().length > 0 &&
    envelope.idempotencyKey.trim().length > 0

  const identityMatched =
    boundary.toolId === envelope.toolId &&
    boundary.executionKey === envelope.executionKey &&
    boundary.correlationId === envelope.correlationId &&
    boundary.traceId === envelope.traceId &&
    boundary.stepId === envelope.stepId

  const registry = createRuntimeToolRegistry()

  const registeredTool =
    registry.tools.find(
      (candidate) => candidate.id === envelope.toolId,
    ) ?? null

  const registryToolRegistered = registeredTool !== null
  const registryToolAllowed = registeredTool?.allowed === true

  const toolAllowlistReconciled =
    boundary.toolRegistered === true &&
    boundary.toolAllowed === true &&
    registryToolRegistered &&
    registryToolAllowed

  const boundaryEligible =
    boundary.invocationPrepared === true &&
    toolAllowlistReconciled &&
    boundary.policyMatched === true &&
    boundary.executorEligible === true &&
    boundary.executorBoundaryStatus === 'eligible' &&
    boundary.executionApplied === false &&
    boundary.mutationApplied === false

  const normalizedHost = normalizeHost(target.host)
  const normalizedResource = normalizeResource(target.resource)

  const targetValid =
    target.protocol === 'https:' &&
    normalizedHost.length > 0 &&
    normalizedResource.length > 0

  const hostAllowed =
    targetValid &&
    policy.allowedHosts.some(
      (candidate) =>
        normalizeHost(candidate) === normalizedHost,
    )

  const resourceAllowed =
    targetValid &&
    policy.allowedResources.some(
      (candidate) =>
        normalizeResource(candidate) === normalizedResource,
    )

  const readOnly =
    policy.readOnly === true

  const costPolicyMatched =
    policy.externalCostAllowed === false

  const secretPolicyMatched =
    policy.secretsPermitted === false

  const auditRequired =
    policy.auditRequired === true

  const contractEligible =
    invocationPrepared &&
    identityMatched &&
    boundaryEligible &&
    targetValid &&
    hostAllowed &&
    resourceAllowed &&
    readOnly &&
    costPolicyMatched &&
    secretPolicyMatched &&
    auditRequired

  let reason =
    'Governed controlled external-read contract is eligible without external access.'

  if (!invocationPrepared) {
    reason =
      'Controlled external-read contract blocked because invocation preparation is invalid.'
  } else if (!identityMatched) {
    reason =
      'Controlled external-read contract blocked because execution identity does not match the controlled boundary.'
  } else if (!boundaryEligible) {
    reason =
      'Controlled external-read contract blocked because the controlled executor boundary is not eligible.'
  } else if (!targetValid) {
    reason =
      'Controlled external-read contract blocked because the external target is invalid.'
  } else if (!hostAllowed) {
    reason =
      'Controlled external-read contract blocked because the external host is not allowlisted.'
  } else if (!resourceAllowed) {
    reason =
      'Controlled external-read contract blocked because the external resource is not allowlisted.'
  } else if (!readOnly) {
    reason =
      'Controlled external-read contract blocked because read-only policy is required.'
  } else if (!costPolicyMatched) {
    reason =
      'Controlled external-read contract blocked because external cost is not authorized.'
  } else if (!secretPolicyMatched) {
    reason =
      'Controlled external-read contract blocked because secret exposure is not permitted.'
  } else if (!auditRequired) {
    reason =
      'Controlled external-read contract blocked because audit evidence is required.'
  }

  return {
    toolId: envelope.toolId,
    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    invocationPrepared,
    boundaryEligible,
    identityMatched,

    targetValid,
    hostAllowed,
    resourceAllowed,

    readOnly,
    costPolicyMatched,
    secretPolicyMatched,
    auditRequired,

    contractEligible,
    contractStatus:
      contractEligible
        ? 'eligible'
        : 'blocked',

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,

    externalMutation: false,
    mutationApplied: false,

    providerInvocation: false,

    reason,
  }
}
