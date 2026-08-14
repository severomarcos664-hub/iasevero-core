import assert from 'node:assert/strict'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

type ApiResponseBody = {
  toolDispatchHandoff?: {
    handoffStatus?: unknown
    dispatchApplied?: unknown
    executionApplied?: unknown
    mutationApplied?: unknown
  }
  toolDispatchApplication?: {
    dispatchApplied?: unknown
    executionApplied?: unknown
    mutationApplied?: unknown
  }
  toolExecutionGate?: {
    executionEligible?: unknown
    executionApplied?: unknown
    mutationApplied?: unknown
  }
  toolExecutionHandoff?: {
    dispatchApplied?: unknown
    executionEligible?: unknown
    handoffStatus?: unknown
    executionApplied?: unknown
    mutationApplied?: unknown
  }
}

async function main(): Promise<void> {
  const trackedRuntimeFiles = [
    'context.json',
    'data/memory.json',
    'runtime/runtime-snapshots.json',
  ]

  const trackedRuntimeState = new Map<string, string | null>()

  for (const file of trackedRuntimeFiles) {
    trackedRuntimeState.set(
      file,
      existsSync(file) ? readFileSync(file, 'utf8') : null,
    )
  }

  const temporaryDirectory = mkdtempSync(
    join(tmpdir(), 'iasevero-v287.15-chain-proof-'),
  )

  const databasePath = join(
    temporaryDirectory,
    'v287.15-chain.sqlite',
  )

  const previousDatabasePath =
    process.env.IASEVERO_MEMORY_DB_PATH

  process.env.IASEVERO_MEMORY_DB_PATH = databasePath

  const stamp = Date.now()
  const executionKey = `v287.15-chain-${stamp}`

  try {
    const { POST } = await import('../app/api/chat/route')

    const response = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Responda apenas: teste local aprovado.',
          tenantId: 'v287.15-chain-tenant',
          userId: `v287.15-chain-user-${stamp}`,
          executionKey,
        }),
      }),
    )

    const body = (await response.json()) as ApiResponseBody

    assert.equal(response.status, 200)

    assert.ok(
      body.toolDispatchHandoff,
      'API response must expose the canonical tool dispatch handoff.',
    )

    assert.ok(
      body.toolDispatchApplication,
      'API response must expose the canonical dispatch application.',
    )

    assert.ok(
      body.toolExecutionGate,
      'API response must expose the canonical execution gate.',
    )

    assert.ok(
      body.toolExecutionHandoff,
      'API response must expose the canonical execution handoff.',
    )

    assert.equal(
      body.toolDispatchApplication?.executionApplied,
      false,
    )

    assert.equal(
      body.toolDispatchApplication?.mutationApplied,
      false,
    )

    assert.equal(
      body.toolExecutionGate?.executionApplied,
      false,
    )

    assert.equal(
      body.toolExecutionGate?.mutationApplied,
      false,
    )

    assert.equal(
      body.toolExecutionHandoff?.dispatchApplied,
      true,
    )

    assert.equal(
      body.toolExecutionHandoff?.executionEligible,
      true,
    )

    assert.equal(
      body.toolExecutionHandoff?.handoffStatus,
      'ready',
    )

    assert.equal(
      body.toolExecutionHandoff?.executionApplied,
      false,
    )

    assert.equal(
      body.toolExecutionHandoff?.mutationApplied,
      false,
    )

    console.log(
      'Runtime governed canonical execution chain integration proof passed.',
    )

    console.log({
      architecture:
        'dispatch-handoff -> dispatch-application -> execution-gate -> execution-handoff',
      handoffStatus:
        body.toolDispatchHandoff?.handoffStatus,
      dispatchApplied:
        body.toolDispatchApplication?.dispatchApplied,
      executionEligible:
        body.toolExecutionGate?.executionEligible,
      executionApplied:
        body.toolExecutionGate?.executionApplied,
      mutationApplied:
        body.toolExecutionGate?.mutationApplied,
      executionHandoffStatus:
        body.toolExecutionHandoff?.handoffStatus,
      executionHandoffApplied:
        body.toolExecutionHandoff?.executionApplied,
      executionHandoffMutationApplied:
        body.toolExecutionHandoff?.mutationApplied,
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

    for (const [file, content] of trackedRuntimeState) {
      if (content === null) {
        rmSync(file, { force: true })
      } else {
        writeFileSync(file, content)
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
