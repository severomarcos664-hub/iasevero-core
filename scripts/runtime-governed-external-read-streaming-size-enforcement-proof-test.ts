import assert from 'node:assert/strict'

import {
  readRuntimeToolBoundedResponseBody,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect'

async function main(): Promise<void> {
  let assertionCount = 0
  let negativeCount = 0

  function equal<T>(
    actual: T,
    expected: T,
    message: string,
  ): void {
    assertionCount += 1
    assert.equal(actual, expected, message)
  }

  function check(
    condition: unknown,
    message: string,
  ): asserts condition {
    assertionCount += 1
    assert.ok(condition, message)
  }

  function negative(): void {
    negativeCount += 1
  }

  const encoder = new TextEncoder()

  function createChunkedResponse(
    chunks: string[],
    onCancel: () => void,
  ): Response {
    let index = 0

    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (index >= chunks.length) {
          controller.close()
          return
        }

        controller.enqueue(
          encoder.encode(chunks[index]),
        )
        index += 1
      },

      cancel() {
        onCancel()
      },
    })

    return new Response(body, {
      status: 200,
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  /*
   * Scenario 1:
   * body below budget, no Content-Length.
   */
  let belowCancelCount = 0

  const belowResponse =
    createChunkedResponse(
      ['abc', 'def'],
      () => {
        belowCancelCount += 1
      },
    )

  equal(
    belowResponse.headers.get('content-length'),
    null,
    'Below-budget fixture must not depend on Content-Length.',
  )

  const below =
    await readRuntimeToolBoundedResponseBody(
      belowResponse,
      8,
    )

  equal(
    below.exceeded,
    false,
    'Below-budget body must be accepted.',
  )

  if (below.exceeded) {
    throw new Error(
      'Below-budget body unexpectedly exceeded budget.',
    )
  }

  equal(below.responseBytes, 6, 'Expected 6 bytes.')
  equal(below.body, 'abcdef', 'Body must be preserved.')
  equal(
    belowCancelCount,
    0,
    'Below-budget stream must not be cancelled.',
  )

  /*
   * Scenario 2:
   * body exactly at budget.
   */
  let exactCancelCount = 0

  const exactResponse =
    createChunkedResponse(
      ['1234', '5678'],
      () => {
        exactCancelCount += 1
      },
    )

  const exact =
    await readRuntimeToolBoundedResponseBody(
      exactResponse,
      8,
    )

  equal(
    exact.exceeded,
    false,
    'Exactly-at-budget body must be accepted.',
  )

  if (exact.exceeded) {
    throw new Error(
      'Exactly-at-budget body unexpectedly exceeded budget.',
    )
  }

  equal(exact.responseBytes, 8, 'Expected exactly 8 bytes.')
  equal(exact.body, '12345678', 'Exact body must be preserved.')
  equal(
    exactCancelCount,
    0,
    'Exactly-at-budget stream must not be cancelled.',
  )

  /*
   * Scenario 3:
   * body crosses budget during streaming.
   */
  negative()

  let exceededCancelCount = 0

  const exceededResponse =
    createChunkedResponse(
      ['1234', '5678', '9'],
      () => {
        exceededCancelCount += 1
      },
    )

  equal(
    exceededResponse.headers.get('content-length'),
    null,
    'Oversize fixture must not depend on Content-Length.',
  )

  const exceeded =
    await readRuntimeToolBoundedResponseBody(
      exceededResponse,
      8,
    )

  equal(
    exceeded.exceeded,
    true,
    'Streaming body must fail closed after crossing budget.',
  )

  if (!exceeded.exceeded) {
    throw new Error(
      'Oversize body was incorrectly accepted.',
    )
  }

  equal(
    exceeded.body,
    null,
    'Oversize body must never be exposed as accepted body.',
  )

  equal(
    exceeded.responseBytes,
    9,
    'Observed byte count must record budget crossing.',
  )

  equal(
    exceededCancelCount,
    1,
    'Reader must cancel the stream after budget crossing.',
  )

  /*
   * Scenario 4:
   * invalid budget is rejected.
   */
  negative()

  let invalidBudgetRejected = false

  try {
    await readRuntimeToolBoundedResponseBody(
      createChunkedResponse(
        ['x'],
        () => undefined,
      ),
      0,
    )
  } catch {
    invalidBudgetRejected = true
  }

  check(
    invalidBudgetRejected,
    'Non-positive byte budget must fail closed.',
  )

  console.log(
    'Runtime governed external-read streaming size enforcement proof passed.',
  )

  console.log({
    architecture:
      'governed-external-read -> bounded-stream-consumption -> size-enforcement',

    belowBudget: {
      exceeded: below.exceeded,
      responseBytes: below.responseBytes,
      cancelled: belowCancelCount > 0,
    },

    exactBudget: {
      exceeded: exact.exceeded,
      responseBytes: exact.responseBytes,
      cancelled: exactCancelCount > 0,
    },

    exceededBudget: {
      exceeded: exceeded.exceeded,
      responseBytes: exceeded.responseBytes,
      bodyExposed: exceeded.body !== null,
      cancelled: exceededCancelCount > 0,
    },

    invalidBudgetRejected,

    assertionCount,
    negativeCount,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
