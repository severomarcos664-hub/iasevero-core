import { createHash, randomUUID } from 'node:crypto'

import type {
  RuntimeToolControlledExternalReadContractInput,
} from './runtime-tool-controlled-external-read-contract'

import type {
  RuntimeToolControlledExternalReadEffectResult,
} from './runtime-tool-controlled-external-read-effect'

export type RuntimeToolExternalReadEvidence = {
  evidenceId: string

  executionKey: string
  correlationId: string
  traceId: string
  stepId: string

  protocol: string
  host: string
  resource: string

  observedAt: string

  httpStatus: number
  contentType: string | null
  responseBytes: number
  contentSha256: string

  contractEligible: true
  networkCompleted: true
  networkAccess: true
  responseReceived: true
  externalReadApplied: true
  executionApplied: true

  externalMutation: false
  mutationApplied: false
  providerInvocation: false

  provenanceStatus: 'verified'
}

export type RuntimeToolExternalReadEvidenceBuildResult =
  | {
      evidenceCreated: true
      evidence: RuntimeToolExternalReadEvidence
      reason: string
    }
  | {
      evidenceCreated: false
      evidence: null
      reason: string
    }

export function createRuntimeToolExternalReadEvidence(
  input: RuntimeToolControlledExternalReadContractInput,
  effect: RuntimeToolControlledExternalReadEffectResult,
): RuntimeToolExternalReadEvidenceBuildResult {
  if (
    effect.contract.contractEligible !== true ||
    effect.contract.contractStatus !== 'eligible'
  ) {
    return {
      evidenceCreated: false,
      evidence: null,
      reason: 'External-read evidence requires an eligible governed contract.',
    }
  }

  if (
    effect.networkCompleted !== true ||
    effect.networkAccess !== true ||
    effect.responseReceived !== true ||
    effect.externalReadApplied !== true ||
    effect.executionApplied !== true
  ) {
    return {
      evidenceCreated: false,
      evidence: null,
      reason: 'External-read evidence requires a completed real external read.',
    }
  }

  if (
    effect.externalMutation !== false ||
    effect.mutationApplied !== false ||
    effect.providerInvocation !== false
  ) {
    return {
      evidenceCreated: false,
      evidence: null,
      reason: 'External-read evidence rejects mutation or provider invocation.',
    }
  }

  if (
    effect.httpStatus === null ||
    effect.body === null ||
    effect.body.length === 0
  ) {
    return {
      evidenceCreated: false,
      evidence: null,
      reason: 'External-read evidence requires an observed response body.',
    }
  }

  const actualBytes = Buffer.byteLength(effect.body, 'utf8')

  if (actualBytes !== effect.responseBytes) {
    return {
      evidenceCreated: false,
      evidence: null,
      reason: 'External-read evidence rejected response byte mismatch.',
    }
  }

  const contentSha256 = createHash('sha256')
    .update(Buffer.from(effect.body, 'utf8'))
    .digest('hex')

  return {
    evidenceCreated: true,
    evidence: {
      evidenceId: randomUUID(),

      executionKey: effect.contract.executionKey,
      correlationId: effect.contract.correlationId,
      traceId: effect.contract.traceId,
      stepId: effect.contract.stepId,

      protocol: input.target.protocol,
      host: input.target.host,
      resource: input.target.resource,

      observedAt: new Date().toISOString(),

      httpStatus: effect.httpStatus,
      contentType: effect.contentType,
      responseBytes: effect.responseBytes,
      contentSha256,

      contractEligible: true,
      networkCompleted: true,
      networkAccess: true,
      responseReceived: true,
      externalReadApplied: true,
      executionApplied: true,

      externalMutation: false,
      mutationApplied: false,
      providerInvocation: false,

      provenanceStatus: 'verified',
    },
    reason:
      'External-read evidence created from a completed governed external read.',
  }
}
