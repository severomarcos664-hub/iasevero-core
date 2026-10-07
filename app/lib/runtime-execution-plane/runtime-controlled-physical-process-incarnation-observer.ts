export type ControlledPhysicalProcessIncarnationObservationInput = {
  processId: number
  bootId: string
  processStartTicks: number
}

export type ControlledPhysicalProcessIncarnationObservation = {
  schemaVersion: 1
  kind: 'iasevero-controlled-physical-process-incarnation-observation'

  processId: number
  bootId: string
  processStartTicks: number

  processIncarnationObserved: true
  processIncarnationVerified: false

  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function observeControlledPhysicalProcessIncarnation(
  input: ControlledPhysicalProcessIncarnationObservationInput,
): ControlledPhysicalProcessIncarnationObservation {
  if (
    !Number.isSafeInteger(input.processId) ||
    input.processId <= 0
  ) {
    throw new Error(
      'Controlled physical process incarnation observation requires a valid processId.',
    )
  }

  if (
    typeof input.bootId !== 'string' ||
    input.bootId.trim().length === 0
  ) {
    throw new Error(
      'Controlled physical process incarnation observation requires a non-empty bootId.',
    )
  }

  if (
    !Number.isSafeInteger(input.processStartTicks) ||
    input.processStartTicks < 0
  ) {
    throw new Error(
      'Controlled physical process incarnation observation requires valid processStartTicks.',
    )
  }

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-physical-process-incarnation-observation',

    processId: input.processId,
    bootId: input.bootId.trim(),
    processStartTicks: input.processStartTicks,

    processIncarnationObserved: true,
    processIncarnationVerified: false,

    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
