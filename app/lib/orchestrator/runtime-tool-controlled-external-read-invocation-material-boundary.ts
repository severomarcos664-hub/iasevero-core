import { createHash } from 'node:crypto'

import { createRuntimeToolRegistry } from '../runtime-core/runtime-tool-registry'

import type {
  RuntimeToolControlledExternalReadEffectHandoffDecision,
} from './runtime-tool-controlled-external-read-effect-handoff-boundary'

import type {
  RuntimeToolControlledExternalReadInvocationPreparationInput,
} from './runtime-tool-controlled-external-read-invocation-preparation'

export type RuntimeToolControlledExternalReadInvocationMaterialTarget = {
  protocol: 'https'
  host: string
  resource: string
}

export type RuntimeToolControlledExternalReadInvocationMaterialBoundaryInput = {
  handoff: RuntimeToolControlledExternalReadEffectHandoffDecision
  target: RuntimeToolControlledExternalReadInvocationMaterialTarget
}

export type RuntimeToolControlledExternalReadInvocationMaterialBoundaryDecision = {
  materialPrepared: boolean

  preparationInput:
    | RuntimeToolControlledExternalReadInvocationPreparationInput
    | null

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false

  reason: string
}

function deriveIdempotencyKey(input: {
  executionKey: string
  stepId: string
  protocol: string
  host: string
  resource: string
}): string {
  const digest = createHash('sha256')
    .update([
      input.executionKey,
      input.stepId,
      input.protocol,
      input.host,
      input.resource,
    ].join('\n'))
    .digest('hex')

  return `external.read:${digest}`
}

export function evaluateRuntimeToolControlledExternalReadInvocationMaterialBoundary(
  input: RuntimeToolControlledExternalReadInvocationMaterialBoundaryInput,
): RuntimeToolControlledExternalReadInvocationMaterialBoundaryDecision {
  const { handoff } = input

  const host = input.target.host.trim().toLowerCase()
  const resource = input.target.resource.trim()

  const identityValid =
    handoff.executionKey.trim().length > 0 &&
    handoff.correlationId.trim().length > 0 &&
    handoff.traceId.trim().length > 0 &&
    handoff.stepId.trim().length > 0

  const targetValid =
    input.target.protocol === 'https' &&
    host.length > 0 &&
    resource.length > 0

  const registry = createRuntimeToolRegistry()
  const tool =
    registry.tools.find((candidate) => candidate.id === 'external.read') ?? null

  const materialPrepared =
    identityValid &&
    targetValid &&
    handoff.effectHandoffPrepared === true &&
    handoff.effectHandoffStatus === 'prepared' &&
    tool !== null

  if (!materialPrepared || tool === null) {
    return {
      materialPrepared: false,
      preparationInput: null,

      networkAccess: false,
      externalReadApplied: false,
      executionApplied: false,
      mutationApplied: false,
      providerInvocation: false,

      reason:
        'Governed controlled external read invocation material was blocked before invocation preparation.',
    }
  }

  const validatedInput = Object.freeze({
    target: Object.freeze({
      protocol: 'https' as const,
      host,
      resource,
    }),
  })

  const idempotencyKey = deriveIdempotencyKey({
    executionKey: handoff.executionKey,
    stepId: handoff.stepId,
    protocol: 'https',
    host,
    resource,
  })

  return {
    materialPrepared: true,

    preparationInput: {
      executionKey: handoff.executionKey,
      correlationId: handoff.correlationId,
      traceId: handoff.traceId,
      stepId: handoff.stepId,

      toolId: tool.id,
      validatedInput,
      idempotencyKey,

      policy: {
        category: tool.category,
        risk: tool.risk,
        timeoutMs: tool.timeoutMs,
        retries: tool.retries,
        critical: tool.critical,
      },
    },

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,

    reason:
      'Governed controlled external read invocation material prepared without invoking or executing external effects.',
  }
}
