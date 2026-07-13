import {
  buildRuntimePersistenceRecord,
  persistRuntimeRecord,
  readRuntimePersistenceRecords,
} from './runtime-persistence-fabric'

import type {
  RuntimePersistenceRecord,
} from './runtime-persistence-fabric'

import type {
  RuntimeTaskPlan,
} from './runtime-task-planner'

import type {
  RuntimeAdaptiveExecutionState,
} from './runtime-adaptive-execution-enforcement'

const ADAPTIVE_EXECUTION_CATEGORY:
  RuntimePersistenceRecord['category'] = 'runtime-state'

export type RuntimeAdaptiveExecutionPersistencePayload = {
  schemaVersion: 1
  taskId: string
  executionKey: string
  plan: RuntimeTaskPlan
  state: RuntimeAdaptiveExecutionState
  persistedAt: string
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

export function isRuntimeAdaptiveExecutionPersistencePayload(
  value: unknown,
): value is RuntimeAdaptiveExecutionPersistencePayload {
  if (!isRecord(value)) {
    return false
  }

  if (
    value.schemaVersion !== 1 ||
    typeof value.taskId !== 'string' ||
    value.taskId.length === 0 ||
    typeof value.executionKey !== 'string' ||
    value.executionKey.length === 0 ||
    typeof value.persistedAt !== 'string' ||
    !isRecord(value.plan) ||
    !isRecord(value.state)
  ) {
    return false
  }

  const plan = value.plan
  const state = value.state

  return (
    typeof plan.taskId === 'string' &&
    plan.taskId === value.taskId &&
    Array.isArray(plan.steps) &&
    typeof state.planTaskId === 'string' &&
    state.planTaskId === value.taskId &&
    Array.isArray(state.steps)
  )
}

export function persistRuntimeAdaptiveExecutionState(
  plan: RuntimeTaskPlan,
  state: RuntimeAdaptiveExecutionState,
  executionKey: string = plan.taskId,
): RuntimePersistenceRecord {
  const normalizedExecutionKey = executionKey.trim()

  if (!normalizedExecutionKey) {
    throw new Error(
      'Runtime adaptive execution persistence requires an executionKey.',
    )
  }

  if (!plan.taskId) {
    throw new Error(
      'Runtime adaptive execution persistence requires a taskId.',
    )
  }

  if (state.planTaskId !== plan.taskId) {
    throw new Error(
      'Runtime adaptive execution state does not match the plan taskId.',
    )
  }

  const payload:
    RuntimeAdaptiveExecutionPersistencePayload = {
      schemaVersion: 1,
      taskId: plan.taskId,
      executionKey: normalizedExecutionKey,
      plan,
      state,
      persistedAt: new Date().toISOString(),
    }

  const record = buildRuntimePersistenceRecord(
    'runtime-adaptive-execution-persistence',
    ADAPTIVE_EXECUTION_CATEGORY,
    payload,
  )

  persistRuntimeRecord(record)

  return record
}


export function readLatestRuntimeAdaptiveExecutionStateByExecutionKey(
  executionKey: string,
): RuntimeAdaptiveExecutionPersistencePayload | null {
  const normalizedExecutionKey = executionKey.trim()

  if (!normalizedExecutionKey) {
    throw new Error(
      'Runtime adaptive execution persistence requires an executionKey.',
    )
  }

  const records = readRuntimePersistenceRecords(
    ADAPTIVE_EXECUTION_CATEGORY,
  )

  for (const record of [...records].reverse()) {
    if (
      record.source !==
      'runtime-adaptive-execution-persistence'
    ) {
      continue
    }

    if (
      !isRuntimeAdaptiveExecutionPersistencePayload(
        record.payload,
      )
    ) {
      continue
    }

    if (
      record.payload.executionKey ===
      normalizedExecutionKey
    ) {
      return record.payload
    }
  }

  return null
}

export function readLatestRuntimeAdaptiveExecutionState(
  taskId: string,
): RuntimeAdaptiveExecutionPersistencePayload | null {
  const normalizedTaskId = taskId.trim()

  if (!normalizedTaskId) {
    throw new Error(
      'Runtime adaptive execution persistence requires a taskId.',
    )
  }

  const records = readRuntimePersistenceRecords(
    ADAPTIVE_EXECUTION_CATEGORY,
  )

  for (const record of [...records].reverse()) {
    if (
      record.source !==
      'runtime-adaptive-execution-persistence'
    ) {
      continue
    }

    if (
      !isRuntimeAdaptiveExecutionPersistencePayload(
        record.payload,
      )
    ) {
      continue
    }

    if (record.payload.taskId === normalizedTaskId) {
      return record.payload
    }
  }

  return null
}
