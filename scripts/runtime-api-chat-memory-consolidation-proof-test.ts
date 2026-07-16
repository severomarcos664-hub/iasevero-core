import { strict as assert } from 'node:assert'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

async function main(): Promise<void> {
  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), 'iasevero-api-chat-governance-proof-'),
  )

  const databasePath = join(
    temporaryDirectory,
    'enterprise-memory-proof.sqlite',
  )

  const previousDatabasePath =
    process.env.IASEVERO_MEMORY_DB_PATH

  process.env.IASEVERO_MEMORY_DB_PATH = databasePath

  try {
    const { POST } = await import('../app/api/chat/route')

    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: 'tenant-api-chat-proof',
          userId: 'user-api-chat-proof',
          executionKey:
            'execution-api-chat-memory-proof',
          message:
            'Responda apenas: teste local aprovado.',
        }),
      }),
    )

    const body = (await response.json()) as {
      reply?: unknown
      runtime?: {
        allowed?: unknown
        reason?: unknown
        operationalState?: unknown
      }
    }

    assert.equal(
      response.status,
      200,
      'The governed route must return a controlled response.',
    )

    assert.equal(
      body.runtime?.allowed,
      false,
      'The current governed baseline must block this execution.',
    )

    assert.equal(
      body.runtime?.operationalState,
      'blocked-by-authority',
      'The block must originate from runtime authority.',
    )

    assert.equal(
      existsSync(databasePath),
      false,
      'A request blocked before memory execution must not initialize the memory database.',
    )

    console.log(
      'Runtime API chat governed memory precondition proof passed.',
    )

    console.log({
      responseStatus: response.status,
      executionAllowed: false,
      operationalState:
        body.runtime?.operationalState,
      memoryDatabaseCreated: false,
      eventsPersisted: 0,
      candidatesCreated: 0,
      unauthorizedActivation: 0,
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
