import { strict as assert } from 'node:assert'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

type ApiBody = {
  reply?: unknown
  runtime?: {
    operationalState?: unknown
    governance?: unknown
    integrity?: unknown
    executionAllowed?: unknown
    memoryRouting?: {
      selectedCount?: unknown
      rejectedCount?: unknown
      grounded?: unknown
      items?: Array<{
        memoryId?: unknown
        type?: unknown
        content?: unknown
        source?: unknown
        confidence?: unknown
        score?: unknown
      }>
    }
    executionIdentity?: {
      executionKey?: unknown
      source?: unknown
    }
    traceId?: unknown
  }
}

async function callChat(input: {
  tenantId: string
  userId: string
  executionKey: string
  message: string
}): Promise<{
  response: Response
  body: ApiBody
}> {
  const { POST } = await import('../app/api/chat/route')

  const response = await POST(
    new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    }),
  )

  return {
    response,
    body: (await response.json()) as ApiBody,
  }
}

async function main(): Promise<void> {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), 'iasevero-two-turn-memory-proof-'),
  )

  const databasePath = join(
    temporaryDirectory,
    'two-turn-memory.sqlite',
  )

  const previousDatabasePath =
    process.env.IASEVERO_MEMORY_DB_PATH

  process.env.IASEVERO_MEMORY_DB_PATH = databasePath

  const stamp = Date.now()

  const tenantId = 'two-turn-memory-tenant'
  const ownerUserId = `two-turn-owner-${stamp}`
  const otherUserId = `two-turn-other-${stamp}`

  const firstExecutionKey =
    `two-turn-first-${stamp}`

  const secondExecutionKey =
    `two-turn-second-${stamp}`

  const isolationExecutionKey =
    `two-turn-isolation-${stamp}`

  try {
    const firstTurn = await callChat({
      tenantId,
      userId: ownerUserId,
      executionKey: firstExecutionKey,
      message:
        'Meu projeto principal é a IASevero.',
    })

    assert.equal(
      firstTurn.response.status,
      200,
      'The first authorized turn must return HTTP 200.',
    )

    assert.equal(
      firstTurn.body.runtime?.executionAllowed,
      true,
      'The first turn must be authorized.',
    )

    assert.equal(
      firstTurn.body.runtime?.operationalState,
      'stable',
      'The first turn must finish in stable state.',
    )

    assert.equal(
      firstTurn.body.runtime?.executionIdentity
        ?.executionKey,
      firstExecutionKey,
      'The first turn must preserve its execution key.',
    )

    assert.equal(
      existsSync(databasePath),
      true,
      'The first turn must create the persistent memory database.',
    )

    /*
     * The API creates governed candidates automatically.
     * For this proof, the official repository contract creates
     * the approved active semantic memory used in the next turn.
     * No direct SQL transition is used.
     */
    const repository =
      new RuntimeEnterpriseCognitiveMemoryRepository(
        databasePath,
      )

    const observedAt = new Date().toISOString()

    try {
      const activeMemory = repository.createMemory({
        tenantId,
        userId: ownerUserId,
        entityId: 'project:primary',
        executionKey: firstExecutionKey,
        type: 'semantic',
        content:
          'O projeto principal do usuário é a IASevero.',
        structuredPayload: {
          subject: 'user',
          predicate: 'primary-project',
          value: 'IASevero',
        },
        source: 'two-turn-governed-memory-proof',
        sourceEventIds: [],
        sourceAuthority: 100,
        confidence: 100,
        observedAt,
        validFrom: observedAt,
        validUntil: undefined,
        status: 'active',
        retentionPolicy: 'persistent',
        policyTags: [
          'governed',
          'two-turn-proof',
          'user-scoped',
        ],
      })

      assert.ok(
        activeMemory,
        'The repository must create the governed active memory.',
      )

      const ownerActiveMemories =
        repository.readActiveMemories({
          tenantId,
          userId: ownerUserId,
          types: ['semantic'],
          limit: 20,
        } as never)

      assert.ok(
        ownerActiveMemories.some(
          (memory) =>
            memory.content.includes('IASevero') &&
            memory.status === 'active',
        ),
        'The owner must have an active semantic IASevero memory.',
      )

      const otherUserActiveMemories =
        repository.readActiveMemories({
          tenantId,
          userId: otherUserId,
          types: ['semantic'],
          limit: 20,
        } as never)

      assert.equal(
        otherUserActiveMemories.length,
        0,
        'Another user must not access the owner memory.',
      )
    } finally {
      repository.close()
    }

    /*
     * The second API call reopens the same database, proving
     * persistence beyond the repository instance that created it.
     */
    const secondTurn = await callChat({
      tenantId,
      userId: ownerUserId,
      executionKey: secondExecutionKey,
      message:
        'Qual é o meu projeto principal?',
    })

    assert.equal(
      secondTurn.response.status,
      200,
      'The second authorized turn must return HTTP 200.',
    )

    assert.equal(
      secondTurn.body.runtime?.executionAllowed,
      true,
      'The second turn must be authorized.',
    )

    assert.equal(
      secondTurn.body.runtime?.operationalState,
      'stable',
      'The second turn must finish in stable state.',
    )

    assert.equal(
      secondTurn.body.runtime?.executionIdentity
        ?.executionKey,
      secondExecutionKey,
      'The second turn must use a new execution identity.',
    )

    assert.ok(
      Number(
        secondTurn.body.runtime?.memoryRouting
          ?.selectedCount ?? 0,
      ) > 0,
      'The second turn must select the active owner memory.',
    )

    assert.equal(
      secondTurn.body.runtime?.memoryRouting?.grounded,
      true,
      'The second turn must be grounded by governed memory.',
    )

    const selectedItems =
      secondTurn.body.runtime?.memoryRouting?.items ?? []

    assert.ok(
      selectedItems.some(
        (item) =>
          typeof item.content === 'string' &&
          item.content.includes('IASevero'),
      ),
      'The selected governed context must contain IASevero.',
    )

    assert.equal(
      typeof secondTurn.body.reply,
      'string',
      'The second turn must produce a textual reply.',
    )

    assert.ok(
      (secondTurn.body.reply as string).length > 0,
      'The second-turn reply must not be empty.',
    )

    /*
     * Same tenant, different user: no owner memory may be selected.
     */
    const isolationTurn = await callChat({
      tenantId,
      userId: otherUserId,
      executionKey: isolationExecutionKey,
      message:
        'Qual é o meu projeto principal?',
    })

    assert.equal(
      isolationTurn.response.status,
      200,
      'The isolated-user request must return a controlled response.',
    )

    assert.equal(
      Number(
        isolationTurn.body.runtime?.memoryRouting
          ?.selectedCount ?? 0,
      ),
      0,
      'The other user must not select the owner memory.',
    )

    assert.equal(
      isolationTurn.body.runtime?.memoryRouting?.grounded,
      false,
      'The other user must not be grounded by the owner memory.',
    )

    const leakedItems =
      isolationTurn.body.runtime?.memoryRouting?.items ?? []

    assert.equal(
      leakedItems.some(
        (item) =>
          typeof item.content === 'string' &&
          item.content.includes('IASevero'),
      ),
      false,
      'The owner memory must not leak into another user context.',
    )

    console.log(
      'Runtime API chat two-turn governed memory recall proof passed.',
    )

    console.log({
      firstTurn: {
        executionAllowed:
          firstTurn.body.runtime?.executionAllowed,
        executionSource:
          firstTurn.body.runtime?.executionIdentity?.source,
      },
      secondTurn: {
        executionAllowed:
          secondTurn.body.runtime?.executionAllowed,
        selectedCount:
          secondTurn.body.runtime?.memoryRouting
            ?.selectedCount,
        grounded:
          secondTurn.body.runtime?.memoryRouting?.grounded,
        selectedIASeveroMemory:
          selectedItems.some(
            (item) =>
              typeof item.content === 'string' &&
              item.content.includes('IASevero'),
          ),
        replyProduced:
          typeof secondTurn.body.reply === 'string' &&
          secondTurn.body.reply.length > 0,
      },
      isolationTurn: {
        selectedCount:
          isolationTurn.body.runtime?.memoryRouting
            ?.selectedCount,
        grounded:
          isolationTurn.body.runtime?.memoryRouting
            ?.grounded,
        crossUserLeakage: false,
      },
    })
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
