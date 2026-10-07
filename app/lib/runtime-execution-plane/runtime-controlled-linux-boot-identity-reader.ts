import { readFileSync } from 'node:fs'

export const CONTROLLED_LINUX_BOOT_ID_PATH =
  '/proc/sys/kernel/random/boot_id' as const

type ControlledLinuxBootIdentityReadText = (
  path: typeof CONTROLLED_LINUX_BOOT_ID_PATH,
  encoding: 'utf8',
) => string

export type ControlledLinuxBootIdentityReadResult = {
  schemaVersion: 1
  kind: 'iasevero-controlled-linux-boot-identity-read'

  sourcePath: typeof CONTROLLED_LINUX_BOOT_ID_PATH
  bootId: string

  bootIdRead: true

  processIncarnationVerified: false
  readinessGranted: false
  livenessGranted: false
  runtimeAuthorityGranted: false
  networkAuthorityGranted: false
}

const BOOT_ID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export function readControlledLinuxBootIdentity(
  readText: ControlledLinuxBootIdentityReadText = readFileSync,
): ControlledLinuxBootIdentityReadResult {
  const rawBootId = readText(
    CONTROLLED_LINUX_BOOT_ID_PATH,
    'utf8',
  )

  const bootId = rawBootId.trim()

  if (!BOOT_ID_PATTERN.test(bootId)) {
    throw new Error(
      'Controlled Linux boot identity reader received an invalid boot identity.',
    )
  }

  return Object.freeze({
    schemaVersion: 1,
    kind: 'iasevero-controlled-linux-boot-identity-read',

    sourcePath: CONTROLLED_LINUX_BOOT_ID_PATH,
    bootId,

    bootIdRead: true,

    processIncarnationVerified: false,
    readinessGranted: false,
    livenessGranted: false,
    runtimeAuthorityGranted: false,
    networkAuthorityGranted: false,
  })
}
