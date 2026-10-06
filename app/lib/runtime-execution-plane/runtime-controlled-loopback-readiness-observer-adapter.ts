export type ControlledLoopbackReadinessObserverAdapterInput = {
  processId: number
  host: '127.0.0.1'
  port: number
  timeoutMs: number
}

export type ControlledLoopbackReadinessObserverAdapter = {
  schemaVersion: 1
  kind: 'iasevero-controlled-loopback-readiness-observer-adapter'

  processId: number
  host: '127.0.0.1'
  port: number
  timeoutMs: number

  loopbackOnly: true
  redirectAllowed: false
  internetAllowed: false

  observationApplied: false
  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export function createControlledLoopbackReadinessObserverAdapter(
  input: ControlledLoopbackReadinessObserverAdapterInput,
): ControlledLoopbackReadinessObserverAdapter {
  if (!Number.isSafeInteger(input.processId) || input.processId <= 0) {
    throw new Error(
      'Controlled loopback readiness observer requires a valid positive processId.',
    )
  }

  if (input.host !== '127.0.0.1') {
    throw new Error(
      'Controlled loopback readiness observer permits only 127.0.0.1.',
    )
  }

  if (
    !Number.isSafeInteger(input.port) ||
    input.port < 1 ||
    input.port > 65535
  ) {
    throw new Error(
      'Controlled loopback readiness observer requires a valid bounded port.',
    )
  }

  if (
    !Number.isSafeInteger(input.timeoutMs) ||
    input.timeoutMs < 1 ||
    input.timeoutMs > 5000
  ) {
    throw new Error(
      'Controlled loopback readiness observer requires a bounded timeoutMs.',
    )
  }

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-loopback-readiness-observer-adapter',

    processId: input.processId,
    host: input.host,
    port: input.port,
    timeoutMs: input.timeoutMs,

    loopbackOnly: true,
    redirectAllowed: false,
    internetAllowed: false,

    observationApplied: false,
    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
