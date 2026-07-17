import type {
  EnterpriseCognitiveMemoryRecord,
  EnterpriseMemoryType,
  RuntimeEnterpriseCognitiveMemoryRepository,
} from './runtime-enterprise-cognitive-memory-repository'

export type HybridMemoryRetrievalInput = {
  tenantId: string
  userId: string
  query: string
  entityId?: string
  executionKey?: string
  types?: EnterpriseMemoryType[]
  limit?: number
  candidateLimit?: number
  minimumScore?: number
  now?: string
}

export type HybridMemoryRetrievalScore = {
  lexical: number
  phrase: number
  authority: number
  confidence: number
  recency: number
  scope: number
  total: number
}

export type HybridMemoryRetrievalResult = {
  memory: EnterpriseCognitiveMemoryRecord
  score: HybridMemoryRetrievalScore
  matchedTerms: string[]
  reasoning: string[]
}

export type HybridMemoryRetrievalReport = {
  source: 'runtime-hybrid-memory-retrieval'
  query: string
  tenantId: string
  userId: string
  candidateCount: number
  selectedCount: number
  rejectedCount: number
  minimumScore: number
  results: HybridMemoryRetrievalResult[]
  reasoning: string[]
}

const STOP_WORDS = new Set([
  'a',
  'ao',
  'aos',
  'as',
  'com',
  'como',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'é',
  'foi',
  'na',
  'nas',
  'no',
  'nos',
  'o',
  'os',
  'para',
  'por',
  'que',
  'se',
  'um',
  'uma',
])

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(' ')
        .filter(
          (token) =>
            token.length >= 2 &&
            !STOP_WORDS.has(token),
        ),
    ),
  )
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function calculateRecencyScore(
  observedAt: string,
  now: string,
): number {
  const observedTime = Date.parse(observedAt)
  const nowTime = Date.parse(now)

  if (
    !Number.isFinite(observedTime) ||
    !Number.isFinite(nowTime)
  ) {
    return 0
  }

  const ageDays = Math.max(
    0,
    (nowTime - observedTime) / 86_400_000,
  )

  if (ageDays <= 1) return 100
  if (ageDays <= 7) return 90
  if (ageDays <= 30) return 75
  if (ageDays <= 90) return 55
  if (ageDays <= 365) return 30

  return 10
}

function calculateScopeScore(input: {
  memory: EnterpriseCognitiveMemoryRecord
  entityId?: string
  executionKey?: string
}): number {
  let score = 50

  if (input.entityId) {
    score +=
      input.memory.entityId === input.entityId
        ? 30
        : -30
  }

  if (input.executionKey) {
    score +=
      input.memory.executionKey === input.executionKey
        ? 20
        : -20
  }

  return clampScore(score)
}

function calculateMemoryScore(input: {
  memory: EnterpriseCognitiveMemoryRecord
  normalizedQuery: string
  queryTerms: string[]
  entityId?: string
  executionKey?: string
  now: string
}): HybridMemoryRetrievalResult {
  const searchableText = normalizeText(
    [
      input.memory.content,
      input.memory.type,
      input.memory.source,
      input.memory.entityId ?? '',
      input.memory.executionKey ?? '',
      input.memory.policyTags.join(' '),
      JSON.stringify(input.memory.structuredPayload),
    ].join(' '),
  )

  const searchableTerms = new Set(
    tokenize(searchableText),
  )

  const matchedTerms = input.queryTerms.filter((term) =>
    searchableTerms.has(term),
  )

  const lexical =
    input.queryTerms.length === 0
      ? 0
      : clampScore(
          (matchedTerms.length /
            input.queryTerms.length) *
            100,
        )

  const phrase =
    input.normalizedQuery.length >= 4 &&
    searchableText.includes(input.normalizedQuery)
      ? 100
      : 0

  const authority = clampScore(
    input.memory.sourceAuthority,
  )

  const confidence = clampScore(
    input.memory.confidence,
  )

  const recency = calculateRecencyScore(
    input.memory.observedAt,
    input.now,
  )

  const scope = calculateScopeScore({
    memory: input.memory,
    entityId: input.entityId,
    executionKey: input.executionKey,
  })

  const provenanceComplete =
    input.memory.sourceEventIds.length > 0

  const provenancePenalty =
    provenanceComplete ? 0 : 8

  const total = clampScore(
    lexical * 0.35 +
      phrase * 0.15 +
      authority * 0.15 +
      confidence * 0.15 +
      recency * 0.1 +
      scope * 0.1 -
      provenancePenalty,
  )

  const reasoning = [
    `lexical=${lexical}`,
    `phrase=${phrase}`,
    `authority=${authority}`,
    `confidence=${confidence}`,
    `recency=${recency}`,
    `scope=${scope}`,
    `provenanceComplete=${provenanceComplete}`,
    `provenancePenalty=${provenancePenalty}`,
    `total=${total}`,
  ]

  return {
    memory: input.memory,
    score: {
      lexical,
      phrase,
      authority,
      confidence,
      recency,
      scope,
      total,
    },
    matchedTerms,
    reasoning,
  }
}

export function retrieveHybridEnterpriseMemories(
  repository: RuntimeEnterpriseCognitiveMemoryRepository,
  input: HybridMemoryRetrievalInput,
): HybridMemoryRetrievalReport {
  const query = input.query.trim()

  if (!query) {
    throw new Error(
      'Hybrid memory retrieval requires a non-empty query.',
    )
  }

  const normalizedQuery = normalizeText(query)
  const queryTerms = tokenize(query)
  const now = input.now ?? new Date().toISOString()
  const minimumScore = clampScore(
    input.minimumScore ?? 20,
  )
  const limit = Math.max(
    1,
    Math.min(input.limit ?? 8, 50),
  )
  const candidateLimit = Math.max(
    limit,
    Math.min(input.candidateLimit ?? 200, 500),
  )

  const candidates = repository.readActiveMemories({
    tenantId: input.tenantId,
    userId: input.userId,
    limit: candidateLimit,
    now,
    ...(input.entityId
      ? { entityId: input.entityId }
      : {}),
    ...(input.executionKey
      ? { executionKey: input.executionKey }
      : {}),
    ...(input.types?.length
      ? { types: input.types }
      : {}),
  })

  const ranked = candidates
    .map((memory) =>
      calculateMemoryScore({
        memory,
        normalizedQuery,
        queryTerms,
        entityId: input.entityId,
        executionKey: input.executionKey,
        now,
      }),
    )
    .filter(
      (result) =>
        result.score.total >= minimumScore &&
        (
          result.score.lexical > 0 ||
          result.score.phrase > 0
        ),
    )
    .sort((left, right) => {
      if (right.score.total !== left.score.total) {
        return right.score.total - left.score.total
      }

      if (
        right.memory.sourceAuthority !==
        left.memory.sourceAuthority
      ) {
        return (
          right.memory.sourceAuthority -
          left.memory.sourceAuthority
        )
      }

      if (
        right.memory.confidence !==
        left.memory.confidence
      ) {
        return (
          right.memory.confidence -
          left.memory.confidence
        )
      }

      return right.memory.observedAt.localeCompare(
        left.memory.observedAt,
      )
    })

  const results = ranked.slice(0, limit)

  return {
    source: 'runtime-hybrid-memory-retrieval',
    query,
    tenantId: input.tenantId,
    userId: input.userId,
    candidateCount: candidates.length,
    selectedCount: results.length,
    rejectedCount:
      candidates.length - results.length,
    minimumScore,
    results,
    reasoning: [
      `candidateCount=${candidates.length}`,
      `selectedCount=${results.length}`,
      `minimumScore=${minimumScore}`,
      'Ranking combines lexical relevance, phrase match, authority, confidence, recency and scope.',
      'Only active and temporally valid memories from the requested tenant and user scope were considered.',
    ],
  }
}
