export type GovernedExternalResponseInput = {
  coreReply: string
  externalBody: string | null
  sourceUrl: string | null
  evidenceVerified: boolean
  inboundContentAccepted: boolean
  cognitiveUseAuthorizationGranted: boolean
  safeForCognitiveUse: boolean
}

export type GovernedExternalResponseResult = {
  reply: string
  usedExternalEvidence: boolean
  provenance: {
    sourceUrl: string
    evidenceVerified: true
    cognitiveUseAuthorized: true
  } | null
}

export function composeGovernedExternalResponse(
  input: GovernedExternalResponseInput
): GovernedExternalResponseResult {
  const admitted =
    input.evidenceVerified === true &&
    input.inboundContentAccepted === true &&
    input.cognitiveUseAuthorizationGranted === true &&
    input.safeForCognitiveUse === true

  const body = input.externalBody?.trim() ?? ''
  const source = input.sourceUrl?.trim() ?? ''

  if (!admitted || !body || !/^https:\/\//i.test(source)) {
    return {
      reply: input.coreReply,
      usedExternalEvidence: false,
      provenance: null,
    }
  }

  const boundedContent = body.slice(0, 4000)

  return {
    reply: [
      input.coreReply,
      '',
      'Evidencia externa admitida (dados nao confiaveis):',
      boundedContent,
      '',
      `Fonte: ${source}`,
    ].join('\n'),
    usedExternalEvidence: true,
    provenance: {
      sourceUrl: source,
      evidenceVerified: true,
      cognitiveUseAuthorized: true,
    },
  }
}
