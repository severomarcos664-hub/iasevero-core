type CanonicalProcessIncarnationEvidence =
  ReturnType<
    typeof import(
      './runtime-controlled-process-incarnation-evidence'
    ).createControlledProcessIncarnationEvidence
  >

export type ControlledProcessIncarnationExpectedIdentity =
  Readonly<{
    processId: number
    bootId: string
    processStartTicks: number
  }>

export type ControlledProcessIncarnationVerificationDecision =
  Readonly<{
    schemaVersion: 1
    kind:
      'iasevero-controlled-process-incarnation-verification-decision'

    processId: number
    bootId: string
    processStartTicks: number

    verificationEvaluated: true
    identityMatched: boolean

    processIncarnationEvidenceRecorded: true
    processIncarnationVerified: boolean

    readinessGranted: false
    livenessGranted: false
    runtimeAuthorityGranted: false
    networkAuthorityGranted: false
  }>

export function verifyControlledProcessIncarnationEvidence(
  input: Readonly<{
    expected: ControlledProcessIncarnationExpectedIdentity
    evidence: CanonicalProcessIncarnationEvidence
  }>,
): ControlledProcessIncarnationVerificationDecision {
  if (
    !Number.isSafeInteger(input.expected.processId) ||
    input.expected.processId <= 0
  ) {
    throw new Error(
      'Controlled process incarnation verification requires a valid expected processId.',
    )
  }

  if (
    typeof input.expected.bootId !== 'string' ||
    input.expected.bootId.trim().length === 0
  ) {
    throw new Error(
      'Controlled process incarnation verification requires a non-empty expected bootId.',
    )
  }

  if (
    !Number.isSafeInteger(
      input.expected.processStartTicks,
    ) ||
    input.expected.processStartTicks <= 0
  ) {
    throw new Error(
      'Controlled process incarnation verification requires valid expected processStartTicks.',
    )
  }

  const evidence = input.evidence

  if (
    evidence.processIncarnationEvidenceRecorded !== true ||
    evidence.processIncarnationVerified !== false ||
    evidence.readinessGranted !== false ||
    evidence.livenessGranted !== false ||
    evidence.runtimeAuthorityGranted !== false ||
    evidence.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Controlled process incarnation verification requires uncontaminated canonical evidence.',
    )
  }

  if (
    !Number.isSafeInteger(evidence.processId) ||
    evidence.processId <= 0 ||
    typeof evidence.bootId !== 'string' ||
    evidence.bootId.trim().length === 0 ||
    !Number.isSafeInteger(evidence.processStartTicks) ||
    evidence.processStartTicks <= 0
  ) {
    throw new Error(
      'Controlled process incarnation verification requires valid canonical identity evidence.',
    )
  }

  const expectedBootId =
    input.expected.bootId.trim()

  const observedBootId =
    evidence.bootId.trim()

  const identityMatched =
    input.expected.processId === evidence.processId &&
    expectedBootId === observedBootId &&
    input.expected.processStartTicks ===
      evidence.processStartTicks

  return Object.freeze({
    schemaVersion: 1 as const,
    kind:
      'iasevero-controlled-process-incarnation-verification-decision' as const,

    processId: evidence.processId,
    bootId: observedBootId,
    processStartTicks:
      evidence.processStartTicks,

    verificationEvaluated: true as const,
    identityMatched,

    processIncarnationEvidenceRecorded: true as const,
    processIncarnationVerified:
      identityMatched,

    readinessGranted: false as const,
    livenessGranted: false as const,
    runtimeAuthorityGranted: false as const,
    networkAuthorityGranted: false as const,
  })
}
