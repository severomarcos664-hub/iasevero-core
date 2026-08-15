import { createHash } from 'node:crypto'

import type {
  RuntimeToolExternalReadEvidence,
} from './runtime-tool-external-read-evidence'

export type RuntimeToolInboundContentSafetyDecision = {
  evidenceId: string
  contentSha256: string

  evidenceVerified: boolean
  contentTypeAllowed: boolean
  contentPresent: boolean
  contentBytesMatched: boolean
  contentHashMatched: boolean

  inboundContentAccepted: boolean
  safeForCognitiveUse: false

  trustEstablished: false
  memoryEligible: false
  learningEligible: false

  reason: string
}

const ALLOWED_CONTENT_TYPES = [
  'text/plain',
  'text/html',
  'application/json',
] as const

function normalizeContentType(
  value: string | null,
): string | null {
  if (value === null) {
    return null
  }

  return value
    .split(';', 1)[0]
    .trim()
    .toLowerCase()
}

export function evaluateRuntimeToolInboundContentSafety(
  evidence: RuntimeToolExternalReadEvidence,
  body: string,
): RuntimeToolInboundContentSafetyDecision {
  const evidenceVerified =
    evidence.provenanceStatus === 'verified'

  const normalizedContentType =
    normalizeContentType(evidence.contentType)

  const contentTypeAllowed =
    normalizedContentType !== null &&
    ALLOWED_CONTENT_TYPES.includes(
      normalizedContentType as
        (typeof ALLOWED_CONTENT_TYPES)[number],
    )

  const actualBytes =
    Buffer.byteLength(body, 'utf8')

  const contentPresent =
    body.length > 0 &&
    actualBytes > 0

  const contentBytesMatched =
    actualBytes === evidence.responseBytes

  const actualSha256 =
    createHash('sha256')
      .update(Buffer.from(body, 'utf8'))
      .digest('hex')

  const contentHashMatched =
    actualSha256 === evidence.contentSha256

  const inboundContentAccepted =
    evidenceVerified &&
    contentTypeAllowed &&
    contentPresent &&
    contentBytesMatched &&
    contentHashMatched

  /*
   * Acceptance at the inbound-content boundary is deliberately
   * not authorization for cognitive use.
   *
   * ACCESS != EVIDENCE != TRUST != USE != REMEMBER != LEARN
   */
  const safeForCognitiveUse = false

  let reason: string

  if (!evidenceVerified) {
    reason =
      'Inbound content safety requires verified external-read evidence.'
  } else if (!contentTypeAllowed) {
    reason =
      'Inbound content safety rejected the observed content type.'
  } else if (!contentPresent) {
    reason =
      'Inbound content safety rejected empty observed content.'
  } else if (!contentBytesMatched) {
    reason =
      'Inbound content safety rejected content byte divergence.'
  } else if (!contentHashMatched) {
    reason =
      'Inbound content safety rejected content hash divergence.'
  } else {
    reason =
      'Inbound content accepted at safety boundary; cognitive use remains unauthorized.'
  }

  return {
    evidenceId: evidence.evidenceId,
    contentSha256: evidence.contentSha256,

    evidenceVerified,
    contentTypeAllowed,
    contentPresent,
    contentBytesMatched,
    contentHashMatched,

    inboundContentAccepted,
    safeForCognitiveUse,

    trustEstablished: false,
    memoryEligible: false,
    learningEligible: false,

    reason,
  }
}
