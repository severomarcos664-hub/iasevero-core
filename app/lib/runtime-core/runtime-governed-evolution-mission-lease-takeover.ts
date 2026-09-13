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

import type {
  GovernedEvolutionMissionLeaseStalenessAssessment,
} from './runtime-governed-evolution-mission-lease-staleness-assessment'

export type GovernedEvolutionMissionLeaseTakeoverInput = {
  newRunnerId: string
  leaseDurationMs: number
  now?: string
}

export type GovernedEvolutionMissionLeaseTakeover = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-lease-takeover'

  missionId: string

  previousRunnerId: string
  previousLeaseId: string
  previousLeaseSequence: number

  runnerId: string
  leaseId: string
  leaseSequence: number
  takeoverSequence: number

  takeoverAt: string
  expiresAt: string

  expiredAssessmentVerified: true
  currentLeaseRevalidated: true
  ownershipTransferApplied: true

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
      `Governed evolution mission lease takeover requires non-empty ${field}.`,
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

/*
 * Deliberately shared with lease renewal.
 * Renewal and takeover must serialize through
 * the same exclusive lease-mutation boundary.
 */
function leaseMutationLockPath(
  repositoryDir: string,
  missionId: string,
): string {
  return join(
    repositoryDir,
    `${missionDigest(missionId)}.lease.renew.lock`,
  )
}

export function takeoverGovernedEvolutionMissionLease(
  repositoryDir: string,
  assessment: GovernedEvolutionMissionLeaseStalenessAssessment,
  input: GovernedEvolutionMissionLeaseTakeoverInput,
): GovernedEvolutionMissionLeaseTakeover {
  assertNonEmpty(assessment.missionId, 'missionId')
  assertNonEmpty(input.newRunnerId, 'newRunnerId')

  if (
    assessment.leaseVerified !== true ||
    assessment.temporalAssessmentCompleted !== true ||
    assessment.temporalStatus !== 'expired' ||
    assessment.leaseExpired !== true
  ) {
    throw new Error(
      'Governed evolution mission lease takeover requires verified expired lease evidence.',
    )
  }

  if (
    assessment.ownershipTransferAuthorized !== false ||
    assessment.executionAuthorized !== false ||
    assessment.networkAuthorityGranted !== false ||
    assessment.sandboxAuthorityGranted !== false ||
    assessment.productionMutationAllowed !== false ||
    assessment.selfPromotionAllowed !== false
  ) {
    throw new Error(
      'Governed evolution mission lease takeover requires zero inherited operational authority.',
    )
  }

  if (
    !Number.isSafeInteger(input.leaseDurationMs) ||
    input.leaseDurationMs <= 0
  ) {
    throw new Error(
      'Governed evolution mission lease takeover requires positive leaseDurationMs.',
    )
  }

  const takeoverAt =
    input.now ?? new Date().toISOString()

  const takeoverAtMs =
    new Date(takeoverAt).getTime()

  if (!Number.isFinite(takeoverAtMs)) {
    throw new Error(
      'Governed evolution mission lease takeover requires valid takeover time.',
    )
  }

  const lockPath =
    leaseMutationLockPath(
      repositoryDir,
      assessment.missionId,
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
          'Governed evolution mission lease takeover is blocked by concurrent lease mutation.',
        )
      }

      throw error
    }

    const current =
      readGovernedEvolutionMissionLease(
        repositoryDir,
        assessment.missionId,
      )

    if (!current) {
      throw new Error(
        'Governed evolution mission lease takeover requires current canonical lease.',
      )
    }

    if (
      current.missionId !== assessment.missionId ||
      current.runnerId !== assessment.runnerId ||
      current.leaseId !== assessment.leaseId ||
      current.leaseSequence !== assessment.leaseSequence ||
      current.expiresAt !== assessment.expiresAt
    ) {
      throw new Error(
        'Governed evolution mission lease takeover requires unchanged expired lease identity.',
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
        'Governed evolution mission lease takeover requires zero current operational authority.',
      )
    }

    const currentExpiresAtMs =
      new Date(current.expiresAt).getTime()

    if (
      !Number.isFinite(currentExpiresAtMs) ||
      takeoverAtMs < currentExpiresAtMs
    ) {
      throw new Error(
        'Governed evolution mission lease takeover requires lease to remain expired under exclusive revalidation.',
      )
    }

    if (input.newRunnerId === current.runnerId) {
      throw new Error(
        'Governed evolution mission lease takeover requires a distinct recovery runner.',
      )
    }

    const takeoverSequence =
      (current.takeoverSequence ?? 0) + 1

    const replacement:
      GovernedEvolutionMissionLease = {
        schemaVersion: 1,
        kind:
          'iasevero-governed-evolution-mission-lease',

        missionId: current.missionId,
        runnerId: input.newRunnerId,
        leaseId: randomUUID(),

        acquiredAt: takeoverAt,
        expiresAt: new Date(
          takeoverAtMs +
          input.leaseDurationMs,
        ).toISOString(),

        leaseSequence:
          current.leaseSequence + 1,

        previousLeaseId:
          current.leaseId,
        previousRunnerId:
          current.runnerId,
        takeoverSequence,

        leaseAcquired: true,

        executionAuthorized: false,
        networkAuthorityGranted: false,
        sandboxAuthorityGranted: false,
        productionMutationAllowed: false,
        selfPromotionAllowed: false,
      }

    const filePath =
      leaseFilePath(
        repositoryDir,
        current.missionId,
      )

    temporaryPath =
      `${filePath}.${process.pid}.${randomUUID()}.tmp`

    writeFileSync(
      temporaryPath,
      `${JSON.stringify(replacement, null, 2)}\n`,
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
        'iasevero-governed-evolution-mission-lease-takeover',

      missionId: replacement.missionId,

      previousRunnerId:
        current.runnerId,
      previousLeaseId:
        current.leaseId,
      previousLeaseSequence:
        current.leaseSequence,

      runnerId:
        replacement.runnerId,
      leaseId:
        replacement.leaseId,
      leaseSequence:
        replacement.leaseSequence,
      takeoverSequence,

      takeoverAt,
      expiresAt:
        replacement.expiresAt,

      expiredAssessmentVerified: true,
      currentLeaseRevalidated: true,
      ownershipTransferApplied: true,

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
        // Stale mutation-lock recovery is separate.
      }
    }
  }
}
