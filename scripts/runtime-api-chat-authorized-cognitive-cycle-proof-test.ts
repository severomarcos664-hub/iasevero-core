import { strict as assert } from 'node:assert'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const require = createRequire(import.meta.url)

const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (path: string) => {
    prepare: (sql: string) => {
      all: (...parameters: unknown[]) => unknown[]
      get: (...parameters: unknown[]) => unknown
    }
    close: () => void
  }
}

type ApiResponseBody = {
  reply?: unknown
  runtime?: {
    operationalState?: unknown
    governance?: unknown
    integrity?: unknown
    healing?: unknown
    recovery?: unknown
    executionAllowed?: unknown
    executionIdentity?: {
      executionKey?: unknown
      source?: unknown
      taskId?: unknown
    }
    executiveAuthority?: {
      executionAllowed?: unknown
    }
    executiveState?: {
      executionAllowed?: unknown
    }
    traceId?: unknown
  }
}

async function main(): Promise<void> {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), 'iasevero-authorized-cycle-proof-'),
  )

  const databasePath = join(
    temporaryDirectory,
    'authorized-cycle.sqlite',
  )

  const previousDatabasePath =
    process.env.IASEVERO_MEMORY_DB_PATH

  process.env.IASEVERO_MEMORY_DB_PATH = databasePath

  const stamp = Date.now()
  const tenantId = 'authorized-cycle-tenant'
  const userId = `authorized-cycle-user-${stamp}`
  const executionKey = `authorized-cycle-execution-${stamp}`

  try {
    const { POST } = await import('../app/api/chat/route')

    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message:
            'Responda apenas: teste local aprovado.',
          tenantId,
          userId,
          executionKey,
        }),
      }),
    )

    const body = (await response.json()) as ApiResponseBody

    assert.equal(
      response.status,
      200,
      'The authorized API route must return HTTP 200.',
    )

    assert.equal(
      typeof body.reply,
      'string',
      'The authorized cycle must produce a reply.',
    )

    assert.ok(
      (body.reply as string).length > 0,
      'The authorized reply must not be empty.',
    )

    assert.equal(
      body.runtime?.operationalState,
      'stable',
      'The authorized cycle must finish in stable state.',
    )

    assert.equal(
      body.runtime?.governance,
      'NORMAL_OPERATION',
      'Governance must approve normal operation.',
    )

    assert.equal(
      body.runtime?.integrity,
      'healthy',
      'Runtime integrity must remain healthy.',
    )

    assert.equal(
      body.runtime?.executionAllowed,
      true,
      'The runtime must authorize execution.',
    )

    assert.equal(
      body.runtime?.executionIdentity?.executionKey,
      executionKey,
      'The execution identity must preserve the requested key.',
    )

    assert.equal(
      body.runtime?.executionIdentity?.source,
      'new',
      'A fresh execution key must create a new execution.',
    )

    assert.equal(
      body.runtime?.executiveAuthority?.executionAllowed,
      true,
      'Executive Authority must approve execution.',
    )

    assert.equal(
      body.runtime?.executiveState?.executionAllowed,
      true,
      'Executive State must preserve execution authorization.',
    )

    assert.equal(
      typeof body.runtime?.traceId,
      'string',
      'The authorized cycle must create a trace identifier.',
    )

    assert.ok(
      (body.runtime?.traceId as string).length > 0,
      'The trace identifier must not be empty.',
    )

    assert.equal(
      existsSync(databasePath),
      true,
      'Authorized execution must initialize the memory database.',
    )

    const database = new DatabaseSync(databasePath)

    try {
      const events = database
        .prepare(`
          SELECT
            tenant_id AS tenantId,
            user_id AS userId,
            execution_key AS executionKey,
            event_type AS eventType
          FROM enterprise_memory_events
          WHERE tenant_id = ?
            AND user_id = ?
            AND execution_key = ?
          ORDER BY sequence ASC
        `)
        .all(
          tenantId,
          userId,
          executionKey,
        ) as Array<{
          tenantId: string
          userId: string
          executionKey: string
          eventType: string
        }>

      assert.equal(
        events.length,
        2,
        'The authorized cycle must persist message and result events.',
      )

      assert.deepEqual(
        events.map((event) => event.eventType),
        ['message', 'result'],
        'Persisted events must preserve canonical order.',
      )

      assert.ok(
        events.every(
          (event) =>
            event.tenantId === tenantId &&
            event.userId === userId &&
            event.executionKey === executionKey,
        ),
        'All events must preserve tenant, user and execution scope.',
      )

      const memories = database
        .prepare(`
          SELECT
            tenant_id AS tenantId,
            user_id AS userId,
            execution_key AS executionKey,
            memory_type AS memoryType,
            status
          FROM enterprise_cognitive_memories
          WHERE tenant_id = ?
            AND user_id = ?
            AND execution_key = ?
          ORDER BY memory_type ASC
        `)
        .all(
          tenantId,
          userId,
          executionKey,
        ) as Array<{
          tenantId: string
          userId: string
          executionKey: string
          memoryType: string
          status: string
        }>

      assert.equal(
        memories.length,
        2,
        'The current consolidation contract must create two candidates.',
      )

      assert.deepEqual(
        memories.map((memory) => memory.memoryType),
        ['episodic', 'semantic'],
        'The current authorized cycle must create episodic and semantic candidates.',
      )

      assert.ok(
        memories.every(
          (memory) =>
            memory.status === 'candidate' &&
            memory.tenantId === tenantId &&
            memory.userId === userId &&
            memory.executionKey === executionKey,
        ),
        'Candidates must remain governed and preserve scope.',
      )

      const activeCount = database
        .prepare(`
          SELECT COUNT(*) AS total
          FROM enterprise_cognitive_memories
          WHERE tenant_id = ?
            AND user_id = ?
            AND status = 'active'
        `)
        .get(
          tenantId,
          userId,
        ) as { total: number }

      assert.equal(
        Number(activeCount.total),
        0,
        'No candidate may become active without governance approval.',
      )

      const crossUserLeakage = database
        .prepare(`
          SELECT COUNT(*) AS total
          FROM enterprise_cognitive_memories
          WHERE tenant_id = ?
            AND user_id = ?
        `)
        .get(
          tenantId,
          'unauthorized-other-user',
        ) as { total: number }

      assert.equal(
        Number(crossUserLeakage.total),
        0,
        'The authorized cycle must not leak memory across users.',
      )

      console.log(
        'Runtime API chat authorized cognitive cycle proof passed.',
      )

      console.log({
        responseStatus: response.status,
        operationalState:
          body.runtime?.operationalState,
        governance:
          body.runtime?.governance,
        integrity:
          body.runtime?.integrity,
        executionAllowed:
          body.runtime?.executionAllowed,
        executionSource:
          body.runtime?.executionIdentity?.source,
        traceCreated: true,
        eventsPersisted: events.length,
        eventTypes:
          events.map((event) => event.eventType),
        candidatesCreated: memories.length,
        candidateTypes:
          memories.map((memory) => memory.memoryType),
        activeMemories: Number(activeCount.total),
        crossUserLeakage:
          Number(crossUserLeakage.total),
      })
    } finally {
      database.close()
    }
  } finally {
    if (previousDatabasePath === undefined) {
      delete process.env.IASEVERO_MEMORY_DB_PATH
    } else {
      process.env.IASEVERO_MEMORY_DB_PATH =
        previousDatabasePath
    }

    rmSync(temporaryDirectory, {
      recursive: true,
      force: true,
    })
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
