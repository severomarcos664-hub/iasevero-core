export type ControlledProcessIncarnationEvidenceInput = {
  processId: number
  bootId: string
  processStartTicks: number
}

export type ControlledProcessIncarnationEvidence = {
  schemaVersion: 1
  kind: 'iasevero-controlled-process-incarnation-evidence'

  processId: number
  bootId: string
  processStartTicks: number

  processIncarnationEvidenceRecorded: true
  processIncarnationVerified: false

  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createControlledProcessIncarnationEvidence(
  input: ControlledProcessIncarnationEvidenceInput,
): ControlledProcessIncarnationEvidence {
  if (
    !Number.isSafeInteger(input.processId) ||
    input.processId <= 0
  ) {
    throw new Error(
      'Controlled process incarnation evidence requires a valid processId.',
    )
  }

  if (
    typeof input.bootId !== 'string' ||
    input.bootId.trim().length === 0
  ) {
    throw new Error(
      'Controlled process incarnation evidence requires a non-empty bootId.',
    )
  }

  if (
    !Number.isSafeInteger(input.processStartTicks) ||
    input.processStartTicks < 0
  ) {
    throw new Error(
      'Controlled process incarnation evidence requires valid processStartTicks.',
    )
  }

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-process-incarnation-evidence',

    processId: input.processId,
    bootId: input.bootId.trim(),
    processStartTicks: input.processStartTicks,

    processIncarnationEvidenceRecorded: true,
    processIncarnationVerified: false,

    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
