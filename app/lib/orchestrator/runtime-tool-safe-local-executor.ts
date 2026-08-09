import type {
  RuntimeDependencyGraph,
  RuntimeDependencyNode,
} from './runtime-dependency-graph'
import {
  validateRuntimeTopology,
  type RuntimeTopologyReport,
} from './runtime-topology-validator'
import {
  evaluateRuntimeToolControlledExecutorBoundary,
} from './runtime-tool-controlled-executor-boundary'
import type {
  RuntimeToolExecutionInvocationEnvelope,
} from './runtime-tool-execution-invocation-envelope'

export type RuntimeToolSafeLocalExecutionResult = {
  toolId: string

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  executorEligible: boolean
  executorSelected: boolean

  executionAttempted: boolean
  executionApplied: boolean
  mutationApplied: false

  networkAccess: false
  externalMutation: false
  shellExecution: false
  providerInvocation: false

  executionStatus: 'executed' | 'blocked'

  result: RuntimeTopologyReport | null
  reason: string
}

function parseRuntimeDependencyGraph(
  input: Readonly<Record<string, unknown>>,
): RuntimeDependencyGraph | null {
  if (!Array.isArray(input.nodes)) {
    return null
  }

  if (
    typeof input.totalNodes !== 'number' ||
    !Number.isInteger(input.totalNodes) ||
    input.totalNodes < 0
  ) {
    return null
  }

  if (
    typeof input.totalEdges !== 'number' ||
    !Number.isInteger(input.totalEdges) ||
    input.totalEdges < 0
  ) {
    return null
  }

  const nodes: RuntimeDependencyNode[] = []

  for (const candidate of input.nodes) {
    if (
      candidate === null ||
      typeof candidate !== 'object' ||
      Array.isArray(candidate)
    ) {
      return null
    }

    const record = candidate as Record<string, unknown>

    if (
      typeof record.module !== 'string' ||
      record.module.trim().length === 0 ||
      !Array.isArray(record.dependencies) ||
      !record.dependencies.every(
        dependency =>
          typeof dependency === 'string' &&
          dependency.trim().length > 0,
      )
    ) {
      return null
    }

    nodes.push({
      module: record.module,
      dependencies: [...record.dependencies] as string[],
    })
  }

  const totalEdges = nodes.reduce(
    (sum, node) => sum + node.dependencies.length,
    0,
  )

  if (
    input.totalNodes !== nodes.length ||
    input.totalEdges !== totalEdges
  ) {
    return null
  }

  return {
    nodes,
    totalNodes: nodes.length,
    totalEdges,
  }
}

export function executeRuntimeToolSafeLocal(
  envelope: RuntimeToolExecutionInvocationEnvelope,
): RuntimeToolSafeLocalExecutionResult {
  const boundary =
    evaluateRuntimeToolControlledExecutorBoundary(envelope)

  const base = {
    toolId: envelope.toolId,

    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    executorEligible: boundary.executorEligible,

    mutationApplied: false as const,

    networkAccess: false as const,
    externalMutation: false as const,
    shellExecution: false as const,
    providerInvocation: false as const,
  }

  if (!boundary.executorEligible) {
    return {
      ...base,
      executorSelected: false,
      executionAttempted: false,
      executionApplied: false,
      executionStatus: 'blocked',
      result: null,
      reason:
        'Safe local execution blocked because the controlled executor boundary did not grant eligibility.',
    }
  }

  if (envelope.toolId !== 'runtime.validation') {
    return {
      ...base,
      executorSelected: false,
      executionAttempted: false,
      executionApplied: false,
      executionStatus: 'blocked',
      result: null,
      reason:
        'Safe local execution blocked because no allowlisted local executor exists for this tool.',
    }
  }

  const graph = parseRuntimeDependencyGraph(
    envelope.validatedInput,
  )

  if (graph === null) {
    return {
      ...base,
      executorSelected: true,
      executionAttempted: false,
      executionApplied: false,
      executionStatus: 'blocked',
      result: null,
      reason:
        'Safe local execution blocked because validatedInput is not a valid RuntimeDependencyGraph.',
    }
  }

  const result = validateRuntimeTopology(graph)

  return {
    ...base,
    executorSelected: true,
    executionAttempted: true,
    executionApplied: true,
    executionStatus: 'executed',
    result,
    reason:
      'Allowlisted local runtime validation executed successfully without external mutation.',
  }
}
