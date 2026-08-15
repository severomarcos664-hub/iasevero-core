import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import type {
  RuntimeToolExecutionInvocationEnvelope,
} from '../app/lib/orchestrator/runtime-tool-execution-invocation-envelope'

import type {
  RuntimeToolControlledExecutorBoundaryDecision,
} from '../app/lib/orchestrator/runtime-tool-controlled-executor-boundary'

import {
  evaluateRuntimeToolControlledExternalReadContract,
  type RuntimeToolControlledExternalReadContractInput,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-contract'

import {
  executeRuntimeToolControlledExternalReadEffect,
} from '../app/lib/orchestrator/runtime-tool-controlled-external-read-effect'

import {
  createRuntimeToolExternalReadEvidence,
} from '../app/lib/orchestrator/runtime-tool-external-read-evidence'

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

  const envelope: RuntimeToolExecutionInvocationEnvelope = {
    toolId: 'runtime.validation',
    executionKey: 'execution-v28717',
    correlationId: 'correlation-v28717',
    traceId: 'trace-v28717',
    stepId: 'step-v28717',

    validatedInput: {
      query: 'read-only-demo',
    },

    idempotencyKey: 'idempotency-v28717',

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

  const allowedInput: RuntimeToolControlledExternalReadContractInput = {
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

  const allowedContract =
    evaluateRuntimeToolControlledExternalReadContract(allowedInput)

  equal(
    allowedContract.contractEligible,
    true,
    `Expected eligible external-read contract: ${allowedContract.reason}`,
  )

  const realResult =
    await executeRuntimeToolControlledExternalReadEffect(allowedInput)

  equal(realResult.networkAttempted, true, 'Network must be attempted.')
  equal(realResult.networkCompleted, true, 'Network must complete.')
  equal(realResult.networkAccess, true, 'Real network access must occur.')
  equal(realResult.responseReceived, true, 'HTTP response must be observed.')
  equal(realResult.httpStatus, 200, 'Expected HTTP 200.')
  check(realResult.body !== null, 'Real response body must exist.')
  check(realResult.responseBytes > 0, 'Real response must contain bytes.')

  equal(
    realResult.responseBytes,
    Buffer.byteLength(realResult.body, 'utf8'),
    'Recorded byte count must equal actual UTF-8 response bytes.',
  )

  check(
    realResult.contentType !== null &&
      realResult.contentType.length > 0,
    'Observed HTTP Content-Type must exist.',
  )

  equal(realResult.externalReadApplied, true, 'External read must be applied.')
  equal(realResult.executionApplied, true, 'Execution must be applied.')

  equal(realResult.externalMutation, false, 'External mutation is forbidden.')
  equal(realResult.mutationApplied, false, 'Mutation must remain false.')
  equal(realResult.providerInvocation, false, 'Provider invocation must remain false.')

  const evidenceResult =
    createRuntimeToolExternalReadEvidence(allowedInput, realResult)

  equal(evidenceResult.evidenceCreated, true, 'Evidence must be created.')

  if (evidenceResult.evidenceCreated !== true) {
    throw new Error(`Evidence creation failed: ${evidenceResult.reason}`)
  }

  const evidence = evidenceResult.evidence

  const independentlyCalculatedHash =
    createHash('sha256')
      .update(Buffer.from(realResult.body, 'utf8'))
      .digest('hex')

  equal(
    evidence.contentSha256,
    independentlyCalculatedHash,
    'Evidence SHA-256 must equal independently recalculated body SHA-256.',
  )

  equal(
    evidence.responseBytes,
    Buffer.byteLength(realResult.body, 'utf8'),
    'Evidence byte count must equal actual body bytes.',
  )

  equal(
    evidence.contentType,
    realResult.contentType,
    'Evidence Content-Type must equal the observed HTTP Content-Type.',
  )

  equal(evidence.httpStatus, realResult.httpStatus, 'HTTP status must be preserved.')

  equal(evidence.executionKey, envelope.executionKey, 'executionKey must be preserved.')
  equal(evidence.correlationId, envelope.correlationId, 'correlationId must be preserved.')
  equal(evidence.traceId, envelope.traceId, 'traceId must be preserved.')
  equal(evidence.stepId, envelope.stepId, 'stepId must be preserved.')

  equal(evidence.protocol, allowedInput.target.protocol, 'Protocol must be preserved.')
  equal(evidence.host, allowedInput.target.host, 'Host must be preserved.')
  equal(evidence.resource, allowedInput.target.resource, 'Resource must be preserved.')

  equal(evidence.provenanceStatus, 'verified', 'Provenance must be verified.')

  equal(evidence.contractEligible, true, 'Evidence contract must be eligible.')
  equal(evidence.networkCompleted, true, 'Evidence must record network completion.')
  equal(evidence.networkAccess, true, 'Evidence must record network access.')
  equal(evidence.responseReceived, true, 'Evidence must record response receipt.')
  equal(evidence.externalReadApplied, true, 'Evidence must record applied read.')
  equal(evidence.executionApplied, true, 'Evidence must record applied execution.')

  equal(evidence.externalMutation, false, 'Evidence must reject external mutation.')
  equal(evidence.mutationApplied, false, 'Evidence mutation must remain false.')
  equal(evidence.providerInvocation, false, 'Evidence provider invocation must remain false.')

  check(
    evidence.evidenceId.length > 0,
    'Evidence must have an identifier.',
  )

  check(
    !Number.isNaN(Date.parse(evidence.observedAt)),
    'Evidence must have a valid observation timestamp.',
  )

  const blockedInput: RuntimeToolControlledExternalReadContractInput = {
    ...allowedInput,

    target: {
      protocol: 'https:',
      host: 'blocked.invalid',
      resource: '/not-allowed',
    },
  }

  const blockedResult =
    await executeRuntimeToolControlledExternalReadEffect(blockedInput)

  equal(blockedResult.networkAttempted, false, 'Blocked read must not attempt network.')
  equal(blockedResult.networkCompleted, false, 'Blocked read must not complete network.')
  equal(blockedResult.networkAccess, false, 'Blocked read must not access network.')
  equal(blockedResult.responseReceived, false, 'Blocked read must not receive response.')
  equal(blockedResult.externalReadApplied, false, 'Blocked read must not apply read.')
  equal(blockedResult.executionApplied, false, 'Blocked read must not apply execution.')
  equal(blockedResult.externalMutation, false, 'Blocked path must not mutate externally.')
  equal(blockedResult.mutationApplied, false, 'Blocked path must not mutate.')
  equal(blockedResult.providerInvocation, false, 'Blocked path must not invoke provider.')

  const blockedEvidence =
    createRuntimeToolExternalReadEvidence(blockedInput, blockedResult)

  equal(
    blockedEvidence.evidenceCreated,
    false,
    'Blocked external read must not produce verified evidence.',
  )
  negative()

  const tamperedResult = {
    ...realResult,
    responseBytes: realResult.responseBytes + 1,
  }

  const tamperedEvidence =
    createRuntimeToolExternalReadEvidence(allowedInput, tamperedResult)

  equal(
    tamperedEvidence.evidenceCreated,
    false,
    'Byte-divergent result must not produce verified evidence.',
  )
  negative()

  console.log('Runtime governed external-read evidence/provenance proof passed.')
  console.log({
    architecture:
      'governed-external-read -> observed-response -> canonical-evidence -> verified-provenance',

    realExternalRead: {
      networkAttempted: realResult.networkAttempted,
      networkCompleted: realResult.networkCompleted,
      networkAccess: realResult.networkAccess,
      httpStatus: realResult.httpStatus,
      contentType: realResult.contentType,
      responseBytes: realResult.responseBytes,
      externalReadApplied: realResult.externalReadApplied,
      executionApplied: realResult.executionApplied,
      externalMutation: realResult.externalMutation,
      mutationApplied: realResult.mutationApplied,
      providerInvocation: realResult.providerInvocation,
    },

    evidence: {
      evidenceCreated: evidenceResult.evidenceCreated,
      evidenceId: evidence.evidenceId,
      contentSha256: evidence.contentSha256,
      provenanceStatus: evidence.provenanceStatus,
      executionKey: evidence.executionKey,
      correlationId: evidence.correlationId,
      traceId: evidence.traceId,
      stepId: evidence.stepId,
    },

    blocked: {
      networkAttempted: blockedResult.networkAttempted,
      networkAccess: blockedResult.networkAccess,
      evidenceCreated: blockedEvidence.evidenceCreated,
    },

    tampered: {
      evidenceCreated: tamperedEvidence.evidenceCreated,
    },

    assertionCount,
    negativeCount,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
