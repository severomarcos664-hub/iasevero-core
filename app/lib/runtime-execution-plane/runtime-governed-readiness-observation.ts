export type GovernedRuntimeReadinessObservationTarget = {
  processId: number
  host: string
  port: number
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

export type GovernedRuntimeReadinessObservationSample = {
  observedProcessId: number
  observedHost: string
  observedPort: number
  transportReachable: boolean
  applicationResponsive: boolean
}

export type GovernedRuntimeReadinessObservationProbe = (
  target: Readonly<GovernedRuntimeReadinessObservationTarget>,
) => GovernedRuntimeReadinessObservationSample

export type GovernedRuntimeReadinessObservationInput = {
  target: GovernedRuntimeReadinessObservationTarget
  probe: GovernedRuntimeReadinessObservationProbe
}

export type GovernedRuntimeReadinessObservationResult =
  GovernedRuntimeReadinessObservationSample & {
    processIdentityVerified: true
    endpointIdentityVerified: true
    probeObservationRecorded: true
    readinessGranted: false
    livenessGranted: false
    runtimeAuthorityGranted: false
    networkAuthorityGranted: false
  }

export function observeGovernedRuntimeReadiness(
  input: GovernedRuntimeReadinessObservationInput,
): GovernedRuntimeReadinessObservationResult {
  const { target, probe } = input

  if (
    !Number.isSafeInteger(target.processId) ||
    target.processId <= 0 ||
    typeof target.host !== 'string' ||
    target.host.trim().length === 0 ||
    !Number.isSafeInteger(target.port) ||
    target.port <= 0 ||
    target.port > 65535 ||
    target.runtimeAuthorityGranted !== false ||
    target.networkAuthorityGranted !== false
  ) {
    throw new Error(
      'Governed readiness observation requires a valid zero-authority target.',
    )
  }

  const observation = probe(
    Object.freeze({
      ...target,
    }),
  )

  if (
    observation.observedProcessId !== target.processId ||
    observation.observedHost !== target.host ||
    observation.observedPort !== target.port
  ) {
    throw new Error(
      'Governed readiness observation requires exact process and endpoint identity binding.',
    )
  }

  if (
    typeof observation.transportReachable !== 'boolean' ||
    typeof observation.applicationResponsive !== 'boolean'
  ) {
    throw new Error(
      'Governed readiness observation requires explicit transport and application observations.',
    )
  }

  return {
    observedProcessId: observation.observedProcessId,
    observedHost: observation.observedHost,
    observedPort: observation.observedPort,
    transportReachable: observation.transportReachable,
    applicationResponsive: observation.applicationResponsive,

    processIdentityVerified: true,
    endpointIdentityVerified: true,
    probeObservationRecorded: true,

    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  }
}
