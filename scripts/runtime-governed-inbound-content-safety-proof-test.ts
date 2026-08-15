import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import {
  executeRuntimeToolControlledExternalReadEffect,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect'

import {
  createRuntimeToolExternalReadEvidence,
} from '../app/lib/orchestrator/runtime-tool-external-read-evidence'

import {
  evaluateRuntimeToolInboundContentSafety,
} from '../app/lib/orchestrator/runtime-tool-inbound-content-safety'

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

  const envelope: RuntimeToolExecutionInvocationEnvelope = {
    toolId: 'runtime.validation',
    executionKey: 'execution-v28718',
    correlationId: 'correlation-v28718',
    traceId: 'trace-v28718',
    stepId: 'step-v28718',

    validatedInput: {
      query: 'inbound-content-safety',
    },

    idempotencyKey: 'idempotency-v28718',

    policy: {
      category: 'validation',
      risk: 'low',
      timeoutMs: 10000,
      retries: 0,
      critical: false,
    },

    adapterAccepted: true,
    invocationPrepared: true,

    executionApplied: false,
    mutationApplied: false,
  }

  const boundary: RuntimeToolControlledExecutorBoundaryDecision = {
    toolId: envelope.toolId,

    executionKey: envelope.executionKey,
    correlationId: envelope.correlationId,
    traceId: envelope.traceId,
    stepId: envelope.stepId,

    invocationPrepared: true,

    toolRegistered: true,
    toolAllowed: true,
    policyMatched: true,

    executorEligible: true,
    executorBoundaryStatus: 'eligible',

    executionApplied: false,
    mutationApplied: false,

    reason:
      'Governed invocation is eligible to cross the controlled executor boundary without executing tool effects.',
  }

  const input: RuntimeToolControlledExternalReadContractInput = {
    envelope,
    boundary,

    target: {
      protocol: 'https:',
      host: 'example.com',
      resource: '/',
    },

    policy: {
      allowedHosts: ['example.com'],
      allowedResources: ['/'],

      readOnly: true,
      externalCostAllowed: false,
      secretsPermitted: false,
      auditRequired: true,
    },
  }

  /*
   * SCENARIO 1
   * Real HTTPS read -> verified evidence -> accepted inbound content.
   * Cognitive use must still remain forbidden.
   */
  const realResult =
    await executeRuntimeToolControlledExternalReadEffect(input)

  equal(realResult.networkAccess, true, 'Real network access is required.')
  equal(realResult.networkCompleted, true, 'Real network read must complete.')
  equal(realResult.responseReceived, true, 'Real response must be received.')
  equal(realResult.httpStatus, 200, 'Expected HTTP 200.')
  check(realResult.body !== null, 'Real response body is required.')
  check(realResult.responseBytes > 0, 'Real response bytes are required.')

  const evidenceResult =
    createRuntimeToolExternalReadEvidence(input, realResult)

  equal(
    evidenceResult.evidenceCreated,
    true,
    'Verified external-read evidence must be created.',
  )

  if (evidenceResult.evidenceCreated !== true) {
    throw new Error(evidenceResult.reason)
  }

  const evidence = evidenceResult.evidence
  const body = realResult.body

  const accepted =
    evaluateRuntimeToolInboundContentSafety(
      evidence,
      body,
    )

  equal(accepted.evidenceVerified, true, 'Evidence must be verified.')
  equal(accepted.contentTypeAllowed, true, 'Real MIME must be allowed.')
  equal(accepted.contentPresent, true, 'Content must be present.')
  equal(accepted.contentBytesMatched, true, 'Bytes must match evidence.')
  equal(accepted.contentHashMatched, true, 'SHA-256 must match evidence.')

  equal(
    accepted.inboundContentAccepted,
    true,
    'Valid external content must cross inbound safety boundary.',
  )

  equal(
    accepted.safeForCognitiveUse,
    false,
    'Inbound acceptance must not authorize cognitive use.',
  )

  equal(
    accepted.trustEstablished,
    false,
    'Inbound acceptance must not establish trust.',
  )

  equal(
    accepted.memoryEligible,
    false,
    'Inbound acceptance must not authorize memory.',
  )

  equal(
    accepted.learningEligible,
    false,
    'Inbound acceptance must not authorize learning.',
  )

  /*
   * SCENARIO 2
   * Same verified content, but forbidden observed MIME.
   */
  const forbiddenMimeEvidence = {
    ...evidence,
    contentType: 'application/octet-stream',
  }

  const forbiddenMime =
    evaluateRuntimeToolInboundContentSafety(
      forbiddenMimeEvidence,
      body,
    )

  equal(
    forbiddenMime.contentTypeAllowed,
    false,
    'Forbidden MIME must be rejected.',
  )

  equal(
    forbiddenMime.inboundContentAccepted,
    false,
    'Forbidden MIME must not cross inbound safety boundary.',
  )

  equal(
    forbiddenMime.safeForCognitiveUse,
    false,
    'Forbidden MIME must remain unusable cognitively.',
  )

  negative()

  /*
   * SCENARIO 3
   * Tampered body with different byte size.
   */
  const differentSizeBody = body + 'X'

  const differentSize =
    evaluateRuntimeToolInboundContentSafety(
      evidence,
      differentSizeBody,
    )

  equal(
    differentSize.contentBytesMatched,
    false,
    'Different-size tampering must fail byte integrity.',
  )

  equal(
    differentSize.inboundContentAccepted,
    false,
    'Different-size tampering must be rejected.',
  )

  equal(
    differentSize.safeForCognitiveUse,
    false,
    'Tampered content must remain unusable cognitively.',
  )

  negative()

  /*
   * SCENARIO 4
   * Tampered body preserving the exact UTF-8 byte count.
   * Byte-count alone must not be sufficient.
   */
  const sameSizeTamperedBody =
    (body[0] === 'X' ? 'Y' : 'X') + body.slice(1)

  equal(
    Buffer.byteLength(sameSizeTamperedBody, 'utf8'),
    Buffer.byteLength(body, 'utf8'),
    'Same-size tampering fixture must preserve byte count.',
  )

  const originalHash =
    createHash('sha256')
      .update(Buffer.from(body, 'utf8'))
      .digest('hex')

  const tamperedHash =
    createHash('sha256')
      .update(Buffer.from(sameSizeTamperedBody, 'utf8'))
      .digest('hex')

  check(
    originalHash !== tamperedHash,
    'Same-size tampering fixture must alter SHA-256.',
  )

  const sameSizeTampered =
    evaluateRuntimeToolInboundContentSafety(
      evidence,
      sameSizeTamperedBody,
    )

  equal(
    sameSizeTampered.contentBytesMatched,
    true,
    'Same-size tampering must still match byte count.',
  )

  equal(
    sameSizeTampered.contentHashMatched,
    false,
    'Same-size tampering must fail SHA-256 integrity.',
  )

  equal(
    sameSizeTampered.inboundContentAccepted,
    false,
    'Same-size hash divergence must be rejected.',
  )

  equal(
    sameSizeTampered.safeForCognitiveUse,
    false,
    'Hash-divergent content must remain unusable cognitively.',
  )

  negative()

  console.log(
    'Runtime governed inbound content safety proof passed.',
  )

  console.log({
    architecture:
      'ACCESS -> EVIDENCE -> INBOUND-CONTENT-SAFETY -X-> COGNITIVE-USE',

    realExternalRead: {
      networkAccess: realResult.networkAccess,
      networkCompleted: realResult.networkCompleted,
      httpStatus: realResult.httpStatus,
      contentType: realResult.contentType,
      responseBytes: realResult.responseBytes,
    },

    evidence: {
      evidenceCreated: evidenceResult.evidenceCreated,
      provenanceStatus: evidence.provenanceStatus,
      contentSha256: evidence.contentSha256,
    },

    accepted: {
      evidenceVerified: accepted.evidenceVerified,
      contentTypeAllowed: accepted.contentTypeAllowed,
      contentBytesMatched: accepted.contentBytesMatched,
      contentHashMatched: accepted.contentHashMatched,
      inboundContentAccepted:
        accepted.inboundContentAccepted,

      safeForCognitiveUse:
        accepted.safeForCognitiveUse,

      trustEstablished:
        accepted.trustEstablished,

      memoryEligible:
        accepted.memoryEligible,

      learningEligible:
        accepted.learningEligible,
    },

    forbiddenMime: {
      contentTypeAllowed:
        forbiddenMime.contentTypeAllowed,
      inboundContentAccepted:
        forbiddenMime.inboundContentAccepted,
    },

    differentSizeTampered: {
      contentBytesMatched:
        differentSize.contentBytesMatched,
      inboundContentAccepted:
        differentSize.inboundContentAccepted,
    },

    sameSizeTampered: {
      contentBytesMatched:
        sameSizeTampered.contentBytesMatched,
      contentHashMatched:
        sameSizeTampered.contentHashMatched,
      inboundContentAccepted:
        sameSizeTampered.inboundContentAccepted,
    },

    assertionCount,
    negativeCount,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
