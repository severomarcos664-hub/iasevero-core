import {
  readControlledLinuxBootIdentity,
} from './runtime-controlled-linux-boot-identity-reader'

type ControlledLinuxBootIdentityObservationCandidate =
  Readonly<{
    bootIdRead: boolean
    bootId: string
    sourcePath: string
  }>

export type ControlledRealLinuxBootIdentityObservationResult =
  Readonly<{
    schemaVersion: 1
    kind: 'iasevero-controlled-real-linux-boot-identity-observation'

    bootId: string
    sourcePath: string

    physicalBootIdReadExecuted: boolean
    realBootIdentityObservationRecorded: boolean

    processIncarnationVerified: false
    readinessGranted: false
    livenessGranted: false
    runtimeAuthorityGranted: false
    networkAuthorityGranted: false
  }>

export function observeControlledRealLinuxBootIdentity(
  reader?: () => ControlledLinuxBootIdentityObservationCandidate,
): ControlledRealLinuxBootIdentityObservationResult {
  const physicalReadRequested = reader === undefined

  const source =
    reader !== undefined
      ? reader()
      : readControlledLinuxBootIdentity()

  if (
    source.bootIdRead !== true ||
    typeof source.bootId !== 'string' ||
    source.bootId.length === 0 ||
    source.sourcePath !== '/proc/sys/kernel/random/boot_id'
  ) {
    throw new Error(
      'Controlled real Linux boot identity observation requires valid certified boot identity evidence.',
    )
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    kind:
      'iasevero-controlled-real-linux-boot-identity-observation' as const,

    bootId: source.bootId,
    sourcePath: source.sourcePath,

    physicalBootIdReadExecuted: physicalReadRequested,
    realBootIdentityObservationRecorded: physicalReadRequested,

    processIncarnationVerified: false as const,
    readinessGranted: false as const,
    livenessGranted: false as const,
    runtimeAuthorityGranted: false as const,
    networkAuthorityGranted: false as const,
  })
}
