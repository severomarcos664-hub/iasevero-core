import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { join } from 'node:path'

export type GovernedEvolutionMissionLease = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-lease'

  missionId: string
  runnerId: string
  leaseId: string

  acquiredAt: string
  expiresAt: string
  leaseSequence: 1

  leaseAcquired: true

  executionAuthorized: false
  networkAuthorityGranted: false
  sandboxAuthorityGranted: false
  productionMutationAllowed: false
  selfPromotionAllowed: false
}

export type GovernedEvolutionMissionLeaseAcquisition =
  | {
      acquired: true
      lease: GovernedEvolutionMissionLease
      reason: 'lease-acquired'
    }
  | {
      acquired: false
      lease: GovernedEvolutionMissionLease
      reason: 'mission-already-leased'
    }

export type AcquireGovernedEvolutionMissionLeaseInput = {
  missionId: string
  runnerId: string
  leaseDurationMs: number
  now?: string
}

function assertNonEmpty(
  value: string,
  field: string,
): void {
  if (value.trim().length === 0) {
    throw new Error(
      `Governed evolution mission lease requires non-empty ${field}.`,
    )
  }
}

function leaseFileName(
  missionId: string,
): string {
  return `${createHash('sha256')
    .update(missionId)
    .digest('hex')}.lease.json`
}

function leasePath(
  repositoryDir: string,
  missionId: string,
): string {
  return join(
    repositoryDir,
    leaseFileName(missionId),
  )
}

function assertCanonicalLease(
  lease: GovernedEvolutionMissionLease,
): void {
  if (
    lease.schemaVersion !== 1 ||
    lease.kind !==
      'iasevero-governed-evolution-mission-lease' ||
    lease.leaseAcquired !== true ||
    lease.leaseSequence !== 1
  ) {
    throw new Error(
      'Governed evolution mission lease requires canonical lease identity.',
    )
  }

  assertNonEmpty(lease.missionId, 'missionId')
  assertNonEmpty(lease.runnerId, 'runnerId')
  assertNonEmpty(lease.leaseId, 'leaseId')

  if (
    lease.executionAuthorized !== false ||
    lease.networkAuthorityGranted !== false ||
    lease.sandboxAuthorityGranted !== false ||
    lease.productionMutationAllowed !== false ||
    lease.selfPromotionAllowed !== false
  ) {
    throw new Error(
      'Governed evolution mission lease requires zero execution, network, mutation and promotion authority.',
    )
  }

  const acquiredAt =
    new Date(lease.acquiredAt).getTime()

  const expiresAt =
    new Date(lease.expiresAt).getTime()

  if (
    !Number.isFinite(acquiredAt) ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= acquiredAt
  ) {
    throw new Error(
      'Governed evolution mission lease requires a valid bounded lease interval.',
    )
  }
}

export function readGovernedEvolutionMissionLease(
  repositoryDir: string,
  missionId: string,
): GovernedEvolutionMissionLease | null {
  assertNonEmpty(missionId, 'missionId')

  const filePath =
    leasePath(repositoryDir, missionId)

  if (!existsSync(filePath)) {
    return null
  }

  const lease = JSON.parse(
    readFileSync(filePath, 'utf8'),
  ) as GovernedEvolutionMissionLease

  assertCanonicalLease(lease)

  if (lease.missionId !== missionId) {
    throw new Error(
      'Governed evolution mission lease requires continuous mission identity.',
    )
  }

  return lease
}

export function acquireGovernedEvolutionMissionLease(
  repositoryDir: string,
  input: AcquireGovernedEvolutionMissionLeaseInput,
): GovernedEvolutionMissionLeaseAcquisition {
  assertNonEmpty(input.missionId, 'missionId')
  assertNonEmpty(input.runnerId, 'runnerId')

  if (
    !Number.isSafeInteger(input.leaseDurationMs) ||
    input.leaseDurationMs <= 0
  ) {
    throw new Error(
      'Governed evolution mission lease requires positive integer leaseDurationMs.',
    )
  }

  mkdirSync(repositoryDir, {
    recursive: true,
  })

  const acquiredAt =
    input.now ?? new Date().toISOString()

  const acquiredAtMs =
    new Date(acquiredAt).getTime()

  if (!Number.isFinite(acquiredAtMs)) {
    throw new Error(
      'Governed evolution mission lease requires valid acquisition time.',
    )
  }

  const lease: GovernedEvolutionMissionLease = {
    schemaVersion: 1,
    kind:
      'iasevero-governed-evolution-mission-lease',

    missionId: input.missionId,
    runnerId: input.runnerId,
    leaseId: randomUUID(),

    acquiredAt,
    expiresAt: new Date(
      acquiredAtMs + input.leaseDurationMs,
    ).toISOString(),

    leaseSequence: 1,
    leaseAcquired: true,

    executionAuthorized: false,
    networkAuthorityGranted: false,
    sandboxAuthorityGranted: false,
    productionMutationAllowed: false,
    selfPromotionAllowed: false,
  }

  assertCanonicalLease(lease)

  const filePath =
    leasePath(
      repositoryDir,
      input.missionId,
    )

  let descriptor: number | null = null

  try {
    descriptor = openSync(
      filePath,
      'wx',
      0o600,
    )

    writeFileSync(
      descriptor,
      `${JSON.stringify(lease, null, 2)}\n`,
      {
        encoding: 'utf8',
      },
    )

    closeSync(descriptor)
    descriptor = null

    return {
      acquired: true,
      lease,
      reason: 'lease-acquired',
    }
  } catch (error) {
    if (descriptor !== null) {
      closeSync(descriptor)
    }

    const code =
      error instanceof Error &&
      'code' in error
        ? String(
            (error as NodeJS.ErrnoException).code,
          )
        : null

    if (code !== 'EEXIST') {
      try {
        unlinkSync(filePath)
      } catch {
        // No cleanup authority beyond an incomplete
        // lease file created by this acquisition.
      }

      throw error
    }

    const existing =
      readGovernedEvolutionMissionLease(
        repositoryDir,
        input.missionId,
      )

    if (!existing) {
      throw new Error(
        'Governed evolution mission lease contention produced no canonical existing lease.',
      )
    }

    return {
      acquired: false,
      lease: existing,
      reason: 'mission-already-leased',
    }
  }
}
