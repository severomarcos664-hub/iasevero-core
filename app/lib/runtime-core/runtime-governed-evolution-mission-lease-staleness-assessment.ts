import {
  readGovernedEvolutionMissionLease,
  type GovernedEvolutionMissionLease,
} from './runtime-governed-evolution-mission-lease'

export type GovernedEvolutionMissionLeaseTemporalStatus =
  | 'fresh'
  | 'near-expiry'
  | 'expired'

export type GovernedEvolutionMissionLeaseStalenessAssessment = {
  schemaVersion: 1
  kind: 'iasevero-governed-evolution-mission-lease-staleness-assessment'

  missionId: string
  runnerId: string
  leaseId: string
  leaseSequence: number

  observedAt: string
  acquiredAt: string
  expiresAt: string

  warningThresholdMs: number
  remainingMs: number
  ageMs: number

  leaseVerified: true
  temporalAssessmentCompleted: true

  temporalStatus: GovernedEvolutionMissionLeaseTemporalStatus
  leaseFresh: boolean
  leaseNearExpiry: boolean
  leaseExpired: boolean

  ownershipTransferAuthorized: false
  executionAuthorized: false
  networkAuthorityGranted: false
  sandboxAuthorityGranted: false
  productionMutationAllowed: false
  selfPromotionAllowed: false
}

export type AssessGovernedEvolutionMissionLeaseStalenessInput = {
  missionId: string
  warningThresholdMs: number
  now?: string
}

function assertNonEmpty(
  value: string,
  field: string,
): void {
  if (value.trim().length === 0) {
    throw new Error(
      `Governed evolution mission lease staleness assessment requires non-empty ${field}.`,
    )
  }
}

function assertZeroAuthority(
  lease: GovernedEvolutionMissionLease,
): void {
  if (
    lease.executionAuthorized !== false ||
    lease.networkAuthorityGranted !== false ||
    lease.sandboxAuthorityGranted !== false ||
    lease.productionMutationAllowed !== false ||
    lease.selfPromotionAllowed !== false
  ) {
    throw new Error(
      'Governed evolution mission lease staleness assessment requires zero inherited operational authority.',
    )
  }
}

export function assessGovernedEvolutionMissionLeaseStaleness(
  repositoryDir: string,
  input: AssessGovernedEvolutionMissionLeaseStalenessInput,
): GovernedEvolutionMissionLeaseStalenessAssessment {
  assertNonEmpty(input.missionId, 'missionId')

  if (
    !Number.isSafeInteger(input.warningThresholdMs) ||
    input.warningThresholdMs <= 0
  ) {
    throw new Error(
      'Governed evolution mission lease staleness assessment requires positive warningThresholdMs.',
    )
  }

  const lease =
    readGovernedEvolutionMissionLease(
      repositoryDir,
      input.missionId,
    )

  if (!lease) {
    throw new Error(
      'Governed evolution mission lease staleness assessment requires an existing canonical lease.',
    )
  }

  assertZeroAuthority(lease)

  const observedAt =
    input.now ?? new Date().toISOString()

  const observedAtMs =
    new Date(observedAt).getTime()

  const acquiredAtMs =
    new Date(lease.acquiredAt).getTime()

  const expiresAtMs =
    new Date(lease.expiresAt).getTime()

  if (
    !Number.isFinite(observedAtMs) ||
    !Number.isFinite(acquiredAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    expiresAtMs <= acquiredAtMs
  ) {
    throw new Error(
      'Governed evolution mission lease staleness assessment requires valid temporal evidence.',
    )
  }

  if (observedAtMs < acquiredAtMs) {
    throw new Error(
      'Governed evolution mission lease staleness assessment rejects regressive observation time.',
    )
  }

  const remainingMs =
    expiresAtMs - observedAtMs

  const ageMs =
    observedAtMs - acquiredAtMs

  const temporalStatus:
    GovernedEvolutionMissionLeaseTemporalStatus =
      remainingMs <= 0
        ? 'expired'
        : remainingMs <= input.warningThresholdMs
          ? 'near-expiry'
          : 'fresh'

  return {
    schemaVersion: 1,
    kind:
      'iasevero-governed-evolution-mission-lease-staleness-assessment',

    missionId: lease.missionId,
    runnerId: lease.runnerId,
    leaseId: lease.leaseId,
    leaseSequence: lease.leaseSequence,

    observedAt,
    acquiredAt: lease.acquiredAt,
    expiresAt: lease.expiresAt,

    warningThresholdMs:
      input.warningThresholdMs,
    remainingMs,
    ageMs,

    leaseVerified: true,
    temporalAssessmentCompleted: true,

    temporalStatus,
    leaseFresh:
      temporalStatus === 'fresh',
    leaseNearExpiry:
      temporalStatus === 'near-expiry',
    leaseExpired:
      temporalStatus === 'expired',

    ownershipTransferAuthorized: false,
    executionAuthorized: false,
    networkAuthorityGranted: false,
    sandboxAuthorityGranted: false,
    productionMutationAllowed: false,
    selfPromotionAllowed: false,
  }
}
