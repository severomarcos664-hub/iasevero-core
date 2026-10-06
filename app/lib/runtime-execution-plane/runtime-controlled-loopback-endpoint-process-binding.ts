export type ControlledLoopbackEndpointProcessBindingInput = {
  expectedProcessId: number
  observedProcessId: number
  host: '127.0.0.1'
  port: number
}

export type ControlledLoopbackEndpointProcessBinding = {
  schemaVersion: 1
  kind: 'iasevero-controlled-loopback-endpoint-process-binding'

  expectedProcessId: number
  observedProcessId: number
  host: '127.0.0.1'
  port: number

  processIdentityMatchObserved: boolean
  physicalOwnershipVerificationEligible: boolean
  physicalOwnershipVerified: false

  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createControlledLoopbackEndpointProcessBinding(
  input: ControlledLoopbackEndpointProcessBindingInput,
): ControlledLoopbackEndpointProcessBinding {
  if (
    !Number.isSafeInteger(input.expectedProcessId) ||
    input.expectedProcessId <= 0
  ) {
    throw new Error(
      'Controlled loopback endpoint process binding requires a valid expectedProcessId.',
    )
  }

  if (
    !Number.isSafeInteger(input.observedProcessId) ||
    input.observedProcessId <= 0
  ) {
    throw new Error(
      'Controlled loopback endpoint process binding requires a valid observedProcessId.',
    )
  }

  if (input.host !== '127.0.0.1') {
    throw new Error(
      'Controlled loopback endpoint process binding permits only 127.0.0.1.',
    )
  }

  if (
    !Number.isSafeInteger(input.port) ||
    input.port < 1 ||
    input.port > 65535
  ) {
    throw new Error(
      'Controlled loopback endpoint process binding requires a valid bounded port.',
    )
  }

  const processIdentityMatchObserved =
    input.expectedProcessId === input.observedProcessId

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-loopback-endpoint-process-binding',

    expectedProcessId: input.expectedProcessId,
    observedProcessId: input.observedProcessId,
    host: input.host,
    port: input.port,

    processIdentityMatchObserved,
    physicalOwnershipVerificationEligible: processIdentityMatchObserved,
    physicalOwnershipVerified: false,

    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
