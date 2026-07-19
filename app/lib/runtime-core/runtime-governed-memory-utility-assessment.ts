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

export type GovernedMemoryUtilityReviewDecision = {
  reviewVersion: 1
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  generatedAt: string
  assessmentIds: string[]
  assessmentCount: number
  recommendation: GovernedMemoryUtilityRecommendation
  recommendationCounts: Record<
    GovernedMemoryUtilityRecommendation,
    number
  >
  averageUtilityScore: number
  latestUtilityScore: number
  confidence: number
  stable: boolean
  divergent: boolean
  requiresReview: boolean
  reasoning: string[]
  mutationApplied: false
}

export type GovernedMemoryUtilityReviewDecisionInput = {
  assessments: GovernedMemoryUtilityAssessment[]
  generatedAt: string
}

const REVIEW_RECOMMENDATIONS:
  GovernedMemoryUtilityRecommendation[] = [
    'retain',
    'demote',
    'consolidate',
    'expire',
    'revoke',
    'dispute',
  ]

export function decideGovernedMemoryUtilityReview(
  input: GovernedMemoryUtilityReviewDecisionInput,
): GovernedMemoryUtilityReviewDecision {
  if (input.assessments.length === 0) {
    throw new Error(
      'Governed memory utility review requires at least one assessment.',
    )
  }

  assertIsoDate(input.generatedAt, 'generatedAt')

  const assessments = [...input.assessments].sort(
    (left, right) => {
      const timeDifference =
        Date.parse(left.evaluatedAt) -
        Date.parse(right.evaluatedAt)

      if (timeDifference !== 0) {
        return timeDifference
      }

      return left.assessmentId.localeCompare(
        right.assessmentId,
      )
    },
  )

  const first = assessments[0]

  if (!first) {
    throw new Error(
      'Governed memory utility review could not resolve its first assessment.',
    )
  }

  for (const assessment of assessments) {
    if (assessment.assessmentVersion !== 1) {
      throw new Error(
        'Unsupported governed memory utility assessment version.',
      )
    }

    if (assessment.mutationApplied !== false) {
      throw new Error(
        'Governed memory utility review cannot consume mutated assessments.',
      )
    }

    assertIsoDate(
      assessment.evaluatedAt,
      'assessment.evaluatedAt',
    )

    if (
      assessment.tenantId !== first.tenantId ||
      assessment.userId !== first.userId ||
      assessment.memoryId !== first.memoryId
    ) {
      throw new Error(
        'Governed memory utility review assessments must share the same scope.',
      )
    }
  }

  const recommendationCounts =
    Object.fromEntries(
      REVIEW_RECOMMENDATIONS.map(
        (recommendation) => [
          recommendation,
          0,
        ],
      ),
    ) as Record<
      GovernedMemoryUtilityRecommendation,
      number
    >

  for (const assessment of assessments) {
    recommendationCounts[
      assessment.recommendation
    ] += 1
  }

  const latestAssessment =
    assessments[assessments.length - 1]

  if (!latestAssessment) {
    throw new Error(
      'Governed memory utility review could not resolve its latest assessment.',
    )
  }

  const highestCount = Math.max(
    ...Object.values(recommendationCounts),
  )

  const tiedRecommendations =
    REVIEW_RECOMMENDATIONS.filter(
      (recommendation) =>
        recommendationCounts[recommendation] ===
        highestCount,
    )

  const recommendation =
    tiedRecommendations.includes(
      latestAssessment.recommendation,
    )
      ? latestAssessment.recommendation
      : tiedRecommendations[0]

  if (!recommendation) {
    throw new Error(
      'Governed memory utility review could not resolve a recommendation.',
    )
  }

  const totalUtilityScore = assessments.reduce(
    (total, assessment) =>
      total + assessment.utilityScore,
    0,
  )

  const averageUtilityScore = clampScore(
    totalUtilityScore / assessments.length,
  )

  const confidence = clampScore(
    (
      recommendationCounts[recommendation] /
      assessments.length
    ) * 100,
  )

  const distinctRecommendations =
    REVIEW_RECOMMENDATIONS.filter(
      (candidate) =>
        recommendationCounts[candidate] > 0,
    )

  const stable =
    assessments.length >= 2 &&
    distinctRecommendations.length === 1

  const divergent =
    distinctRecommendations.length > 1

  const requiresReview =
    recommendation !== 'retain' ||
    divergent ||
    averageUtilityScore < 60

  const assessmentIds = assessments.map(
    (assessment) => assessment.assessmentId,
  )

  const reasoning = [
    `assessment-count=${assessments.length}`,
    `recommendation=${recommendation}`,
    `recommendation-support=${recommendationCounts[recommendation]}`,
    `average-utility-score=${averageUtilityScore}`,
    `latest-utility-score=${latestAssessment.utilityScore}`,
    `stable=${stable}`,
    `divergent=${divergent}`,
    `requires-review=${requiresReview}`,
    'No memory mutation was applied.',
  ]

  return {
    reviewVersion: 1,
    decisionId: [
      'memory-utility-review',
      first.tenantId,
      first.userId,
      first.memoryId,
      ...assessmentIds,
      recommendation,
      input.generatedAt,
    ].join(':'),
    tenantId: first.tenantId,
    userId: first.userId,
    memoryId: first.memoryId,
    generatedAt: input.generatedAt,
    assessmentIds,
    assessmentCount: assessments.length,
    recommendation,
    recommendationCounts,
    averageUtilityScore,
    latestUtilityScore:
      latestAssessment.utilityScore,
    confidence,
    stable,
    divergent,
    requiresReview,
    reasoning,
    mutationApplied: false,
  }
}
