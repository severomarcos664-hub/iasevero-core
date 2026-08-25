import type {
  RuntimeToolCategory,
  RuntimeToolRisk,
} from '../runtime-core/runtime-tool-registry'

export type RuntimeToolControlledExternalReadInvocationPreparationInput = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  toolId: string

  validatedInput: Readonly<Record<string, unknown>>

  idempotencyKey: string

  policy: {
    category: RuntimeToolCategory
    risk: RuntimeToolRisk
    timeoutMs: number
    retries: number
    critical: boolean
  }
}

export type RuntimeToolControlledExternalReadInvocationPreparation = {
  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  toolId: string

  validatedInput: Readonly<Record<string, unknown>>

  idempotencyKey: string

  policy: {
    category: RuntimeToolCategory
    risk: RuntimeToolRisk
    timeoutMs: number
    retries: number
    critical: boolean
  }

  invocationPreparationValidated: true

  networkAccess: false
  externalReadApplied: false
  executionApplied: false
  mutationApplied: false
  providerInvocation: false
}

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim()

  if (normalized.length === 0) {
    throw new Error(
      `Controlled external read invocation preparation requires ${field}.`,
    )
  }

  return normalized
}

export function prepareRuntimeToolControlledExternalReadInvocation(
  input: RuntimeToolControlledExternalReadInvocationPreparationInput,
): RuntimeToolControlledExternalReadInvocationPreparation {
  const executionKey = requireNonEmpty(input.executionKey, 'executionKey')
  const correlationId = requireNonEmpty(input.correlationId, 'correlationId')
  const traceId = requireNonEmpty(input.traceId, 'traceId')
  const stepId = requireNonEmpty(input.stepId, 'stepId')
  const toolId = requireNonEmpty(input.toolId, 'toolId')
  const idempotencyKey = requireNonEmpty(
    input.idempotencyKey,
    'idempotencyKey',
  )

  if (toolId !== 'external.read') {
    throw new Error(
      'Controlled external read invocation preparation requires toolId external.read.',
    )
  }

  if (input.policy.timeoutMs <= 0) {
    throw new Error(
      'Controlled external read invocation preparation requires bounded timeoutMs.',
    )
  }

  if (input.policy.retries < 0) {
    throw new Error(
      'Controlled external read invocation preparation requires non-negative retries.',
    )
  }

  return {
    executionKey,
    correlationId,
    traceId,
    stepId,

    toolId,

    validatedInput: Object.freeze({
      ...input.validatedInput,
    }),

    idempotencyKey,

    policy: {
      category: input.policy.category,
      risk: input.policy.risk,
      timeoutMs: input.policy.timeoutMs,
      retries: input.policy.retries,
      critical: input.policy.critical,
    },

    invocationPreparationValidated: true,

    networkAccess: false,
    externalReadApplied: false,
    executionApplied: false,
    mutationApplied: false,
    providerInvocation: false,
  }
}
