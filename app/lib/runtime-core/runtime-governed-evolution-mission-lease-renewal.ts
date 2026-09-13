import {
  closeSync,
  openSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import {
  createHash,
  randomUUID,
} from 'node:crypto'
import { join } from 'node:path'

import {
  readGovernedEvolutionMissionLease,
  type GovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease'

export type GovernedEvolutionMissionLeaseRenewalInput = {
  missionId: string
  runnerId: string
  leaseId: string
  expectedLeaseSequence: number
  leaseDurationMs: number
  now?: string
}

export type GovernedEvolutionMissionLeaseRenewal = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-lease-renewal'

  missionId: string
  runnerId: string
  leaseId: string

  previousLeaseSequence: number
  leaseSequence: number

  heartbeatAt: string
  previousExpiresAt: string
  expiresAt: string

  leaseOwnershipVerified: true
  leaseFreshnessVerified: true
  leaseRenewalApplied: true

  executionAuthorized: false
  networkAuthorityGranted: false
  sandboxAuthorityGranted: false
  productionMutationAllowed: false
  selfPromotionAllowed: false
}

function assertNonEmpty(
  value: string,
  field: string,
): void {
  if (value.trim().length === 0) {
    throw new Error(
      `Governed evolution mission lease renewal requires non-empty ${field}.`,
    )
  }
}

function missionDigest(
  missionId: string,
): string {
  return createHash('sha256')
    .update(missionId)
    .digest('hex')
}

function leaseFilePath(
  repositoryDir: string,
  missionId: string,
): string {
  return join(
    repositoryDir,
    `${missionDigest(missionId)}.lease.json`,
  )
}

function renewalLockPath(
  repositoryDir: string,
  missionId: string,
): string {
  return join(
    repositoryDir,
    `${missionDigest(missionId)}.lease.renew.lock`,
  )
}

export function renewGovernedEvolutionMissionLease(
  repositoryDir: string,
  input: GovernedEvolutionMissionLeaseRenewalInput,
): GovernedEvolutionMissionLeaseRenewal {
  assertNonEmpty(input.missionId, 'missionId')
  assertNonEmpty(input.runnerId, 'runnerId')
  assertNonEmpty(input.leaseId, 'leaseId')

  if (
    !Number.isSafeInteger(input.expectedLeaseSequence) ||
    input.expectedLeaseSequence <= 0
  ) {
    throw new Error(
      'Governed evolution mission lease renewal requires positive expectedLeaseSequence.',
    )
  }

  if (
    !Number.isSafeInteger(input.leaseDurationMs) ||
    input.leaseDurationMs <= 0
  ) {
    throw new Error(
      'Governed evolution mission lease renewal requires positive leaseDurationMs.',
    )
  }

  const heartbeatAt =
    input.now ?? new Date().toISOString()

  const heartbeatAtMs =
    new Date(heartbeatAt).getTime()

  if (!Number.isFinite(heartbeatAtMs)) {
    throw new Error(
      'Governed evolution mission lease renewal requires valid heartbeat time.',
    )
  }

  const lockPath =
    renewalLockPath(
      repositoryDir,
      input.missionId,
    )

  let lockDescriptor: number | null = null
  let lockAcquired = false
  let temporaryPath: string | null = null

  try {
    try {
      lockDescriptor = openSync(
        lockPath,
        'wx',
        0o600,
      )

      lockAcquired = true

      writeFileSync(
        lockDescriptor,
        `${JSON.stringify({
          missionId: input.missionId,
          runnerId: input.runnerId,
          leaseId: input.leaseId,
          expectedLeaseSequence:
            input.expectedLeaseSequence,
        })}\n`,
        {
          encoding: 'utf8',
        },
      )

      closeSync(lockDescriptor)
      lockDescriptor = null
    } catch (error) {
      if (lockDescriptor !== null) {
        closeSync(lockDescriptor)
        lockDescriptor = null
      }

      const code =
        error instanceof Error &&
        'code' in error
          ? String(
              (error as NodeJS.ErrnoException).code,
            )
          : null

      if (code === 'EEXIST') {
        throw new Error(
          'Governed evolution mission lease renewal is already in progress.',
        )
      }

      throw error
    }

    const current =
      readGovernedEvolutionMissionLease(
        repositoryDir,
        input.missionId,
      )

    if (!current) {
      throw new Error(
        'Governed evolution mission lease renewal requires an existing lease.',
      )
    }

    if (
      current.missionId !== input.missionId ||
      current.runnerId !== input.runnerId ||
      current.leaseId !== input.leaseId
    ) {
      throw new Error(
        'Governed evolution mission lease renewal requires continuous lease ownership.',
      )
    }

    if (
      current.leaseSequence !==
      input.expectedLeaseSequence
    ) {
      throw new Error(
        'Governed evolution mission lease renewal requires current lease sequence.',
      )
    }

    if (
      current.executionAuthorized !== false ||
      current.networkAuthorityGranted !== false ||
      current.sandboxAuthorityGranted !== false ||
      current.productionMutationAllowed !== false ||
      current.selfPromotionAllowed !== false
    ) {
      throw new Error(
        'Governed evolution mission lease renewal requires zero inherited operational authority.',
      )
    }

    const currentExpiresAtMs =
      new Date(current.expiresAt).getTime()

    if (
      !Number.isFinite(currentExpiresAtMs) ||
      heartbeatAtMs >= currentExpiresAtMs
    ) {
      throw new Error(
        'Governed evolution mission lease renewal cannot renew an expired lease.',
      )
    }

    const acquiredAtMs =
      new Date(current.acquiredAt).getTime()

    if (
      !Number.isFinite(acquiredAtMs) ||
      heartbeatAtMs < acquiredAtMs
    ) {
      throw new Error(
        'Governed evolution mission lease renewal rejects regressive heartbeat time.',
      )
    }

    const renewed: GovernedEvolutionMissionLease = {
      ...current,

      leaseSequence:
        current.leaseSequence + 1,

      expiresAt: new Date(
        heartbeatAtMs +
        input.leaseDurationMs,
      ).toISOString(),

      executionAuthorized: false,
      networkAuthorityGranted: false,
      sandboxAuthorityGranted: false,
      productionMutationAllowed: false,
      selfPromotionAllowed: false,
    }

    const filePath =
      leaseFilePath(
        repositoryDir,
        input.missionId,
      )

    temporaryPath =
      `${filePath}.${process.pid}.${randomUUID()}.tmp`

    writeFileSync(
      temporaryPath,
      `${JSON.stringify(renewed, null, 2)}\n`,
      {
        encoding: 'utf8',
        mode: 0o600,
      },
    )

    renameSync(
      temporaryPath,
      filePath,
    )

    temporaryPath = null

    return {
      schemaVersion: 1,
      kind:
        'iasevero-governed-evolution-mission-lease-renewal',

      missionId: renewed.missionId,
      runnerId: renewed.runnerId,
      leaseId: renewed.leaseId,

      previousLeaseSequence:
        current.leaseSequence,
      leaseSequence:
        renewed.leaseSequence,

      heartbeatAt,
      previousExpiresAt:
        current.expiresAt,
      expiresAt:
        renewed.expiresAt,

      leaseOwnershipVerified: true,
      leaseFreshnessVerified: true,
      leaseRenewalApplied: true,

      executionAuthorized: false,
      networkAuthorityGranted: false,
      sandboxAuthorityGranted: false,
      productionMutationAllowed: false,
      selfPromotionAllowed: false,
    }
  } finally {
    if (lockDescriptor !== null) {
      closeSync(lockDescriptor)
    }

    if (temporaryPath !== null) {
      try {
        unlinkSync(temporaryPath)
      } catch {
        // Best-effort cleanup only.
      }
    }

    if (lockAcquired) {
      try {
        unlinkSync(lockPath)
      } catch {
        // Stale-lock recovery remains a separate
        // governed responsibility.
      }
    }
  }
}
