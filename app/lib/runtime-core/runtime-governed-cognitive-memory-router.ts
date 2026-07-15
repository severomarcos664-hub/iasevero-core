import {
  readRuntimeMemoryEvents,
  type RuntimeMemoryEvent,
} from '@/app/lib/orchestrator/runtime-operational-memory'
import {
  evaluateRuntimeMemoryConsolidation,
} from '@/app/lib/runtime-memory-consolidation/runtime-memory-consolidation'

export type GovernedMemoryAuthority =
  | 'governance'
  | 'decision'
  | 'operational'
  | 'informational'

export type GovernedMemoryCandidate = {
  event: RuntimeMemoryEvent
  authority: GovernedMemoryAuthority
  scores: {
    relevance: number
    authority: number
    confidence: number
    recency: number
    risk: number
    total: number
  }
  conflictKey: string | null
  conflictValue: string | null
}

export type GovernedMemorySelection = GovernedMemoryCandidate & {
  selectionReason: string
}

export type GovernedMemoryRejection = GovernedMemoryCandidate & {
  rejectionReason:
    | 'low-relevance'
    | 'high-risk'
    | 'superseded-by-authority'
    | 'selection-limit'
}

export type GovernedMemoryConflict = {
  key: string
  values: string[]
  eventIds: string[]
  winnerEventId: string
  resolution: 'authority-precedence'
}

export type GovernedCognitiveMemoryRouterReport = {
  routerId: string
  createdAt: string
  source: 'runtime-governed-cognitive-memory-router'
  query: string
  memoryState: ReturnType<
    typeof evaluateRuntimeMemoryConsolidation
  >['memoryState']
  selected: GovernedMemorySelection[]
  rejected: GovernedMemoryRejection[]
  conflicts: GovernedMemoryConflict[]
  aggregateConfidence: number
  grounded: boolean
  reasoning: string[]
}

const clamp = (value: number): number =>
  Math.max(0, Math.min(100, Math.round(value)))

const normalizeTokens = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3)

const unique = <T>(values: T[]): T[] => [...new Set(values)]

const calculateRelevance = (
  query: string,
  event: RuntimeMemoryEvent,
): number => {
  const queryTokens = unique(normalizeTokens(query))

  if (queryTokens.length === 0) {
    return 0
  }

  const eventText = [
    event.type,
    event.message,
    event.source ?? '',
    JSON.stringify(event.payload ?? {}),
  ].join(' ')

  const eventTokens = new Set(normalizeTokens(eventText))
  const matched = queryTokens.filter((token) =>
    eventTokens.has(token),
  ).length

  const coverage = matched / queryTokens.length
  const density =
    matched / Math.max(eventTokens.size, queryTokens.length)

  return clamp(coverage * 80 + density * 20)
}

const resolveAuthority = (
  event: RuntimeMemoryEvent,
): {
  level: GovernedMemoryAuthority
  score: number
} => {
  const source = `${event.source ?? ''} ${event.type}`.toLowerCase()

  if (
    source.includes('governance') ||
    source.includes('policy') ||
    source.includes('authority')
  ) {
    return {
      level: 'governance',
      score: 100,
    }
  }

  if (
    source.includes('decision') ||
    source.includes('executive')
  ) {
    return {
      level: 'decision',
      score: 88,
    }
  }

  if (
    source.includes('runtime') ||
    source.includes('execution') ||
    source.includes('operational')
  ) {
    return {
      level: 'operational',
      score: 76,
    }
  }

  return {
    level: 'informational',
    score: 55,
  }
}

const calculateRecency = (timestamp: string): number => {
  const createdAt = Date.parse(timestamp)

  if (!Number.isFinite(createdAt)) {
    return 40
  }

  const ageHours = Math.max(
    0,
    (Date.now() - createdAt) / 3_600_000,
  )

  if (ageHours <= 1) return 100
  if (ageHours <= 24) return 90
  if (ageHours <= 168) return 75
  if (ageHours <= 720) return 55

  return 35
}

const calculateRisk = (
  severity: RuntimeMemoryEvent['severity'],
): number => {
  if (severity === 'high') return 75
  if (severity === 'medium') return 40
  return 15
}

const calculateConfidence = (
  event: RuntimeMemoryEvent,
  consolidation: ReturnType<
    typeof evaluateRuntimeMemoryConsolidation
  >,
): number => {
  const severityConfidence =
    event.severity === 'high'
      ? 88
      : event.severity === 'medium'
        ? 76
        : 65

  const consolidationConfidence =
    consolidation.memoryStrength * 0.45 +
    consolidation.adaptationScore * 0.3 +
    consolidation.consensusRatio * 0.25

  return clamp(
    severityConfidence * 0.4 +
      consolidationConfidence * 0.6,
  )
}

const readConflictDescriptor = (
  event: RuntimeMemoryEvent,
): {
  key: string | null
  value: string | null
} => {
  const payload = event.payload ?? {}

  const keyCandidate =
    payload.subject ??
    payload.key ??
    payload.topic ??
    payload.rule ??
    null

  const valueCandidate =
    payload.value ??
    payload.state ??
    payload.decision ??
    payload.allowed ??
    null

  return {
    key:
      typeof keyCandidate === 'string'
        ? keyCandidate.trim().toLowerCase()
        : null,
    value:
      typeof valueCandidate === 'string' ||
      typeof valueCandidate === 'number' ||
      typeof valueCandidate === 'boolean'
        ? String(valueCandidate).trim().toLowerCase()
        : null,
  }
}

const buildCandidate = (
  query: string,
  event: RuntimeMemoryEvent,
  consolidation: ReturnType<
    typeof evaluateRuntimeMemoryConsolidation
  >,
): GovernedMemoryCandidate => {
  const authority = resolveAuthority(event)
  const relevance = calculateRelevance(query, event)
  const confidence = calculateConfidence(event, consolidation)
  const recency = calculateRecency(event.timestamp)
  const risk = calculateRisk(event.severity)
  const conflict = readConflictDescriptor(event)

  const total = clamp(
    relevance * 0.38 +
      authority.score * 0.24 +
      confidence * 0.2 +
      recency * 0.13 -
      risk * 0.05,
  )

  return {
    event,
    authority: authority.level,
    scores: {
      relevance,
      authority: authority.score,
      confidence,
      recency,
      risk,
      total,
    },
    conflictKey: conflict.key,
    conflictValue: conflict.value,
  }
}

export function routeGovernedCognitiveMemory(input: {
  query: string
  maxSelected?: number
}): GovernedCognitiveMemoryRouterReport {
  const query = input.query.trim()

  if (!query) {
    throw new Error(
      'Governed Cognitive Memory Router requires a non-empty query.',
    )
  }

  const maxSelected = Math.max(
    1,
    Math.min(input.maxSelected ?? 5, 12),
  )

  const consolidation =
    evaluateRuntimeMemoryConsolidation()

  const candidates = readRuntimeMemoryEvents()
    .map((event) =>
      buildCandidate(query, event, consolidation),
    )
    .sort(
      (left, right) =>
        right.scores.total - left.scores.total ||
        right.scores.authority - left.scores.authority ||
        right.scores.recency - left.scores.recency,
    )

  const conflictGroups = new Map<
    string,
    GovernedMemoryCandidate[]
  >()

  for (const candidate of candidates) {
    if (
      !candidate.conflictKey ||
      candidate.conflictValue === null
    ) {
      continue
    }

    const group =
      conflictGroups.get(candidate.conflictKey) ?? []

    group.push(candidate)
    conflictGroups.set(candidate.conflictKey, group)
  }

  const supersededIds = new Set<string>()
  const conflicts: GovernedMemoryConflict[] = []

  for (const [key, group] of conflictGroups) {
    const values = unique(
      group
        .map((candidate) => candidate.conflictValue)
        .filter((value): value is string => value !== null),
    )

    if (values.length < 2) {
      continue
    }

    const ranked = [...group].sort(
      (left, right) =>
        right.scores.authority - left.scores.authority ||
        right.scores.confidence - left.scores.confidence ||
        right.scores.recency - left.scores.recency,
    )

    const winner = ranked[0]

    for (const candidate of ranked.slice(1)) {
      supersededIds.add(candidate.event.id)
    }

    conflicts.push({
      key,
      values,
      eventIds: ranked.map(
        (candidate) => candidate.event.id,
      ),
      winnerEventId: winner.event.id,
      resolution: 'authority-precedence',
    })
  }

  const selected: GovernedMemorySelection[] = []
  const rejected: GovernedMemoryRejection[] = []

  for (const candidate of candidates) {
    if (supersededIds.has(candidate.event.id)) {
      rejected.push({
        ...candidate,
        rejectionReason: 'superseded-by-authority',
      })
      continue
    }

    if (candidate.scores.relevance < 25) {
      rejected.push({
        ...candidate,
        rejectionReason: 'low-relevance',
      })
      continue
    }

    if (
      candidate.scores.risk >= 70 &&
      candidate.scores.authority < 85
    ) {
      rejected.push({
        ...candidate,
        rejectionReason: 'high-risk',
      })
      continue
    }

    if (selected.length >= maxSelected) {
      rejected.push({
        ...candidate,
        rejectionReason: 'selection-limit',
      })
      continue
    }

    selected.push({
      ...candidate,
      selectionReason:
        `${candidate.authority} authority; ` +
        `relevance=${candidate.scores.relevance}; ` +
        `confidence=${candidate.scores.confidence}; ` +
        `total=${candidate.scores.total}`,
    })
  }

  const aggregateConfidence =
    selected.length === 0
      ? 0
      : clamp(
          selected.reduce(
            (total, candidate) =>
              total + candidate.scores.confidence,
            0,
          ) / selected.length,
        )

  const grounded =
    selected.length > 0 &&
    aggregateConfidence >= 60 &&
    consolidation.memoryState !== 'restricted'

  return {
    routerId: `memory-router-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'runtime-governed-cognitive-memory-router',
    query,
    memoryState: consolidation.memoryState,
    selected,
    rejected,
    conflicts,
    aggregateConfidence,
    grounded,
    reasoning: [
      `events:${candidates.length}`,
      `selected:${selected.length}`,
      `rejected:${rejected.length}`,
      `conflicts:${conflicts.length}`,
      `memoryState:${consolidation.memoryState}`,
      `aggregateConfidence:${aggregateConfidence}`,
      `grounded:${grounded}`,
    ],
  }
}
