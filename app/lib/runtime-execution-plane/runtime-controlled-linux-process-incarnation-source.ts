export type ControlledLinuxProcessIncarnationSourceInput = {
  processId: number
}

export type ControlledLinuxProcessIncarnationSourceResult = {
  schemaVersion: 1
  kind: 'iasevero-controlled-linux-process-incarnation-source'

  processId: number
  sourceKind: 'linux-process-incarnation'

  processIncarnationSourcePrepared: true

  bootIdRead: false
  processStatRead: false
  processIncarnationVerified: false

  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function prepareControlledLinuxProcessIncarnationSource(
  input: ControlledLinuxProcessIncarnationSourceInput,
): ControlledLinuxProcessIncarnationSourceResult {
  if (
    !Number.isSafeInteger(input.processId) ||
    input.processId <= 0
  ) {
    throw new Error(
      'Controlled Linux process incarnation source requires a valid processId.',
    )
  }

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-linux-process-incarnation-source',

    processId: input.processId,
    sourceKind: 'linux-process-incarnation',

    processIncarnationSourcePrepared: true,

    bootIdRead: false,
    processStatRead: false,
    processIncarnationVerified: false,

    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
