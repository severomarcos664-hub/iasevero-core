import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

type RawSQLiteStatement = {
  run: (...parameters: unknown[]) => unknown
  all: (...parameters: unknown[]) => unknown[]
  get: (...parameters: unknown[]) => unknown
}

type RawSQLiteDatabase = {
  prepare: (sql: string) => RawSQLiteStatement
  close: () => void
}

type RawSQLiteModule = {
  DatabaseSync: new (
    databasePath: string,
  ) => RawSQLiteDatabase
}

const require = createRequire(import.meta.url)

const { DatabaseSync } = require('node:sqlite') as RawSQLiteModule

import {
  RuntimeEnterpriseCognitiveMemoryRepository,
  type GovernedMemoryActionAuthorizationStatus,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

const databasePath = join(
  process.cwd(),
  `.runtime-governed-memory-action-authorization-proof-${randomUUID()}.sqlite`,
)

const tenantId = 'tenant-v283-14'
const userId = 'user-v283-14'
const otherUserId = 'other-user-v283-14'
let memoryId = 'memory-v283-14'
const decisionId = 'decision-v283-14'
const requestId = 'review-request-v283-14'
const authorizationId = 'authorization-v283-14'

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(databasePath)

const rawDatabase = new DatabaseSync(databasePath)

try {
  const schemaObjects = rawDatabase
    .prepare(
      `
      SELECT type, name
      FROM sqlite_master
      WHERE name IN (
        'enterprise_memory_action_authorizations',
        'enterprise_memory_action_authorization_events',
        'idx_enterprise_memory_action_authorizations_request',
        'idx_enterprise_memory_action_authorizations_scope',
        'idx_enterprise_memory_action_authorizations_decision',
        'idx_enterprise_memory_action_authorization_events_scope',
        'idx_enterprise_memory_action_authorization_events_request',
        'prevent_enterprise_memory_action_authorization_update',
        'prevent_enterprise_memory_action_authorization_delete',
        'prevent_enterprise_memory_action_authorization_event_update',
        'prevent_enterprise_memory_action_authorization_event_delete'
      )
      ORDER BY type, name
      `,
    )
    .all() as Array<{
      type: 'table' | 'index' | 'trigger'
      name: string
    }>

  assert.equal(schemaObjects.length, 11)

  const memory = repository.createMemory({
    tenantId,
    userId,
    entityId: 'entity-v283-14',
    executionKey: 'execution-v283-14',
    type: 'semantic',
    content:
      'Memória original preservada pela prova v283.14.',
    structuredPayload: {
      proof: 'v283.14',
    },
    source: 'runtime-v283-14-proof',
    sourceEventIds: [],
    sourceAuthority: 100,
    confidence: 100,
    status: 'active',
    policyTags: [
      'governed-memory',
      'action-authorization',
      'v283.14-proof',
    ],
  })

  memoryId = memory.memoryId

  rawDatabase
    .prepare(
      `
      INSERT INTO enterprise_memory_review_requests (
        request_id,
        decision_id,
        tenant_id,
        user_id,
        memory_id,
        recommendation,
        decision_json,
        source,
        source_authority,
        mutation_applied,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      requestId,
      decisionId,
      tenantId,
      userId,
      memoryId,
      'retain',
      JSON.stringify({
        workflowVersion: 1,
        decisionId,
        tenantId,
        userId,
        memoryId,
        recommendation: 'retain',
        reviewRequired: true,
      }),
      'runtime-v283-14-proof',
      100,
      0,
      '2026-07-22T00:01:00.000Z',
    )

  rawDatabase
    .prepare(
      `
      INSERT INTO enterprise_memory_review_events (
        event_id,
        request_id,
        decision_id,
        tenant_id,
        user_id,
        memory_id,
        event_type,
        resulting_status,
        actor_id,
        source,
        source_authority,
        reason,
        mutation_applied,
        payload_json,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      'review-event-v283-14-accepted',
      requestId,
      decisionId,
      tenantId,
      userId,
      memoryId,
      'review-accepted',
      'accepted',
      userId,
      'runtime-v283-14-proof',
      100,
      'Review aceita para prova de autorização.',
      0,
      JSON.stringify({
        workflowVersion: 1,
        eventId: 'review-event-v283-14-accepted',
        requestId,
        decisionId,
        tenantId,
        userId,
        memoryId,
        eventType: 'review-accepted',
        resultingStatus: 'accepted',
        actorId: userId,
        source: 'runtime-v283-14-proof',
        sourceAuthority: 100,
        reason: 'Review aceita para prova de autorização.',
        createdAt: '2026-07-22T00:02:00.000Z',
        mutationApplied: false,
      }),
      '2026-07-22T00:02:00.000Z',
    )

  const acceptedReview =
    repository.readMemoryReviewRequest({
      tenantId,
      userId,
      requestId,
    })

  assert.ok(acceptedReview)
  assert.equal(acceptedReview.status, 'accepted')

  const authorization =
    repository.createMemoryActionAuthorization({
      reviewRequest: acceptedReview,
      authorizationId,
      proposedAction: 'retain-memory-without-mutation',
      actorId: userId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
      createdAt: '2026-07-22T00:03:00.000Z',
    })

  assert.equal(authorization.status, 'pending')
  assert.equal(authorization.requestId, requestId)
  assert.equal(authorization.decisionId, decisionId)
  assert.equal(authorization.memoryId, memoryId)
  assert.equal(authorization.executionApplied, false)
  assert.equal(authorization.mutationApplied, false)

  const pendingRead =
    repository.readMemoryActionAuthorization({
      tenantId,
      userId,
      authorizationId,
    })

  assert.ok(pendingRead)
  assert.equal(pendingRead.status, 'pending')

  const initialHistory =
    repository.readMemoryActionAuthorizationHistory({
      tenantId,
      userId,
      authorizationId,
    })

  assert.deepEqual(
    initialHistory.map((event) => event.eventType),
    ['authorization-requested'],
  )

  const authorizedEvent =
    repository.transitionMemoryActionAuthorization({
      eventId: 'authorization-event-v283-14-authorized',
      authorizationId,
      tenantId,
      userId,
      targetStatus: 'authorized',
      actorId: userId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
      reason: 'Autorização aprovada sem execução.',
      createdAt: '2026-07-22T00:04:00.000Z',
    })

  assert.equal(authorizedEvent.resultingStatus, 'authorized')
  assert.equal(authorizedEvent.executionApplied, false)
  assert.equal(authorizedEvent.mutationApplied, false)

  const authorizedRead =
    repository.readMemoryActionAuthorization({
      tenantId,
      userId,
      authorizationId,
    })

  assert.ok(authorizedRead)
  assert.equal(authorizedRead.status, 'authorized')

  const finalHistory =
    repository.readMemoryActionAuthorizationHistory({
      tenantId,
      userId,
      authorizationId,
    })

  assert.deepEqual(
    finalHistory.map((event) => event.eventType),
    [
      'authorization-requested',
      'authorization-authorized',
    ],
  )

  let terminalReopenBlocked = false

  try {
    repository.transitionMemoryActionAuthorization({
      eventId: 'authorization-event-v283-14-cancelled',
      authorizationId,
      tenantId,
      userId,
      targetStatus: 'cancelled',
      actorId: userId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
      reason: 'Tentativa inválida após estado terminal.',
    })
  } catch {
    terminalReopenBlocked = true
  }

  assert.equal(terminalReopenBlocked, true)

  let crossUserBlocked = false

  try {
    repository.transitionMemoryActionAuthorization({
      eventId: 'authorization-event-v283-14-cross-user',
      authorizationId,
      tenantId,
      userId: otherUserId,
      targetStatus: 'cancelled',
      actorId: otherUserId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
      reason: 'Tentativa cruzada entre usuários.',
    })
  } catch {
    crossUserBlocked = true
  }

  assert.equal(crossUserBlocked, true)

  let duplicateBlocked = false

  try {
    repository.createMemoryActionAuthorization({
      reviewRequest: acceptedReview,
      authorizationId: 'authorization-v283-14-duplicate',
      proposedAction: 'duplicate-request',
      actorId: userId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
    })
  } catch {
    duplicateBlocked = true
  }

  assert.equal(duplicateBlocked, true)

  const deniedReviewRequestId = 'review-request-v283-14-denied'
  const deniedAuthorizationId = 'authorization-v283-14-denied'

  rawDatabase
    .prepare(
      `
      INSERT INTO enterprise_memory_review_requests (
        request_id,
        decision_id,
        tenant_id,
        user_id,
        memory_id,
        recommendation,
        decision_json,
        source,
        source_authority,
        mutation_applied,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      deniedReviewRequestId,
      'decision-v283-14-denied',
      tenantId,
      userId,
      memoryId,
      'retain',
      JSON.stringify({ reviewRequired: true }),
      'runtime-v283-14-proof',
      100,
      0,
      '2026-07-22T00:05:00.000Z',
    )

  rawDatabase
    .prepare(
      `
      INSERT INTO enterprise_memory_review_events (
        event_id,
        request_id,
        decision_id,
        tenant_id,
        user_id,
        memory_id,
        event_type,
        resulting_status,
        actor_id,
        source,
        source_authority,
        reason,
        mutation_applied,
        payload_json,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      'review-event-v283-14-denied-seed',
      deniedReviewRequestId,
      'decision-v283-14-denied',
      tenantId,
      userId,
      memoryId,
      'review-accepted',
      'accepted',
      userId,
      'runtime-v283-14-proof',
      100,
      'Review aceita para testar negação.',
      0,
      JSON.stringify({
        workflowVersion: 1,
        eventId: 'review-event-v283-14-denied-seed',
        requestId: deniedReviewRequestId,
        decisionId: 'decision-v283-14-denied',
        tenantId,
        userId,
        memoryId,
        eventType: 'review-accepted',
        resultingStatus: 'accepted',
        actorId: userId,
        source: 'runtime-v283-14-proof',
        sourceAuthority: 100,
        reason: 'Review aceita para testar negação.',
        createdAt: '2026-07-22T00:06:00.000Z',
        mutationApplied: false,
      }),
      '2026-07-22T00:06:00.000Z',
    )

  const deniedReview =
    repository.readMemoryReviewRequest({
      tenantId,
      userId,
      requestId: deniedReviewRequestId,
    })

  assert.ok(deniedReview)

  repository.createMemoryActionAuthorization({
    reviewRequest: deniedReview,
    authorizationId: deniedAuthorizationId,
    proposedAction: 'deny-with-reason-proof',
    actorId: userId,
    source: 'runtime-v283-14-proof',
    sourceAuthority: 100,
  })

  let deniedWithoutReasonBlocked = false

  try {
    repository.transitionMemoryActionAuthorization({
      eventId: 'authorization-event-v283-14-denied-empty',
      authorizationId: deniedAuthorizationId,
      tenantId,
      userId,
      targetStatus: 'denied',
      actorId: userId,
      source: 'runtime-v283-14-proof',
      sourceAuthority: 100,
      reason: '   ',
    })
  } catch {
    deniedWithoutReasonBlocked = true
  }

  assert.equal(deniedWithoutReasonBlocked, true)

  let requestUpdateBlocked = false

  try {
    rawDatabase
      .prepare(
        `
        UPDATE enterprise_memory_action_authorizations
        SET proposed_action = ?
        WHERE authorization_id = ?
        `,
      )
      .run('mutated', authorizationId)
  } catch {
    requestUpdateBlocked = true
  }

  assert.equal(requestUpdateBlocked, true)

  let requestDeleteBlocked = false

  try {
    rawDatabase
      .prepare(
        `
        DELETE FROM enterprise_memory_action_authorizations
        WHERE authorization_id = ?
        `,
      )
      .run(authorizationId)
  } catch {
    requestDeleteBlocked = true
  }

  assert.equal(requestDeleteBlocked, true)

  let eventUpdateBlocked = false

  try {
    rawDatabase
      .prepare(
        `
        UPDATE enterprise_memory_action_authorization_events
        SET reason = ?
        WHERE authorization_id = ?
        `,
      )
      .run('mutated', authorizationId)
  } catch {
    eventUpdateBlocked = true
  }

  assert.equal(eventUpdateBlocked, true)

  let eventDeleteBlocked = false

  try {
    rawDatabase
      .prepare(
        `
        DELETE FROM enterprise_memory_action_authorization_events
        WHERE authorization_id = ?
        `,
      )
      .run(authorizationId)
  } catch {
    eventDeleteBlocked = true
  }

  assert.equal(eventDeleteBlocked, true)

  const preservedMemory = rawDatabase
    .prepare(
      `
      SELECT content, checksum
      FROM enterprise_cognitive_memories
      WHERE memory_id = ?
      `,
    )
    .get(memoryId) as {
      content: string
      checksum: string
    }

  assert.equal(
    preservedMemory.content,
    memory.content,
  )

  assert.equal(
    preservedMemory.checksum,
    memory.checksum,
  )

  const terminalStatuses: GovernedMemoryActionAuthorizationStatus[] = [
    'authorized',
    'denied',
    'expired',
    'cancelled',
  ]

  assert.deepEqual(
    terminalStatuses,
    ['authorized', 'denied', 'expired', 'cancelled'],
  )

  console.log(
    'Runtime governed memory action authorization proof passed.',
  )

  console.log({
    pendingCreated: authorization.status === 'pending',
    authorizedState: authorizedRead.status === 'authorized',
    historyAppendOnly:
      finalHistory.length === 2 &&
      finalHistory[0].eventType === 'authorization-requested' &&
      finalHistory[1].eventType === 'authorization-authorized',
    terminalReopenBlocked,
    crossUserBlocked,
    duplicateBlocked,
    deniedWithoutReasonBlocked,
    requestUpdateBlocked,
    requestDeleteBlocked,
    eventUpdateBlocked,
    eventDeleteBlocked,
    executionApplied:
      authorization.executionApplied ||
      authorizedEvent.executionApplied,
    mutationApplied:
      authorization.mutationApplied ||
      authorizedEvent.mutationApplied,
    memoryPreserved:
      preservedMemory.content === memory.content &&
      preservedMemory.checksum === memory.checksum,
  })

  const executionAuthorization =
    repository.readMemoryActionAuthorization({
      tenantId,
      userId,
      authorizationId: authorization.authorizationId,
    })

  assert.ok(executionAuthorization)
  assert.equal(executionAuthorization.status, 'authorized')
  assert.equal(executionAuthorization.executionApplied, false)
  assert.equal(executionAuthorization.mutationApplied, false)

  const executionId = 'execution-v283-15-1-proof'
  const executionKey = 'execution-key-v283-15-1-proof'

  const execution =
    repository.createMemoryActionExecution({
      authorization: executionAuthorization,
      executionId,
      executionKey,
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      createdAt: '2026-07-24T22:00:00.000Z',
    })

  assert.equal(execution.status, 'pending')
  assert.equal(execution.executionApplied, false)
  assert.equal(execution.mutationApplied, false)

  const initialExecutionHistory =
    repository.readMemoryActionExecutionHistory({
      tenantId,
      userId,
      executionId,
    })

  assert.deepEqual(
    initialExecutionHistory.map((event) => event.eventType),
    ['execution-requested'],
  )

  const pendingExecution =
    repository.readMemoryActionExecution({
      tenantId,
      userId,
      executionId,
    })

  assert.ok(pendingExecution)
  assert.equal(pendingExecution.status, 'pending')

  const crossUserExecution =
    repository.readMemoryActionExecution({
      tenantId,
      userId: otherUserId,
      executionId,
    })

  assert.equal(crossUserExecution, undefined)

  let directSuccessBlocked = false

  try {
    repository.transitionMemoryActionExecution({
      executionId,
      tenantId,
      userId,
      targetStatus: 'succeeded',
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      result: {
        invalidDirectSuccess: true,
      },
      createdAt: '2026-07-24T22:01:00.000Z',
    })
  } catch {
    directSuccessBlocked = true
  }

  assert.equal(directSuccessBlocked, true)

  const startedEvent =
    repository.transitionMemoryActionExecution({
      executionId,
      tenantId,
      userId,
      targetStatus: 'running',
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      reason: 'Execução governada iniciada.',
      createdAt: '2026-07-24T22:02:00.000Z',
    })

  assert.equal(startedEvent.eventType, 'execution-started')
  assert.equal(startedEvent.resultingStatus, 'running')
  assert.equal(startedEvent.executionApplied, false)
  assert.equal(startedEvent.mutationApplied, false)

  let successWithoutResultBlocked = false

  try {
    repository.transitionMemoryActionExecution({
      executionId,
      tenantId,
      userId,
      targetStatus: 'succeeded',
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      createdAt: '2026-07-24T22:03:00.000Z',
    })
  } catch {
    successWithoutResultBlocked = true
  }

  assert.equal(successWithoutResultBlocked, true)

  const succeededEvent =
    repository.transitionMemoryActionExecution({
      executionId,
      tenantId,
      userId,
      targetStatus: 'succeeded',
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      reason: 'Execução governada concluída.',
      result: {
        workflowCompleted: true,
        memoryMutationPerformed: false,
      },
      executionApplied: false,
      mutationApplied: false,
      createdAt: '2026-07-24T22:04:00.000Z',
    })

  assert.equal(succeededEvent.eventType, 'execution-succeeded')
  assert.equal(succeededEvent.resultingStatus, 'succeeded')
  assert.equal(succeededEvent.executionApplied, false)
  assert.equal(succeededEvent.mutationApplied, false)

  const finalExecution =
    repository.readMemoryActionExecution({
      tenantId,
      userId,
      executionId,
    })

  assert.ok(finalExecution)
  assert.equal(finalExecution.status, 'succeeded')
  assert.equal(finalExecution.executionApplied, false)
  assert.equal(finalExecution.mutationApplied, false)

  const finalExecutionHistory =
    repository.readMemoryActionExecutionHistory({
      tenantId,
      userId,
      executionId,
    })

  assert.deepEqual(
    finalExecutionHistory.map((event) => event.eventType),
    [
      'execution-requested',
      'execution-started',
      'execution-succeeded',
    ],
  )

  let executionTerminalReopenBlocked = false

  try {
    repository.transitionMemoryActionExecution({
      executionId,
      tenantId,
      userId,
      targetStatus: 'running',
      actorId: userId,
      source: 'runtime-v283-15-1-proof',
      sourceAuthority: 96,
      reason: 'Tentativa inválida de reabrir estado terminal.',
      createdAt: '2026-07-24T22:05:00.000Z',
    })
  } catch {
    executionTerminalReopenBlocked = true
  }

  assert.equal(executionTerminalReopenBlocked, true)

  let executionUpdateBlocked = false

  try {
    rawDatabase
      .prepare(
        `
          UPDATE enterprise_memory_action_executions
          SET source = ?
          WHERE execution_id = ?
        `,
      )
      .run('invalid-update', executionId)
  } catch {
    executionUpdateBlocked = true
  }

  assert.equal(executionUpdateBlocked, true)

  let executionDeleteBlocked = false

  try {
    rawDatabase
      .prepare(
        `
          DELETE FROM enterprise_memory_action_executions
          WHERE execution_id = ?
        `,
      )
      .run(executionId)
  } catch {
    executionDeleteBlocked = true
  }

  assert.equal(executionDeleteBlocked, true)

  let executionEventUpdateBlocked = false

  try {
    rawDatabase
      .prepare(
        `
          UPDATE enterprise_memory_action_execution_events
          SET reason = ?
          WHERE execution_id = ?
        `,
      )
      .run('invalid-event-update', executionId)
  } catch {
    executionEventUpdateBlocked = true
  }

  assert.equal(executionEventUpdateBlocked, true)

  let executionEventDeleteBlocked = false

  try {
    rawDatabase
      .prepare(
        `
          DELETE FROM enterprise_memory_action_execution_events
          WHERE execution_id = ?
        `,
      )
      .run(executionId)
  } catch {
    executionEventDeleteBlocked = true
  }

  assert.equal(executionEventDeleteBlocked, true)

  console.log(
    'Runtime governed memory action execution workflow proof passed.',
  )

  console.log({
    pendingCreated: execution.status === 'pending',
    runningReached: startedEvent.resultingStatus === 'running',
    succeededReached: succeededEvent.resultingStatus === 'succeeded',
    appendOnlyHistory: finalExecutionHistory.length === 3,
    crossUserBlocked: crossUserExecution === undefined,
    directSuccessBlocked,
    successWithoutResultBlocked,
    executionTerminalReopenBlocked,
    executionUpdateBlocked,
    executionDeleteBlocked,
    executionEventUpdateBlocked,
    executionEventDeleteBlocked,
    executionApplied: succeededEvent.executionApplied,
    mutationApplied: succeededEvent.mutationApplied,
  })

} finally {
  rawDatabase.close()
  repository.close()

  rmSync(databasePath, {
    force: true,
  })
}
