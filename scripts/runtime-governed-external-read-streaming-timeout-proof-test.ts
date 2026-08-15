import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'

import {
  readRuntimeToolBoundedResponseBody,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect'

async function main(): Promise<void> {
  let assertionCount = 0
  let negativeCount = 0

  function check(
    condition: unknown,
    message: string,
  ): asserts condition {
    assertionCount += 1
    assert.ok(condition, message)
  }

  function equal<T>(
    actual: T,
    expected: T,
    message: string,
  ): void {
    assertionCount += 1
    assert.equal(actual, expected, message)
  }

  function negative(): void {
    negativeCount += 1
  }

  /*
   * This is a transport/body-consumption proof.
   *
   * It does not weaken or bypass IASevero HTTPS governance.
   * The local HTTP server exists only to deterministically
   * control body timing.
   *
   * Production linkage being proved:
   *
   * AbortSignal.timeout(timeoutMs)
   *        ↓
   * fetch(...)
   *        ↓
   * Response
   *        ↓
   * readRuntimeToolBoundedResponseBody(...)
   *        ↓
   * response.body.getReader()
   *        ↓
   * pending reader.read()
   *        ↓
   * AbortError when timeout expires
   */

  const timeoutMs = 120
  const lateBodyDelayMs = 1000
  const maxBytes = 256 * 1024

  let requestObserved = false
  let headersSent = false
  let firstChunkSent = false
  let lateBodySent = false

  const server = createServer((_request, response) => {
    requestObserved = true

    response.writeHead(200, {
      'content-type': 'text/plain',
    })

    response.write('first-chunk')
    headersSent = true
    firstChunkSent = true

    setTimeout(() => {
      if (!response.destroyed) {
        lateBodySent = true
        response.end('-late-chunk')
      }
    }, lateBodyDelayMs)
  })

  server.listen(0, '127.0.0.1')
  await once(server, 'listening')

  const address = server.address()

  if (address === null || typeof address === 'string') {
    server.close()
    throw new Error(
      'Unable to resolve local transport proof server address.',
    )
  }

  const signal = AbortSignal.timeout(timeoutMs)

  let fetchResolved = false
  let boundedReadCompleted = false
  let boundedReadResult: unknown = null
  let boundedReadError: unknown = null

  const startedAt = Date.now()

  try {
    const response = await fetch(
      `http://127.0.0.1:${address.port}/stream-timeout`,
      {
        method: 'GET',
        signal,
      },
    )

    fetchResolved = true

    equal(
      response.status,
      200,
      'Transport fixture must return HTTP 200 headers.',
    )

    negative()

    try {
      boundedReadResult =
        await readRuntimeToolBoundedResponseBody(
          response,
          maxBytes,
        )

      boundedReadCompleted = true
    } catch (error) {
      boundedReadError = error
    }
  } finally {
    await new Promise<void>((resolve) => {
      server.close(() => resolve())
    })
  }

  const elapsedMs = Date.now() - startedAt

  check(
    requestObserved,
    'Local request must reach the deterministic fixture.',
  )

  check(
    headersSent,
    'Headers must arrive before the body stall.',
  )

  check(
    firstChunkSent,
    'At least one body chunk must arrive before timeout.',
  )

  check(
    fetchResolved,
    'fetch() must resolve after headers and before timeout.',
  )

  check(
    signal.aborted,
    'AbortSignal must expire while body consumption is pending.',
  )

  equal(
    boundedReadCompleted,
    false,
    'Canonical bounded reader must not complete after timeout.',
  )

  equal(
    boundedReadResult,
    null,
    'Canonical bounded reader must not expose a completed result after timeout.',
  )

  check(
    boundedReadError instanceof Error,
    'Canonical bounded reader must terminate with an error.',
  )

  check(
    elapsedMs < lateBodyDelayMs,
    'Canonical body consumption must terminate before delayed body completion.',
  )

  console.log(
    'Runtime governed external-read canonical streaming timeout proof passed.',
  )

  console.log({
    architecture:
      'AbortSignal.timeout -> fetch Response -> canonical bounded reader -> pending reader.read -> abort',

    timeoutMs,
    lateBodyDelayMs,
    maxBytes,
    elapsedMs,

    requestObserved,
    headersSent,
    firstChunkSent,
    fetchResolved,

    signalAborted: signal.aborted,

    boundedReadCompleted,
    boundedReadResult,

    boundedReadError:
      boundedReadError instanceof Error
        ? {
            name: boundedReadError.name,
            message: boundedReadError.message,
          }
        : boundedReadError,

    lateBodySent,

    assertionCount,
    negativeCount,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
