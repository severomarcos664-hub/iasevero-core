import type {
  EnterpriseCognitiveMemoryRecord,
} from './runtime-enterprise-cognitive-memory-repository'

export type GovernedMemoryUtilityRecommendation =
  | 'retain'
  | 'demote'
  | 'consolidate'
  | 'expire'
  | 'revoke'
  | 'dispute'

export type GovernedMemoryUtilityExternalSignals = {
  operationalUtility?: number
  redundancyScore?: number
  conflictDetected?: boolean
  sourceInvalidated?: boolean
}

export type GovernedMemoryUtilitySignal = {
  name:
    | 'status'
    | 'authority'
    | 'confidence'
    | 'recency'
    | 'temporal-validity'
    | 'provenance'
    | 'operational-utility'
    | 'redundancy'
    | 'conflict'
    | 'source-validity'
  available: boolean
  value: string | number | boolean | null
  contribution: number
  reasoning: string
}

export type GovernedMemoryUtilityAssessmentInput = {
  memory: EnterpriseCognitiveMemoryRecord
  evaluatedAt: string
  externalSignals?: GovernedMemoryUtilityExternalSignals
}

export type GovernedMemoryUtilityAssessment = {
  assessmentVersion: 1
  assessmentId: string
  tenantId: string
  userId: string
  memoryId: string
  evaluatedAt: string
  utilityScore: number
  recommendation: GovernedMemoryUtilityRecommendation
  signals: GovernedMemoryUtilitySignal[]
  evidence: string[]
  reasoning: string[]
  mutationApplied: false
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(value)))
}

function assertIsoDate(value: string, field: string): number {
  const timestamp = Date.parse(value)

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${field} must be a valid ISO date.`)
  }

  return timestamp
}

function calculateRecencyContribution(
  observedAtTimestamp: number,
  evaluatedAtTimestamp: number,
): {
  contribution: number
  ageDays: number
  reasoning: string
} {
  const elapsedMilliseconds = Math.max(
    0,
    evaluatedAtTimestamp - observedAtTimestamp,
  )

  const ageDays = Math.floor(
    elapsedMilliseconds / (24 * 60 * 60 * 1000),
  )

  if (ageDays <= 7) {
    return {
      contribution: 10,
      ageDays,
      reasoning: 'Memory was observed within the last seven days.',
    }
  }

  if (ageDays <= 30) {
    return {
      contribution: 5,
      ageDays,
      reasoning: 'Memory was observed within the last thirty days.',
    }
  }

  if (ageDays <= 90) {
    return {
      contribution: 0,
      ageDays,
      reasoning: 'Memory recency is neutral.',
    }
  }

  return {
    contribution: -10,
    ageDays,
    reasoning: 'Memory has not been observed recently.',
  }
}

export function assessGovernedMemoryUtility(
  input: GovernedMemoryUtilityAssessmentInput,
): GovernedMemoryUtilityAssessment {
  const { memory, externalSignals = {} } = input

  const evaluatedAtTimestamp = assertIsoDate(
    input.evaluatedAt,
    'evaluatedAt',
  )

  const observedAtTimestamp = assertIsoDate(
    memory.observedAt,
    'memory.observedAt',
  )

  const authority = clampScore(memory.sourceAuthority)
  const confidence = clampScore(memory.confidence)

  const authorityContribution = Math.round(
    (authority - 50) * 0.2,
  )

  const confidenceContribution = Math.round(
    (confidence - 50) * 0.2,
  )

  const recency = calculateRecencyContribution(
    observedAtTimestamp,
    evaluatedAtTimestamp,
  )

  const provenanceComplete =
    Array.isArray(memory.sourceEventIds) &&
    memory.sourceEventIds.length > 0

  const validUntilTimestamp = memory.validUntil
    ? assertIsoDate(memory.validUntil, 'memory.validUntil')
    : undefined

  const temporallyExpired =
    validUntilTimestamp !== undefined &&
    validUntilTimestamp <= evaluatedAtTimestamp

  const operationalUtilityAvailable =
    externalSignals.operationalUtility !== undefined

  const operationalUtility = operationalUtilityAvailable
    ? clampScore(externalSignals.operationalUtility ?? 0)
    : 0

  const operationalUtilityContribution =
    operationalUtilityAvailable
      ? Math.round((operationalUtility - 50) * 0.2)
      : 0

  const redundancyAvailable =
    externalSignals.redundancyScore !== undefined

  const redundancyScore = redundancyAvailable
    ? clampScore(externalSignals.redundancyScore ?? 0)
    : 0

  const conflictAvailable =
    externalSignals.conflictDetected !== undefined

  const sourceValidityAvailable =
    externalSignals.sourceInvalidated !== undefined

  const signals: GovernedMemoryUtilitySignal[] = [
    {
      name: 'status',
      available: true,
      value: memory.status,
      contribution:
        memory.status === 'active'
          ? 5
          : memory.status === 'candidate'
            ? 0
            : -10,
      reasoning: `Current governed memory status is ${memory.status}.`,
    },
    {
      name: 'authority',
      available: true,
      value: authority,
      contribution: authorityContribution,
      reasoning: `Source authority contributes ${authorityContribution} points.`,
    },
    {
      name: 'confidence',
      available: true,
      value: confidence,
      contribution: confidenceContribution,
      reasoning: `Memory confidence contributes ${confidenceContribution} points.`,
    },
    {
      name: 'recency',
      available: true,
      value: recency.ageDays,
      contribution: recency.contribution,
      reasoning: recency.reasoning,
    },
    {
      name: 'temporal-validity',
      available: memory.validUntil !== undefined,
      value: memory.validUntil ?? null,
      contribution: temporallyExpired ? -50 : 0,
      reasoning: memory.validUntil
        ? temporallyExpired
          ? 'Memory temporal validity has ended.'
          : 'Memory remains temporally valid.'
        : 'No explicit temporal expiration is instrumented.',
    },
    {
      name: 'provenance',
      available: true,
      value: memory.sourceEventIds.length,
      contribution: provenanceComplete ? 10 : -10,
      reasoning: provenanceComplete
        ? 'Memory preserves source-event provenance.'
        : 'Memory has no source-event provenance.',
    },
    {
      name: 'operational-utility',
      available: operationalUtilityAvailable,
      value: operationalUtilityAvailable
        ? operationalUtility
        : null,
      contribution: operationalUtilityContribution,
      reasoning: operationalUtilityAvailable
        ? `Observed operational utility contributes ${operationalUtilityContribution} points.`
        : 'Operational utility telemetry is not instrumented for this assessment.',
    },
    {
      name: 'redundancy',
      available: redundancyAvailable,
      value: redundancyAvailable
        ? redundancyScore
        : null,
      contribution: 0,
      reasoning: redundancyAvailable
        ? `Observed redundancy score is ${redundancyScore}.`
        : 'Redundancy evidence was not supplied.',
    },
    {
      name: 'conflict',
      available: conflictAvailable,
      value: conflictAvailable
        ? Boolean(externalSignals.conflictDetected)
        : null,
      contribution:
        externalSignals.conflictDetected === true
          ? -25
          : 0,
      reasoning: conflictAvailable
        ? externalSignals.conflictDetected
          ? 'A governed conflict signal is present.'
          : 'No governed conflict signal is present.'
        : 'Conflict evidence was not supplied.',
    },
    {
      name: 'source-validity',
      available: sourceValidityAvailable,
      value: sourceValidityAvailable
        ? Boolean(externalSignals.sourceInvalidated)
        : null,
      contribution:
        externalSignals.sourceInvalidated === true
          ? -50
          : 0,
      reasoning: sourceValidityAvailable
        ? externalSignals.sourceInvalidated
          ? 'The source has been explicitly invalidated.'
          : 'The source remains valid.'
        : 'Source invalidation evidence was not supplied.',
    },
  ]

  const utilityScore = clampScore(
    50 +
      signals.reduce(
        (total, signal) => total + signal.contribution,
        0,
      ),
  )

  let recommendation: GovernedMemoryUtilityRecommendation

  if (
    memory.status === 'revoked' ||
    externalSignals.sourceInvalidated === true
  ) {
    recommendation = 'revoke'
  } else if (
    memory.status === 'expired' ||
    temporallyExpired
  ) {
    recommendation = 'expire'
  } else if (
    memory.status === 'disputed' ||
    externalSignals.conflictDetected === true
  ) {
    recommendation = 'dispute'
  } else if (
    redundancyAvailable &&
    redundancyScore >= 70
  ) {
    recommendation = 'consolidate'
  } else if (
    memory.status === 'superseded' ||
    utilityScore < 40
  ) {
    recommendation = 'demote'
  } else {
    recommendation = 'retain'
  }

  const evidence = signals
    .filter((signal) => signal.available)
    .map(
      (signal) =>
        `${signal.name}:${String(signal.value)}:${signal.contribution}`,
    )

  const reasoning = signals
    .filter(
      (signal) =>
        signal.available &&
        (
          signal.contribution !== 0 ||
          signal.name === 'status' ||
          signal.name === 'temporal-validity'
        ),
    )
    .map((signal) => signal.reasoning)

  return {
    assessmentVersion: 1,
    assessmentId: [
      'memory-utility',
      memory.tenantId,
      memory.userId,
      memory.memoryId,
      input.evaluatedAt,
    ].join(':'),
    tenantId: memory.tenantId,
    userId: memory.userId,
    memoryId: memory.memoryId,
    evaluatedAt: input.evaluatedAt,
    utilityScore,
    recommendation,
    signals,
    evidence,
    reasoning,
    mutationApplied: false,
  }
}
