import { createHash, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import type {
  GovernedMemoryUtilityAssessment,
  GovernedMemoryUtilityReviewDecision,
} from './runtime-governed-memory-utility-assessment'

type SQLiteStatement = {
  run: (...parameters: unknown[]) => unknown
  get: (...parameters: unknown[]) => unknown
  all: (...parameters: unknown[]) => unknown[]
}

type SQLiteDatabase = {
  exec: (sql: string) => void
  prepare: (sql: string) => SQLiteStatement
  close: () => void
}

type SQLiteModule = {
  DatabaseSync: new (path: string) => SQLiteDatabase
}

const { DatabaseSync } = require(
  'node:sqlite',
) as SQLiteModule

export type EnterpriseMemoryType =
  | 'working'
  | 'episodic'
  | 'semantic'
  | 'procedural'
  | 'decision'
  | 'governance'
  | 'operational'

export type EnterpriseMemoryStatus =
  | 'candidate'
  | 'active'
  | 'superseded'
  | 'disputed'
  | 'revoked'
  | 'expired'

export type EnterpriseMemoryEventType =
  | 'message'
  | 'decision'
  | 'execution'
  | 'result'
  | 'error'
  | 'feedback'
  | 'policy-change'

export type AppendEnterpriseMemoryEventInput = {
  eventId?: string
  tenantId: string
  userId: string
  executionKey: string
  eventType: EnterpriseMemoryEventType
  payload: Record<string, unknown>
  source: string
  sourceAuthority: number
  createdAt?: string
}

export type EnterpriseMemoryEventRecord = {
  eventId: string
  sequence: number
  tenantId: string
  userId: string
  executionKey: string
  eventType: EnterpriseMemoryEventType
  payload: Record<string, unknown>
  source: string
  sourceAuthority: number
  createdAt: string
  checksum: string
}

export type CreateEnterpriseCognitiveMemoryInput = {
  memoryId?: string
  tenantId: string
  userId: string
  entityId?: string
  executionKey?: string
  type: EnterpriseMemoryType
  content: string
  structuredPayload?: Record<string, unknown>
  source: string
  sourceEventIds?: string[]
  sourceAuthority: number
  confidence: number
  observedAt?: string
  validFrom?: string
  validUntil?: string
  status?: EnterpriseMemoryStatus
  retentionPolicy?: string
  policyTags?: string[]
  supersedesMemoryId?: string
}

export type TransitionEnterpriseMemoryLifecycleInput = {
  tenantId: string
  userId: string
  memoryId: string
  targetStatus: 'revoked' | 'expired'
  reason: string
  source: string
  sourceAuthority: number
  executionKey?: string
  transitionedAt?: string
}

export type EnterpriseMemoryLifecycleTransition = {
  source: 'runtime-enterprise-cognitive-memory-repository'
  memory: EnterpriseCognitiveMemoryRecord
  event: EnterpriseMemoryEventRecord
  previousStatus: EnterpriseMemoryStatus
  targetStatus: 'revoked' | 'expired'
  transitionedAt: string
}

export type EnterpriseCognitiveMemoryRecord = {
  memoryId: string
  tenantId: string
  userId: string
  entityId?: string
  executionKey?: string
  type: EnterpriseMemoryType
  content: string
  structuredPayload: Record<string, unknown>
  source: string
  sourceEventIds: string[]
  sourceAuthority: number
  confidence: number
  createdAt: string
  observedAt: string
  validFrom: string
  validUntil?: string
  updatedAt: string
  version: number
  supersedesMemoryId?: string
  status: EnterpriseMemoryStatus
  retentionPolicy: string
  policyTags: string[]
  checksum: string
}

export type EnterpriseMemoryScope = {
  tenantId: string
  userId: string
  entityId?: string
  executionKey?: string
  types?: EnterpriseMemoryType[]
  limit?: number
  now?: string
}

export type EnterpriseMemoryEventScope = {
  tenantId: string
  userId: string
  executionKey?: string
  eventTypes?: EnterpriseMemoryEventType[]
  afterSequence?: number
  limit?: number
}

type SQLiteEventRow = {
  event_id: string
  sequence: number
  tenant_id: string
  user_id: string
  execution_key: string
  event_type: EnterpriseMemoryEventType
  payload_json: string
  source: string
  source_authority: number
  created_at: string
  checksum: string
}

export type MemoryRelationGraphResolutionInput = {
  tenantId: string
  userId: string
  memoryIds: string[]
  now?: string
}

export type MemoryRelationGraphResolution = {
  source: 'runtime-enterprise-cognitive-memory-repository'
  resolvedAt: string
  tenantId: string
  userId: string
  requestedMemoryIds: string[]
  eligibleMemoryIds: string[]
  supersededMemoryIds: string[]
  supportingRelations: EnterpriseMemoryRelationRecord[]
  contradictionRelations: EnterpriseMemoryRelationRecord[]
  supersessionRelations: EnterpriseMemoryRelationRecord[]
  winnerMemoryId?: string
  unresolved: boolean
  temporalResolution?: TemporalMemoryConflictResolution
  reasoning: string[]
}

export type TemporalMemoryConflictResolutionInput = {
  tenantId: string
  userId: string
  memoryIds: string[]
  now?: string
}

export type TemporalMemoryConflictCandidate = {
  memoryId: string
  status: EnterpriseMemoryStatus
  sourceAuthority: number
  confidence: number
  version: number
  observedAt: string
  createdAt: string
  validFrom: string
  validUntil?: string
  temporallyValid: boolean
  eligible: boolean
  score: number
  rejectionReason?: string
}

export type TemporalMemoryConflictResolution = {
  source: 'runtime-enterprise-cognitive-memory-repository'
  resolvedAt: string
  tenantId: string
  userId: string
  winnerMemoryId?: string
  unresolved: boolean
  candidates: TemporalMemoryConflictCandidate[]
  reasoning: string[]
}

export type EnterpriseMemoryRelationType =
  | 'supports'
  | 'contradicts'
  | 'supersedes'

export type EnterpriseMemoryRelationRecord = {
  relationId: string
  tenantId: string
  userId: string
  sourceMemoryId: string
  targetMemoryId: string
  relationType: EnterpriseMemoryRelationType
  source: string
  sourceAuthority: number
  confidence: number
  reason: string
  createdAt: string
  checksum: string
}

export type AppendEnterpriseMemoryRelationInput = {
  relationId?: string
  tenantId: string
  userId: string
  sourceMemoryId: string
  targetMemoryId: string
  relationType: EnterpriseMemoryRelationType
  source: string
  sourceAuthority: number
  confidence: number
  reason: string
  createdAt?: string
}

export type EnterpriseMemoryRelationScope = {
  tenantId: string
  userId: string
  sourceMemoryId?: string
  targetMemoryId?: string
  relationTypes?: EnterpriseMemoryRelationType[]
  limit?: number
}

type SQLiteMemoryRelationRow = {
  relation_id: string
  tenant_id: string
  user_id: string
  source_memory_id: string
  target_memory_id: string
  relation_type: string
  source: string
  source_authority: number
  confidence: number
  reason: string
  created_at: string
  checksum: string
}

type SQLiteMemoryRow = {
  memory_id: string
  tenant_id: string
  user_id: string
  entity_id: string | null
  execution_key: string | null
  memory_type: EnterpriseMemoryType
  content: string
  structured_payload_json: string
  source: string
  source_event_ids_json: string
  source_authority: number
  confidence: number
  created_at: string
  observed_at: string
  valid_from: string
  valid_until: string | null
  updated_at: string
  version: number
  supersedes_memory_id: string | null
  status: EnterpriseMemoryStatus
  retention_policy: string
  policy_tags_json: string
  checksum: string
}

const MEMORY_TYPES: readonly EnterpriseMemoryType[] = [
  'working',
  'episodic',
  'semantic',
  'procedural',
  'decision',
  'governance',
  'operational',
]

const MEMORY_STATUSES: readonly EnterpriseMemoryStatus[] = [
  'candidate',
  'active',
  'superseded',
  'disputed',
  'revoked',
  'expired',
]

function assertNonEmpty(value: string, field: string): string {
  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`${field} must be a non-empty string.`)
  }

  return normalized
}

function assertScore(value: number, field: string): number {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${field} must be between 0 and 100.`)
  }

  return Math.round(value)
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([key, child]) =>
        `${JSON.stringify(key)}:${stableSerialize(child)}`,
    )

  return `{${entries.join(',')}}`
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(stableSerialize(value))
    .digest('hex')
}

function parseJsonRecord(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value)

  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error('Stored JSON payload is not an object.')
  }

  return parsed as Record<string, unknown>
}

function parseJsonStringArray(value: string): string[] {
  const parsed: unknown = JSON.parse(value)

  if (
    !Array.isArray(parsed) ||
    !parsed.every((item) => typeof item === 'string')
  ) {
    throw new Error('Stored JSON payload is not a string array.')
  }

  return parsed
}

function mapEventRow(
  row: SQLiteEventRow,
): EnterpriseMemoryEventRecord {
  return {
    eventId: row.event_id,
    sequence: row.sequence,
    tenantId: row.tenant_id,
    userId: row.user_id,
    executionKey: row.execution_key,
    eventType: row.event_type,
    payload: parseJsonRecord(row.payload_json),
    source: row.source,
    sourceAuthority: row.source_authority,
    createdAt: row.created_at,
    checksum: row.checksum,
  }
}

function mapMemoryRelationRow(
  row: SQLiteMemoryRelationRow,
): EnterpriseMemoryRelationRecord {
  if (
    row.relation_type !== 'supports' &&
    row.relation_type !== 'contradicts' &&
    row.relation_type !== 'supersedes'
  ) {
    throw new Error(
      `Unsupported memory relation type: ${row.relation_type}`,
    )
  }

  return {
    relationId: row.relation_id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    sourceMemoryId: row.source_memory_id,
    targetMemoryId: row.target_memory_id,
    relationType: row.relation_type,
    source: row.source,
    sourceAuthority: row.source_authority,
    confidence: row.confidence,
    reason: row.reason,
    createdAt: row.created_at,
    checksum: row.checksum,
  }
}

function mapMemoryRow(
  row: SQLiteMemoryRow,
): EnterpriseCognitiveMemoryRecord {
  return {
    memoryId: row.memory_id,
    tenantId: row.tenant_id,
    userId: row.user_id,
    entityId: row.entity_id ?? undefined,
    executionKey: row.execution_key ?? undefined,
    type: row.memory_type,
    content: row.content,
    structuredPayload: parseJsonRecord(
      row.structured_payload_json,
    ),
    source: row.source,
    sourceEventIds: parseJsonStringArray(
      row.source_event_ids_json,
    ),
    sourceAuthority: row.source_authority,
    confidence: row.confidence,
    createdAt: row.created_at,
    observedAt: row.observed_at,
    validFrom: row.valid_from,
    validUntil: row.valid_until ?? undefined,
    updatedAt: row.updated_at,
    version: row.version,
    supersedesMemoryId:
      row.supersedes_memory_id ?? undefined,
    status: row.status,
    retentionPolicy: row.retention_policy,
    policyTags: parseJsonStringArray(row.policy_tags_json),
    checksum: row.checksum,
  }
}


export type GovernedMemoryRedundancyRelationship =
  | 'duplicate'
  | 'near-duplicate'
  | 'overlapping'
  | 'independent'

export type GovernedMemoryRedundancyCanonicalRecommendation = {
  relationType: Extract<
    EnterpriseMemoryRelationType,
    'supports' | 'supersedes'
  >
  sourceMemoryId: string
  targetMemoryId: string
  reason: string
}

export type GovernedMemoryRedundancyDetectionInput = {
  leftMemory: EnterpriseCognitiveMemoryRecord
  rightMemory: EnterpriseCognitiveMemoryRecord
}

export type GovernedMemoryRedundancyDetectionResult = {
  detectionVersion: 1
  detectionId: string
  tenantId: string
  userId: string
  memoryIds: [string, string]
  redundancyScore: number
  relationship: GovernedMemoryRedundancyRelationship
  sharedEvidence: string[]
  differences: string[]
  consolidationRecommended: boolean
  recommendedCanonicalRelation?:
    GovernedMemoryRedundancyCanonicalRecommendation
  mutationApplied: false
}

function normalizeMemoryRelationText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenizeMemoryRelationText(value: string): string[] {
  return Array.from(
    new Set(
      normalizeMemoryRelationText(value)
        .split(' ')
        .filter((token) => token.length > 2),
    ),
  ).sort()
}

function calculateSetOverlap(
  leftValues: string[],
  rightValues: string[],
): {
  shared: string[]
  unionSize: number
  ratio: number
} {
  const leftSet = new Set(leftValues)
  const rightSet = new Set(rightValues)

  const shared = Array.from(leftSet)
    .filter((value) => rightSet.has(value))
    .sort()

  const unionSize = new Set([
    ...leftValues,
    ...rightValues,
  ]).size

  return {
    shared,
    unionSize,
    ratio:
      unionSize === 0
        ? 0
        : shared.length / unionSize,
  }
}

function clampRedundancyScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  )
}

export function detectGovernedMemoryRedundancy(
  input: GovernedMemoryRedundancyDetectionInput,
): GovernedMemoryRedundancyDetectionResult {
  const { leftMemory, rightMemory } = input

  if (
    leftMemory.tenantId !== rightMemory.tenantId ||
    leftMemory.userId !== rightMemory.userId
  ) {
    throw new Error(
      'Memory redundancy detection requires the same tenant and user scope.',
    )
  }

  if (leftMemory.memoryId === rightMemory.memoryId) {
    throw new Error(
      'Memory redundancy detection requires two distinct memory records.',
    )
  }

  const orderedMemories = [
    leftMemory,
    rightMemory,
  ].sort((left, right) =>
    left.memoryId.localeCompare(right.memoryId),
  )

  const [firstMemory, secondMemory] =
    orderedMemories as [
      EnterpriseCognitiveMemoryRecord,
      EnterpriseCognitiveMemoryRecord,
    ]

  const leftNormalizedContent =
    normalizeMemoryRelationText(leftMemory.content)

  const rightNormalizedContent =
    normalizeMemoryRelationText(rightMemory.content)

  const exactContentMatch =
    leftNormalizedContent.length > 0 &&
    leftNormalizedContent === rightNormalizedContent

  const tokenOverlap = calculateSetOverlap(
    tokenizeMemoryRelationText(leftMemory.content),
    tokenizeMemoryRelationText(rightMemory.content),
  )

  const eventOverlap = calculateSetOverlap(
    leftMemory.sourceEventIds,
    rightMemory.sourceEventIds,
  )

  const sameType =
    leftMemory.type === rightMemory.type

  const sameEntity =
    Boolean(leftMemory.entityId) &&
    leftMemory.entityId === rightMemory.entityId

  const sameExecution =
    Boolean(leftMemory.executionKey) &&
    leftMemory.executionKey === rightMemory.executionKey

  const sameStructuredPayload =
    JSON.stringify(leftMemory.structuredPayload) ===
    JSON.stringify(rightMemory.structuredPayload)

  const contentContribution = exactContentMatch
    ? 70
    : Math.round(tokenOverlap.ratio * 55)

  const eventContribution =
    Math.round(eventOverlap.ratio * 15)

  const typeContribution = sameType ? 10 : 0
  const entityContribution = sameEntity ? 10 : 0
  const executionContribution = sameExecution ? 5 : 0
  const payloadContribution = sameStructuredPayload ? 10 : 0

  const redundancyScore = clampRedundancyScore(
    contentContribution +
      eventContribution +
      typeContribution +
      entityContribution +
      executionContribution +
      payloadContribution,
  )

  let relationship:
    GovernedMemoryRedundancyRelationship

  if (
    exactContentMatch &&
    redundancyScore >= 90
  ) {
    relationship = 'duplicate'
  } else if (redundancyScore >= 70) {
    relationship = 'near-duplicate'
  } else if (redundancyScore >= 40) {
    relationship = 'overlapping'
  } else {
    relationship = 'independent'
  }

  const sharedEvidence: string[] = []

  if (exactContentMatch) {
    sharedEvidence.push('normalized-content:exact-match')
  } else if (tokenOverlap.shared.length > 0) {
    sharedEvidence.push(
      `shared-tokens:${tokenOverlap.shared.join(',')}`,
    )
  }

  if (eventOverlap.shared.length > 0) {
    sharedEvidence.push(
      `shared-source-events:${eventOverlap.shared.join(',')}`,
    )
  }

  if (sameType) {
    sharedEvidence.push(`same-type:${leftMemory.type}`)
  }

  if (sameEntity) {
    sharedEvidence.push(
      `same-entity:${String(leftMemory.entityId)}`,
    )
  }

  if (sameExecution) {
    sharedEvidence.push(
      `same-execution:${String(leftMemory.executionKey)}`,
    )
  }

  if (sameStructuredPayload) {
    sharedEvidence.push('structured-payload:exact-match')
  }

  const differences: string[] = []

  if (!exactContentMatch) {
    differences.push('content:not-exact')
  }

  if (!sameType) {
    differences.push(
      `type:${leftMemory.type}!=${rightMemory.type}`,
    )
  }

  if (!sameEntity) {
    differences.push('entity:not-shared')
  }

  if (!sameExecution) {
    differences.push('execution:not-shared')
  }

  if (!sameStructuredPayload) {
    differences.push('structured-payload:not-exact')
  }

  const consolidationRecommended =
    relationship === 'duplicate' ||
    relationship === 'near-duplicate'

  let recommendedCanonicalRelation:
    GovernedMemoryRedundancyCanonicalRecommendation
    | undefined

  if (consolidationRecommended) {
    const newerMemory =
      leftMemory.version > rightMemory.version
        ? leftMemory
        : rightMemory.version > leftMemory.version
          ? rightMemory
          : Date.parse(leftMemory.updatedAt) >=
              Date.parse(rightMemory.updatedAt)
            ? leftMemory
            : rightMemory

    const olderMemory =
      newerMemory.memoryId === leftMemory.memoryId
        ? rightMemory
        : leftMemory

    recommendedCanonicalRelation =
      relationship === 'duplicate' &&
      newerMemory.version > olderMemory.version
        ? {
            relationType: 'supersedes',
            sourceMemoryId: newerMemory.memoryId,
            targetMemoryId: olderMemory.memoryId,
            reason:
              'A newer version duplicates the older memory within the same governed scope.',
          }
        : {
            relationType: 'supports',
            sourceMemoryId: firstMemory.memoryId,
            targetMemoryId: secondMemory.memoryId,
            reason:
              'The memories contain strongly overlapping governed evidence.',
          }
  }

  return {
    detectionVersion: 1,
    detectionId: [
      'memory-redundancy',
      leftMemory.tenantId,
      leftMemory.userId,
      firstMemory.memoryId,
      secondMemory.memoryId,
    ].join(':'),
    tenantId: leftMemory.tenantId,
    userId: leftMemory.userId,
    memoryIds: [
      firstMemory.memoryId,
      secondMemory.memoryId,
    ],
    redundancyScore,
    relationship,
    sharedEvidence,
    differences,
    consolidationRecommended,
    recommendedCanonicalRelation,
    mutationApplied: false,
  }
}


export type AppendGovernedMemoryUtilityAssessmentInput = {
  assessment: GovernedMemoryUtilityAssessment
  createdAt?: string
}

export type GovernedMemoryUtilityAssessmentHistoryScope = {
  tenantId: string
  userId: string
  memoryId?: string
  limit?: number
}


export type GovernedMemoryReviewRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled'

export type GovernedMemoryReviewEventType =
  | 'review-requested'
  | 'review-accepted'
  | 'review-rejected'
  | 'review-cancelled'

export type GovernedMemoryReviewRequest = {
  workflowVersion: 1
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  recommendation:
    GovernedMemoryUtilityReviewDecision['recommendation']
  status: GovernedMemoryReviewRequestStatus
  createdAt: string
  source: string
  sourceAuthority: number
  mutationApplied: false
}

export type GovernedMemoryReviewEvent = {
  workflowVersion: 1
  eventId: string
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  eventType: GovernedMemoryReviewEventType
  resultingStatus: GovernedMemoryReviewRequestStatus
  actorId: string
  source: string
  sourceAuthority: number
  reason: string
  createdAt: string
  mutationApplied: false
}

export type CreateGovernedMemoryReviewRequestInput = {
  decision: GovernedMemoryUtilityReviewDecision
  requestId?: string
  createdAt?: string
  source: string
  sourceAuthority: number
}

export type TransitionGovernedMemoryReviewRequestInput = {
  eventId?: string
  tenantId: string
  userId: string
  requestId: string
  targetStatus: Exclude<
    GovernedMemoryReviewRequestStatus,
    'pending'
  >
  actorId: string
  source: string
  sourceAuthority: number
  reason?: string
  createdAt?: string
}

export type GovernedMemoryReviewRequestScope = {
  tenantId: string
  userId: string
  requestId: string
}

export type GovernedMemoryReviewHistoryScope = {
  tenantId: string
  userId: string
  requestId: string
  limit?: number
}


export type GovernedMemoryActionAuthorizationStatus =
  | 'pending'
  | 'authorized'
  | 'denied'
  | 'expired'
  | 'cancelled'

export type GovernedMemoryActionAuthorizationEventType =
  | 'authorization-requested'
  | 'authorization-authorized'
  | 'authorization-denied'
  | 'authorization-expired'
  | 'authorization-cancelled'

export type GovernedMemoryActionAuthorization = {
  workflowVersion: 1
  authorizationId: string
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  proposedAction: string
  status: GovernedMemoryActionAuthorizationStatus
  createdAt: string
  actorId: string
  source: string
  sourceAuthority: number
  executionApplied: false
  mutationApplied: false
}

export type GovernedMemoryActionAuthorizationEvent = {
  workflowVersion: 1
  eventId: string
  authorizationId: string
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  eventType: GovernedMemoryActionAuthorizationEventType
  resultingStatus: GovernedMemoryActionAuthorizationStatus
  actorId: string
  source: string
  sourceAuthority: number
  reason: string
  createdAt: string
  executionApplied: false
  mutationApplied: false
}

export type CreateGovernedMemoryActionAuthorizationInput = {
  reviewRequest: GovernedMemoryReviewRequest
  authorizationId: string
  proposedAction: string
  actorId: string
  source: string
  sourceAuthority: number
  createdAt?: string
}

export type TransitionGovernedMemoryActionAuthorizationInput = {
  eventId: string
  authorizationId: string
  tenantId: string
  userId: string
  targetStatus: Exclude<
    GovernedMemoryActionAuthorizationStatus,
    'pending'
  >
  actorId: string
  source: string
  sourceAuthority: number
  reason: string
  createdAt?: string
}

export type GovernedMemoryActionAuthorizationScope = {
  tenantId: string
  userId: string
  authorizationId: string
}

export type GovernedMemoryActionAuthorizationHistoryScope = {
  tenantId: string
  userId: string
  authorizationId: string
  limit?: number
}

export type GovernedMemoryActionExecutionStatus =
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled'

export type GovernedMemoryActionExecutionEventType =
  | 'execution-requested'
  | 'execution-started'
  | 'execution-succeeded'
  | 'execution-failed'
  | 'execution-cancelled'

export type GovernedMemoryActionExecution = {
  workflowVersion: 1
  executionId: string
  authorizationId: string
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  proposedAction: string
  executionKey: string
  status: GovernedMemoryActionExecutionStatus
  createdAt: string
  actorId: string
  source: string
  sourceAuthority: number
  executionApplied: boolean
  mutationApplied: boolean
}

export type GovernedMemoryActionExecutionEvent = {
  workflowVersion: 1
  eventId: string
  executionId: string
  authorizationId: string
  requestId: string
  decisionId: string
  tenantId: string
  userId: string
  memoryId: string
  eventType: GovernedMemoryActionExecutionEventType
  resultingStatus: GovernedMemoryActionExecutionStatus
  actorId: string
  source: string
  sourceAuthority: number
  reason: string
  result: Record<string, unknown> | null
  error: string | null
  createdAt: string
  executionApplied: boolean
  mutationApplied: boolean
}

export type CreateGovernedMemoryActionExecutionInput = {
  authorization: GovernedMemoryActionAuthorization
  executionId: string
  executionKey: string
  actorId: string
  source: string
  sourceAuthority: number
  createdAt?: string
}

export type TransitionGovernedMemoryActionExecutionInput = {
  eventId?: string
  executionId: string
  tenantId: string
  userId: string
  targetStatus: Exclude<
    GovernedMemoryActionExecutionStatus,
    'pending'
  >
  actorId: string
  source: string
  sourceAuthority: number
  reason?: string
  result?: Record<string, unknown>
  error?: string
  executionApplied?: boolean
  mutationApplied?: boolean
  createdAt?: string
}

export type GovernedMemoryActionExecutionScope = {
  tenantId: string
  userId: string
  executionId: string
}

export type GovernedMemoryActionExecutionHistoryScope = {
  tenantId: string
  userId: string
  executionId: string
  limit?: number
}


export type GovernedMemoryEndToEndAuditScope = {
  tenantId: string
  userId: string
  requestId: string
  authorizationId: string
  executionId: string
  limit?: number
}

export type GovernedMemoryEndToEndAuditStage =
  | 'assessment'
  | 'review'
  | 'authorization'
  | 'execution'

export type GovernedMemoryEndToEndAuditTimelineEntry = {
  stage: GovernedMemoryEndToEndAuditStage
  eventId: string
  eventType: string
  resultingStatus: string | null
  createdAt: string
}

export type GovernedMemoryEndToEndAuditReport = {
  workflowVersion: 1
  tenantId: string
  userId: string
  memoryId: string
  decisionId: string
  requestId: string
  authorizationId: string
  executionId: string
  assessmentCount: number
  reviewEventCount: number
  authorizationEventCount: number
  executionEventCount: number
  totalEventCount: number
  stagesPresent: {
    assessment: boolean
    review: boolean
    authorization: boolean
    execution: boolean
  }
  terminalStates: {
    review: string
    authorization: string
    execution: string
  }
  timeline: GovernedMemoryEndToEndAuditTimelineEntry[]
  violations: string[]
  chainComplete: boolean
  integrityValid: boolean
  executionApplied: boolean
  mutationApplied: boolean
}

export class RuntimeEnterpriseCognitiveMemoryRepository {
  private readonly database: SQLiteDatabase

  constructor(databasePath: string) {
    const normalizedPath = assertNonEmpty(
      databasePath,
      'databasePath',
    )

    if (normalizedPath !== ':memory:') {
      mkdirSync(dirname(normalizedPath), {
        recursive: true,
      })
    }

    this.database = new DatabaseSync(normalizedPath)

    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;
      PRAGMA synchronous = NORMAL;
    `)

    this.initializeSchema()
  }

  private initializeSchema(): void {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS enterprise_memory_schema (
        schema_key TEXT PRIMARY KEY,
        schema_value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      INSERT INTO enterprise_memory_schema (
        schema_key,
        schema_value,
        updated_at
      )
      VALUES (
        'schema_version',
        '1',
        CURRENT_TIMESTAMP
      )
      ON CONFLICT(schema_key) DO NOTHING;


      CREATE TABLE IF NOT EXISTS enterprise_memory_utility_assessments (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id TEXT NOT NULL UNIQUE,
        assessment_version INTEGER NOT NULL CHECK (
          assessment_version = 1
        ),
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        evaluated_at TEXT NOT NULL,
        utility_score INTEGER NOT NULL CHECK (
          utility_score BETWEEN 0 AND 100
        ),
        recommendation TEXT NOT NULL CHECK (
          recommendation IN (
            'retain',
            'demote',
            'consolidate',
            'expire',
            'revoke',
            'dispute'
          )
        ),
        mutation_applied INTEGER NOT NULL CHECK (
          mutation_applied = 0
        ),
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (memory_id)
          REFERENCES enterprise_cognitive_memories(memory_id)
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_utility_assessments_scope
      ON enterprise_memory_utility_assessments (
        tenant_id,
        user_id,
        memory_id,
        sequence
      );

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_utility_assessment_update
      BEFORE UPDATE ON enterprise_memory_utility_assessments
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory utility assessments are append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_utility_assessment_delete
      BEFORE DELETE ON enterprise_memory_utility_assessments
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory utility assessments are append-only'
        );
      END;


      CREATE TABLE IF NOT EXISTS
        enterprise_memory_review_requests (
          sequence INTEGER PRIMARY KEY AUTOINCREMENT,
          request_id TEXT NOT NULL UNIQUE,
          decision_id TEXT NOT NULL UNIQUE,
          tenant_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          memory_id TEXT NOT NULL,
          recommendation TEXT NOT NULL CHECK (
            recommendation IN (
              'retain',
              'demote',
              'consolidate',
              'expire',
              'revoke',
              'dispute'
            )
          ),
          decision_json TEXT NOT NULL,
          source TEXT NOT NULL,
          source_authority INTEGER NOT NULL CHECK (
            source_authority BETWEEN 0 AND 100
          ),
          mutation_applied INTEGER NOT NULL CHECK (
            mutation_applied = 0
          ),
          created_at TEXT NOT NULL,
          FOREIGN KEY (memory_id)
            REFERENCES enterprise_cognitive_memories(memory_id)
        );

      CREATE UNIQUE INDEX IF NOT EXISTS
        idx_enterprise_memory_review_requests_decision
      ON enterprise_memory_review_requests (
        tenant_id,
        user_id,
        decision_id
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_review_requests_scope
      ON enterprise_memory_review_requests (
        tenant_id,
        user_id,
        memory_id,
        sequence
      );

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_review_request_update
      BEFORE UPDATE ON enterprise_memory_review_requests
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory review requests are append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_review_request_delete
      BEFORE DELETE ON enterprise_memory_review_requests
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory review requests are append-only'
        );
      END;

      CREATE TABLE IF NOT EXISTS
        enterprise_memory_review_events (
          sequence INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id TEXT NOT NULL UNIQUE,
          request_id TEXT NOT NULL,
          decision_id TEXT NOT NULL,
          tenant_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          memory_id TEXT NOT NULL,
          event_type TEXT NOT NULL CHECK (
            event_type IN (
              'review-requested',
              'review-accepted',
              'review-rejected',
              'review-cancelled'
            )
          ),
          resulting_status TEXT NOT NULL CHECK (
            resulting_status IN (
              'pending',
              'accepted',
              'rejected',
              'cancelled'
            )
          ),
          actor_id TEXT NOT NULL,
          source TEXT NOT NULL,
          source_authority INTEGER NOT NULL CHECK (
            source_authority BETWEEN 0 AND 100
          ),
          reason TEXT NOT NULL,
          mutation_applied INTEGER NOT NULL CHECK (
            mutation_applied = 0
          ),
          payload_json TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (request_id)
            REFERENCES enterprise_memory_review_requests(request_id),
          FOREIGN KEY (memory_id)
            REFERENCES enterprise_cognitive_memories(memory_id)
        );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_review_events_scope
      ON enterprise_memory_review_events (
        tenant_id,
        user_id,
        request_id,
        sequence
      );

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_review_event_update
      BEFORE UPDATE ON enterprise_memory_review_events
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory review events are append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_review_event_delete
      BEFORE DELETE ON enterprise_memory_review_events
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory review events are append-only'
        );
      END;

    CREATE TABLE IF NOT EXISTS
      enterprise_memory_action_authorizations (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        authorization_id TEXT NOT NULL UNIQUE,
        request_id TEXT NOT NULL UNIQUE,
        decision_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        proposed_action TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        source TEXT NOT NULL,
        source_authority INTEGER NOT NULL CHECK (
          source_authority BETWEEN 0 AND 100
        ),
        execution_applied INTEGER NOT NULL CHECK (
          execution_applied = 0
        ),
        mutation_applied INTEGER NOT NULL CHECK (
          mutation_applied = 0
        ),
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (request_id)
          REFERENCES enterprise_memory_review_requests(request_id),
        FOREIGN KEY (memory_id)
          REFERENCES enterprise_cognitive_memories(memory_id)
      );

    CREATE UNIQUE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_authorizations_request
    ON enterprise_memory_action_authorizations (
      tenant_id,
      user_id,
      request_id
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_authorizations_scope
    ON enterprise_memory_action_authorizations (
      tenant_id,
      user_id,
      memory_id,
      sequence
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_authorizations_decision
    ON enterprise_memory_action_authorizations (
      tenant_id,
      user_id,
      decision_id
    );

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_authorization_update
    BEFORE UPDATE ON enterprise_memory_action_authorizations
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action authorizations are append-only'
      );
    END;

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_authorization_delete
    BEFORE DELETE ON enterprise_memory_action_authorizations
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action authorizations are append-only'
      );
    END;

    CREATE TABLE IF NOT EXISTS
      enterprise_memory_action_authorization_events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        authorization_id TEXT NOT NULL,
        request_id TEXT NOT NULL,
        decision_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        event_type TEXT NOT NULL CHECK (
          event_type IN (
            'authorization-requested',
            'authorization-authorized',
            'authorization-denied',
            'authorization-expired',
            'authorization-cancelled'
          )
        ),
        resulting_status TEXT NOT NULL CHECK (
          resulting_status IN (
            'pending',
            'authorized',
            'denied',
            'expired',
            'cancelled'
          )
        ),
        actor_id TEXT NOT NULL,
        source TEXT NOT NULL,
        source_authority INTEGER NOT NULL CHECK (
          source_authority BETWEEN 0 AND 100
        ),
        reason TEXT NOT NULL,
        execution_applied INTEGER NOT NULL CHECK (
          execution_applied = 0
        ),
        mutation_applied INTEGER NOT NULL CHECK (
          mutation_applied = 0
        ),
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (authorization_id)
          REFERENCES enterprise_memory_action_authorizations(
            authorization_id
          ),
        FOREIGN KEY (request_id)
          REFERENCES enterprise_memory_review_requests(request_id),
        FOREIGN KEY (memory_id)
          REFERENCES enterprise_cognitive_memories(memory_id)
      );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_authorization_events_scope
    ON enterprise_memory_action_authorization_events (
      tenant_id,
      user_id,
      authorization_id,
      sequence
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_authorization_events_request
    ON enterprise_memory_action_authorization_events (
      tenant_id,
      user_id,
      request_id,
      sequence
    );

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_authorization_event_update
    BEFORE UPDATE ON enterprise_memory_action_authorization_events
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action authorization events are append-only'
      );
    END;

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_authorization_event_delete
    BEFORE DELETE ON enterprise_memory_action_authorization_events
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action authorization events are append-only'
      );
    END;


    CREATE TABLE IF NOT EXISTS
      enterprise_memory_action_executions (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        execution_id TEXT NOT NULL UNIQUE,
        authorization_id TEXT NOT NULL UNIQUE,
        request_id TEXT NOT NULL,
        decision_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        proposed_action TEXT NOT NULL,
        execution_key TEXT NOT NULL UNIQUE,
        actor_id TEXT NOT NULL,
        source TEXT NOT NULL,
        source_authority INTEGER NOT NULL CHECK (
          source_authority BETWEEN 0 AND 100
        ),
        execution_applied INTEGER NOT NULL CHECK (
          execution_applied = 0
        ),
        mutation_applied INTEGER NOT NULL CHECK (
          mutation_applied = 0
        ),
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (authorization_id)
          REFERENCES enterprise_memory_action_authorizations(
            authorization_id
          ),
        FOREIGN KEY (request_id)
          REFERENCES enterprise_memory_review_requests(request_id),
        FOREIGN KEY (memory_id)
          REFERENCES enterprise_cognitive_memories(memory_id)
      );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_executions_scope
    ON enterprise_memory_action_executions (
      tenant_id,
      user_id,
      execution_id
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_executions_request
    ON enterprise_memory_action_executions (
      tenant_id,
      user_id,
      request_id,
      sequence
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_executions_decision
    ON enterprise_memory_action_executions (
      tenant_id,
      user_id,
      decision_id,
      sequence
    );

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_execution_update
    BEFORE UPDATE ON enterprise_memory_action_executions
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action executions are append-only'
      );
    END;

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_execution_delete
    BEFORE DELETE ON enterprise_memory_action_executions
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action executions are append-only'
      );
    END;

    CREATE TABLE IF NOT EXISTS
      enterprise_memory_action_execution_events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        execution_id TEXT NOT NULL,
        authorization_id TEXT NOT NULL,
        request_id TEXT NOT NULL,
        decision_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        event_type TEXT NOT NULL CHECK (
          event_type IN (
            'execution-requested',
            'execution-started',
            'execution-succeeded',
            'execution-failed',
            'execution-cancelled'
          )
        ),
        resulting_status TEXT NOT NULL CHECK (
          resulting_status IN (
            'pending',
            'running',
            'succeeded',
            'failed',
            'cancelled'
          )
        ),
        actor_id TEXT NOT NULL,
        source TEXT NOT NULL,
        source_authority INTEGER NOT NULL CHECK (
          source_authority BETWEEN 0 AND 100
        ),
        reason TEXT NOT NULL,
        result_json TEXT,
        error_text TEXT,
        execution_applied INTEGER NOT NULL CHECK (
          execution_applied IN (0, 1)
        ),
        mutation_applied INTEGER NOT NULL CHECK (
          mutation_applied IN (0, 1)
        ),
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,

        CHECK (
          execution_applied = 0
          OR resulting_status = 'succeeded'
        ),

        CHECK (
          mutation_applied = 0
          OR execution_applied = 1
        ),

        CHECK (
          resulting_status != 'failed'
          OR length(trim(error_text)) > 0
        ),

        FOREIGN KEY (execution_id)
          REFERENCES enterprise_memory_action_executions(execution_id),
        FOREIGN KEY (authorization_id)
          REFERENCES enterprise_memory_action_authorizations(
            authorization_id
          ),
        FOREIGN KEY (request_id)
          REFERENCES enterprise_memory_review_requests(request_id),
        FOREIGN KEY (memory_id)
          REFERENCES enterprise_cognitive_memories(memory_id)
      );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_execution_events_scope
    ON enterprise_memory_action_execution_events (
      tenant_id,
      user_id,
      execution_id,
      sequence
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_execution_events_authorization
    ON enterprise_memory_action_execution_events (
      tenant_id,
      user_id,
      authorization_id,
      sequence
    );

    CREATE INDEX IF NOT EXISTS
      idx_enterprise_memory_action_execution_events_request
    ON enterprise_memory_action_execution_events (
      tenant_id,
      user_id,
      request_id,
      sequence
    );

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_execution_event_update
    BEFORE UPDATE ON enterprise_memory_action_execution_events
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action execution events are append-only'
      );
    END;

    CREATE TRIGGER IF NOT EXISTS
      prevent_enterprise_memory_action_execution_event_delete
    BEFORE DELETE ON enterprise_memory_action_execution_events
    BEGIN
      SELECT RAISE(
        ABORT,
        'enterprise memory action execution events are append-only'
      );
    END;

      CREATE TABLE IF NOT EXISTS enterprise_memory_events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL UNIQUE,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        execution_key TEXT NOT NULL,
        event_type TEXT NOT NULL CHECK (
          event_type IN (
            'message',
            'decision',
            'execution',
            'result',
            'error',
            'feedback',
            'policy-change'
          )
        ),
        payload_json TEXT NOT NULL,
        source TEXT NOT NULL,
        source_authority INTEGER NOT NULL CHECK (
          source_authority BETWEEN 0 AND 100
        ),
        created_at TEXT NOT NULL,
        checksum TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_events_scope
      ON enterprise_memory_events (
        tenant_id,
        user_id,
        execution_key,
        sequence
      );

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_event_update
      BEFORE UPDATE ON enterprise_memory_events
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory events are append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_event_delete
      BEFORE DELETE ON enterprise_memory_events
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory events are append-only'
        );
      END;

      CREATE TABLE IF NOT EXISTS
        enterprise_cognitive_memories (
          memory_id TEXT PRIMARY KEY,
          tenant_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          entity_id TEXT,
          execution_key TEXT,
          memory_type TEXT NOT NULL CHECK (
            memory_type IN (
              'working',
              'episodic',
              'semantic',
              'procedural',
              'decision',
              'governance',
              'operational'
            )
          ),
          content TEXT NOT NULL,
          structured_payload_json TEXT NOT NULL,
          source TEXT NOT NULL,
          source_event_ids_json TEXT NOT NULL,
          source_authority INTEGER NOT NULL CHECK (
            source_authority BETWEEN 0 AND 100
          ),
          confidence INTEGER NOT NULL CHECK (
            confidence BETWEEN 0 AND 100
          ),
          created_at TEXT NOT NULL,
          observed_at TEXT NOT NULL,
          valid_from TEXT NOT NULL,
          valid_until TEXT,
          updated_at TEXT NOT NULL,
          version INTEGER NOT NULL CHECK (version >= 1),
          supersedes_memory_id TEXT,
          status TEXT NOT NULL CHECK (
            status IN (
              'candidate',
              'active',
              'superseded',
              'disputed',
              'revoked',
              'expired'
            )
          ),
          retention_policy TEXT NOT NULL,
          policy_tags_json TEXT NOT NULL,
          checksum TEXT NOT NULL,
          FOREIGN KEY (supersedes_memory_id)
            REFERENCES enterprise_cognitive_memories(memory_id)
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memories_active_scope
      ON enterprise_cognitive_memories (
        tenant_id,
        user_id,
        status,
        valid_from,
        valid_until
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memories_entity
      ON enterprise_cognitive_memories (
        tenant_id,
        user_id,
        entity_id,
        status
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memories_execution
      ON enterprise_cognitive_memories (
        tenant_id,
        user_id,
        execution_key,
        status
      );

      CREATE TABLE IF NOT EXISTS
        enterprise_memory_relations (
          relation_id TEXT PRIMARY KEY,
          tenant_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          source_memory_id TEXT NOT NULL,
          target_memory_id TEXT NOT NULL,
          relation_type TEXT NOT NULL CHECK (
            relation_type IN (
              'supports',
              'contradicts',
              'supersedes'
            )
          ),
          source TEXT NOT NULL,
          source_authority INTEGER NOT NULL CHECK (
            source_authority BETWEEN 0 AND 100
          ),
          confidence INTEGER NOT NULL CHECK (
            confidence BETWEEN 0 AND 100
          ),
          reason TEXT NOT NULL,
          created_at TEXT NOT NULL,
          checksum TEXT NOT NULL,
          FOREIGN KEY (source_memory_id)
            REFERENCES enterprise_cognitive_memories(memory_id),
          FOREIGN KEY (target_memory_id)
            REFERENCES enterprise_cognitive_memories(memory_id),
          CHECK (source_memory_id <> target_memory_id)
        );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_relations_source
      ON enterprise_memory_relations (
        tenant_id,
        user_id,
        source_memory_id,
        relation_type,
        created_at
      );

      CREATE INDEX IF NOT EXISTS
        idx_enterprise_memory_relations_target
      ON enterprise_memory_relations (
        tenant_id,
        user_id,
        target_memory_id,
        relation_type,
        created_at
      );

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_relation_update
      BEFORE UPDATE ON enterprise_memory_relations
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory relations are append-only'
        );
      END;

      CREATE TRIGGER IF NOT EXISTS
        prevent_enterprise_memory_relation_delete
      BEFORE DELETE ON enterprise_memory_relations
      BEGIN
        SELECT RAISE(
          ABORT,
          'enterprise memory relations are append-only'
        );
      END;
    `)
  }

  appendEvent(
    input: AppendEnterpriseMemoryEventInput,
  ): EnterpriseMemoryEventRecord {
    const eventId = input.eventId ?? randomUUID()
    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )
    const userId = assertNonEmpty(input.userId, 'userId')
    const executionKey = assertNonEmpty(
      input.executionKey,
      'executionKey',
    )
    const source = assertNonEmpty(input.source, 'source')
    const createdAt =
      input.createdAt ?? new Date().toISOString()
    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const checksum = sha256({
      eventId,
      tenantId,
      userId,
      executionKey,
      eventType: input.eventType,
      payload: input.payload,
      source,
      sourceAuthority,
      createdAt,
    })

    this.database
      .prepare(`
        INSERT INTO enterprise_memory_events (
          event_id,
          tenant_id,
          user_id,
          execution_key,
          event_type,
          payload_json,
          source,
          source_authority,
          created_at,
          checksum
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        eventId,
        tenantId,
        userId,
        executionKey,
        input.eventType,
        stableSerialize(input.payload),
        source,
        sourceAuthority,
        createdAt,
        checksum,
      )

    const row = this.database
      .prepare(`
        SELECT *
        FROM enterprise_memory_events
        WHERE event_id = ?
      `)
      .get(eventId) as SQLiteEventRow | undefined

    if (!row) {
      throw new Error('Persisted enterprise event not found.')
    }

    return mapEventRow(row)
  }

  createMemory(
    input: CreateEnterpriseCognitiveMemoryInput,
  ): EnterpriseCognitiveMemoryRecord {
    if (!MEMORY_TYPES.includes(input.type)) {
      throw new Error(`Unsupported memory type: ${input.type}`)
    }

    const status = input.status ?? 'candidate'

    if (!MEMORY_STATUSES.includes(status)) {
      throw new Error(`Unsupported memory status: ${status}`)
    }

    const memoryId = input.memoryId ?? randomUUID()
    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )
    const userId = assertNonEmpty(input.userId, 'userId')
    const content = assertNonEmpty(input.content, 'content')
    const source = assertNonEmpty(input.source, 'source')
    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )
    const confidence = assertScore(
      input.confidence,
      'confidence',
    )
    const now = new Date().toISOString()
    const observedAt = input.observedAt ?? now
    const validFrom = input.validFrom ?? observedAt
    const structuredPayload =
      input.structuredPayload ?? {}
    const sourceEventIds = input.sourceEventIds ?? []
    const policyTags = input.policyTags ?? []
    const retentionPolicy =
      input.retentionPolicy ?? 'standard'

    let version = 1

    if (input.supersedesMemoryId) {
      const previous = this.database
        .prepare(`
          SELECT *
          FROM enterprise_cognitive_memories
          WHERE memory_id = ?
            AND tenant_id = ?
            AND user_id = ?
        `)
        .get(
          input.supersedesMemoryId,
          tenantId,
          userId,
        ) as SQLiteMemoryRow | undefined

      if (!previous) {
        throw new Error(
          'Memory selected for supersession was not found in the same scope.',
        )
      }

      version = previous.version + 1
    }

    const checksum = sha256({
      memoryId,
      tenantId,
      userId,
      entityId: input.entityId,
      executionKey: input.executionKey,
      type: input.type,
      content,
      structuredPayload,
      source,
      sourceEventIds,
      sourceAuthority,
      confidence,
      createdAt: now,
      observedAt,
      validFrom,
      validUntil: input.validUntil,
      version,
      supersedesMemoryId: input.supersedesMemoryId,
      retentionPolicy,
      policyTags,
    })

    this.database.exec('BEGIN IMMEDIATE')

    try {
      if (input.supersedesMemoryId) {
        this.database
          .prepare(`
            UPDATE enterprise_cognitive_memories
            SET
              status = 'superseded',
              updated_at = ?
            WHERE memory_id = ?
              AND tenant_id = ?
              AND user_id = ?
              AND status IN (
                'candidate',
                'active',
                'disputed'
              )
          `)
          .run(
            now,
            input.supersedesMemoryId,
            tenantId,
            userId,
          )
      }

      this.database
        .prepare(`
          INSERT INTO enterprise_cognitive_memories (
            memory_id,
            tenant_id,
            user_id,
            entity_id,
            execution_key,
            memory_type,
            content,
            structured_payload_json,
            source,
            source_event_ids_json,
            source_authority,
            confidence,
            created_at,
            observed_at,
            valid_from,
            valid_until,
            updated_at,
            version,
            supersedes_memory_id,
            status,
            retention_policy,
            policy_tags_json,
            checksum
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `)
        .run(
          memoryId,
          tenantId,
          userId,
          input.entityId ?? null,
          input.executionKey ?? null,
          input.type,
          content,
          stableSerialize(structuredPayload),
          source,
          stableSerialize(sourceEventIds),
          sourceAuthority,
          confidence,
          now,
          observedAt,
          validFrom,
          input.validUntil ?? null,
          now,
          version,
          input.supersedesMemoryId ?? null,
          status,
          retentionPolicy,
          stableSerialize(policyTags),
          checksum,
        )

      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    const record = this.readMemoryById({
      tenantId,
      userId,
      memoryId,
    })

    if (!record) {
      throw new Error(
        'Persisted enterprise cognitive memory not found.',
      )
    }

    return record
  }

  transitionMemoryLifecycle(
    input: TransitionEnterpriseMemoryLifecycleInput,
  ): EnterpriseMemoryLifecycleTransition {
    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )
    const userId = assertNonEmpty(
      input.userId,
      'userId',
    )
    const memoryId = assertNonEmpty(
      input.memoryId,
      'memoryId',
    )
    const reason = assertNonEmpty(
      input.reason,
      'reason',
    )
    const source = assertNonEmpty(
      input.source,
      'source',
    )
    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    if (
      input.targetStatus !== 'revoked' &&
      input.targetStatus !== 'expired'
    ) {
      throw new Error(
        `Unsupported lifecycle target status: ${input.targetStatus}.`,
      )
    }

    const current = this.readMemoryById({
      tenantId,
      userId,
      memoryId,
    })

    if (!current) {
      throw new Error(
        'Memory selected for lifecycle transition was not found in the requested scope.',
      )
    }

    if (
      current.status === 'revoked' ||
      current.status === 'expired' ||
      current.status === 'superseded'
    ) {
      throw new Error(
        `Memory lifecycle status ${current.status} is terminal.`,
      )
    }

    const transitionedAt =
      input.transitionedAt ??
      new Date().toISOString()

    const executionKey =
      input.executionKey ??
      current.executionKey ??
      `memory-lifecycle:${memoryId}`

    this.database.exec('BEGIN IMMEDIATE')

    try {
      const updateResult = this.database
        .prepare(
          `
            UPDATE enterprise_cognitive_memories
            SET
              status = ?,
              updated_at = ?
            WHERE memory_id = ?
              AND tenant_id = ?
              AND user_id = ?
              AND status IN (
                'candidate',
                'active',
                'disputed'
              )
          `,
        )
        .run(
          input.targetStatus,
          transitionedAt,
          memoryId,
          tenantId,
          userId,
        ) as {
          changes: number
        }

      if (updateResult.changes !== 1) {
        throw new Error(
          'Memory lifecycle transition was not applied atomically.',
        )
      }

      const event = this.appendEvent({
        eventId: randomUUID(),
        tenantId,
        userId,
        executionKey,
        eventType: 'policy-change',
        payload: {
          action: 'memory-lifecycle-transition',
          memoryId,
          previousStatus: current.status,
          targetStatus: input.targetStatus,
          reason,
          transitionedAt,
          retentionPolicy:
            current.retentionPolicy,
          policyTags: current.policyTags,
        },
        source,
        sourceAuthority,
        createdAt: transitionedAt,
      })

      this.database.exec('COMMIT')

      const transitionedMemory = this.readMemoryById({
        tenantId,
        userId,
        memoryId,
      })

      if (!transitionedMemory) {
        throw new Error(
          'Transitioned memory could not be recovered.',
        )
      }

      return {
        source:
          'runtime-enterprise-cognitive-memory-repository',
        memory: transitionedMemory,
        event,
        previousStatus: current.status,
        targetStatus: input.targetStatus,
        transitionedAt,
      }
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }
  }

  readEvents(
    scope: EnterpriseMemoryEventScope,
  ): EnterpriseMemoryEventRecord[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )
    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )
    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const conditions = [
      'tenant_id = ?',
      'user_id = ?',
    ]

    const parameters: Array<string | number> = [
      tenantId,
      userId,
    ]

    if (scope.executionKey) {
      conditions.push('execution_key = ?')
      parameters.push(
        assertNonEmpty(
          scope.executionKey,
          'executionKey',
        ),
      )
    }

    if (scope.eventTypes?.length) {
      for (const eventType of scope.eventTypes) {
        if (
          ![
            'message',
            'decision',
            'execution',
            'result',
            'error',
            'feedback',
            'policy-change',
          ].includes(eventType)
        ) {
          throw new Error(
            `Unsupported event type: ${eventType}`,
          )
        }
      }

      conditions.push(
        `event_type IN (${scope.eventTypes
          .map(() => '?')
          .join(', ')})`,
      )

      parameters.push(...scope.eventTypes)
    }

    if (
      scope.afterSequence !== undefined
    ) {
      if (
        !Number.isInteger(scope.afterSequence) ||
        scope.afterSequence < 0
      ) {
        throw new Error(
          'afterSequence must be a non-negative integer.',
        )
      }

      conditions.push('sequence > ?')
      parameters.push(scope.afterSequence)
    }

    parameters.push(limit)

    const rows = this.database
      .prepare(`
        SELECT *
        FROM enterprise_memory_events
        WHERE ${conditions.join('\n AND ')}
        ORDER BY sequence ASC
        LIMIT ?
      `)
      .all(...parameters) as SQLiteEventRow[]

    return rows.map(mapEventRow)
  }

  readMemoryById(input: {
    tenantId: string
    userId: string
    memoryId: string
  }): EnterpriseCognitiveMemoryRecord | undefined {
    const row = this.database
      .prepare(`
        SELECT *
        FROM enterprise_cognitive_memories
        WHERE tenant_id = ?
          AND user_id = ?
          AND memory_id = ?
      `)
      .get(
        assertNonEmpty(input.tenantId, 'tenantId'),
        assertNonEmpty(input.userId, 'userId'),
        assertNonEmpty(input.memoryId, 'memoryId'),
      ) as SQLiteMemoryRow | undefined

    return row ? mapMemoryRow(row) : undefined
  }

  readActiveMemories(
    scope: EnterpriseMemoryScope,
  ): EnterpriseCognitiveMemoryRecord[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )
    const userId = assertNonEmpty(scope.userId, 'userId')
    const now = scope.now ?? new Date().toISOString()
    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 50, 200),
    )

    const conditions = [
      'tenant_id = ?',
      'user_id = ?',
      "status = 'active'",
      'valid_from <= ?',
      '(valid_until IS NULL OR valid_until > ?)',
    ]

    const parameters: Array<string | number> = [
      tenantId,
      userId,
      now,
      now,
    ]

    if (scope.entityId) {
      conditions.push('entity_id = ?')
      parameters.push(scope.entityId)
    }

    if (scope.executionKey) {
      conditions.push('execution_key = ?')
      parameters.push(scope.executionKey)
    }

    if (scope.types?.length) {
      for (const type of scope.types) {
        if (!MEMORY_TYPES.includes(type)) {
          throw new Error(`Unsupported memory type: ${type}`)
        }
      }

      conditions.push(
        `memory_type IN (${scope.types
          .map(() => '?')
          .join(', ')})`,
      )
      parameters.push(...scope.types)
    }

    parameters.push(limit)

    const rows = this.database
      .prepare(`
        SELECT *
        FROM enterprise_cognitive_memories
        WHERE ${conditions.join('\n AND ')}
        ORDER BY
          source_authority DESC,
          confidence DESC,
          observed_at DESC,
          version DESC
        LIMIT ?
      `)
      .all(...parameters) as SQLiteMemoryRow[]

    return rows.map(mapMemoryRow)
  }

  appendMemoryRelation(
    input: AppendEnterpriseMemoryRelationInput,
  ): EnterpriseMemoryRelationRecord {
    const relationId =
      input.relationId ?? randomUUID()

    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      input.userId,
      'userId',
    )

    const sourceMemoryId = assertNonEmpty(
      input.sourceMemoryId,
      'sourceMemoryId',
    )

    const targetMemoryId = assertNonEmpty(
      input.targetMemoryId,
      'targetMemoryId',
    )

    if (sourceMemoryId === targetMemoryId) {
      throw new Error(
        'A memory cannot relate to itself.',
      )
    }

    if (
      input.relationType !== 'supports' &&
      input.relationType !== 'contradicts' &&
      input.relationType !== 'supersedes'
    ) {
      throw new Error(
        `Unsupported memory relation type: ${input.relationType}`,
      )
    }

    const sourceMemory = this.readMemoryById({
      tenantId,
      userId,
      memoryId: sourceMemoryId,
    })

    const targetMemory = this.readMemoryById({
      tenantId,
      userId,
      memoryId: targetMemoryId,
    })

    if (!sourceMemory || !targetMemory) {
      throw new Error(
        'Both related memories must exist in the same tenant and user scope.',
      )
    }

    const source = assertNonEmpty(
      input.source,
      'source',
    )

    const reason = assertNonEmpty(
      input.reason,
      'reason',
    )

    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const confidence = assertScore(
      input.confidence,
      'confidence',
    )

    const createdAt =
      input.createdAt ??
      new Date().toISOString()

    const checksum = sha256({
      relationId,
      tenantId,
      userId,
      sourceMemoryId,
      targetMemoryId,
      relationType: input.relationType,
      source,
      sourceAuthority,
      confidence,
      reason,
      createdAt,
    })

    this.database
      .prepare(`
        INSERT INTO enterprise_memory_relations (
          relation_id,
          tenant_id,
          user_id,
          source_memory_id,
          target_memory_id,
          relation_type,
          source,
          source_authority,
          confidence,
          reason,
          created_at,
          checksum
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        relationId,
        tenantId,
        userId,
        sourceMemoryId,
        targetMemoryId,
        input.relationType,
        source,
        sourceAuthority,
        confidence,
        reason,
        createdAt,
        checksum,
      )

    const row = this.database
      .prepare(`
        SELECT *
        FROM enterprise_memory_relations
        WHERE relation_id = ?
      `)
      .get(relationId) as
        | SQLiteMemoryRelationRow
        | undefined

    if (!row) {
      throw new Error(
        'Persisted enterprise memory relation not found.',
      )
    }

    return mapMemoryRelationRow(row)
  }

  readMemoryRelations(
    scope: EnterpriseMemoryRelationScope,
  ): EnterpriseMemoryRelationRecord[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const conditions = [
      'tenant_id = ?',
      'user_id = ?',
    ]

    const parameters: Array<string | number> = [
      tenantId,
      userId,
    ]

    if (scope.sourceMemoryId) {
      conditions.push('source_memory_id = ?')
      parameters.push(
        assertNonEmpty(
          scope.sourceMemoryId,
          'sourceMemoryId',
        ),
      )
    }

    if (scope.targetMemoryId) {
      conditions.push('target_memory_id = ?')
      parameters.push(
        assertNonEmpty(
          scope.targetMemoryId,
          'targetMemoryId',
        ),
      )
    }

    if (scope.relationTypes?.length) {
      for (
        const relationType
        of scope.relationTypes
      ) {
        if (
          relationType !== 'supports' &&
          relationType !== 'contradicts' &&
          relationType !== 'supersedes'
        ) {
          throw new Error(
            `Unsupported memory relation type: ${relationType}`,
          )
        }
      }

      conditions.push(
        `relation_type IN (${scope.relationTypes
          .map(() => '?')
          .join(', ')})`,
      )

      parameters.push(...scope.relationTypes)
    }

    parameters.push(limit)

    const rows = this.database
      .prepare(`
        SELECT *
        FROM enterprise_memory_relations
        WHERE ${conditions.join('\n AND ')}
        ORDER BY created_at ASC, relation_id ASC
        LIMIT ?
      `)
      .all(...parameters) as
        SQLiteMemoryRelationRow[]

    return rows.map(mapMemoryRelationRow)
  }

  resolveTemporalMemoryConflict(
    input: TemporalMemoryConflictResolutionInput,
  ): TemporalMemoryConflictResolution {
    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      input.userId,
      'userId',
    )

    const resolvedAt =
      input.now ?? new Date().toISOString()

    const memoryIds = Array.from(
      new Set(
        input.memoryIds
          .map((memoryId) =>
            assertNonEmpty(
              memoryId,
              'memoryId',
            ),
          ),
      ),
    )

    if (memoryIds.length < 2) {
      throw new Error(
        'At least two distinct memories are required for conflict resolution.',
      )
    }

    const records = memoryIds.map(
      (memoryId) => {
        const record = this.readMemoryById({
          tenantId,
          userId,
          memoryId,
        })

        if (!record) {
          throw new Error(
            `Memory ${memoryId} was not found in the requested scope.`,
          )
        }

        return record
      },
    )

    const candidates =
      records.map(
        (
          record,
        ): TemporalMemoryConflictCandidate => {
          const temporallyValid =
            record.validFrom <= resolvedAt &&
            (
              record.validUntil === undefined ||
              record.validUntil > resolvedAt
            )

          const statusEligible =
            record.status === 'active' ||
            record.status === 'candidate'

          const eligible =
            statusEligible &&
            temporallyValid

          const statusWeight =
            record.status === 'active'
              ? 200
              : record.status === 'candidate'
                ? 100
                : 0

          const score =
            statusWeight +
            record.sourceAuthority * 10 +
            record.confidence * 5 +
            record.version

          let rejectionReason:
            | string
            | undefined

          if (!statusEligible) {
            rejectionReason =
              `status-${record.status}`
          } else if (!temporallyValid) {
            rejectionReason =
              'outside-temporal-validity'
          }

          return {
            memoryId: record.memoryId,
            status: record.status,
            sourceAuthority:
              record.sourceAuthority,
            confidence: record.confidence,
            version: record.version,
            observedAt: record.observedAt,
            createdAt: record.createdAt,
            validFrom: record.validFrom,
            ...(record.validUntil
              ? {
                  validUntil:
                    record.validUntil,
                }
              : {}),
            temporallyValid,
            eligible,
            score,
            ...(rejectionReason
              ? {
                  rejectionReason,
                }
              : {}),
          }
        },
      )

    const eligibleCandidates =
      candidates
        .filter(
          (candidate) =>
            candidate.eligible,
        )
        .sort((left, right) => {
          if (
            right.sourceAuthority !==
            left.sourceAuthority
          ) {
            return (
              right.sourceAuthority -
              left.sourceAuthority
            )
          }

          if (
            right.confidence !==
            left.confidence
          ) {
            return (
              right.confidence -
              left.confidence
            )
          }

          if (
            right.version !==
            left.version
          ) {
            return (
              right.version -
              left.version
            )
          }

          const observedComparison =
            right.observedAt.localeCompare(
              left.observedAt,
            )

          if (observedComparison !== 0) {
            return observedComparison
          }

          const createdComparison =
            right.createdAt.localeCompare(
              left.createdAt,
            )

          if (createdComparison !== 0) {
            return createdComparison
          }

          return right.memoryId.localeCompare(
            left.memoryId,
          )
        })

    const winner =
      eligibleCandidates[0]

    return {
      source:
        'runtime-enterprise-cognitive-memory-repository',
      resolvedAt,
      tenantId,
      userId,
      ...(winner
        ? {
            winnerMemoryId:
              winner.memoryId,
          }
        : {}),
      unresolved: !winner,
      candidates,
      reasoning: [
        `candidateCount=${candidates.length}`,
        `eligibleCount=${eligibleCandidates.length}`,
        `winner=${winner?.memoryId ?? 'none'}`,
        'Precedence: eligible status, temporal validity, source authority, confidence, version, observedAt, createdAt.',
      ],
    }
  }

  resolveMemoryRelationGraph(
    input: MemoryRelationGraphResolutionInput,
  ): MemoryRelationGraphResolution {
    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      input.userId,
      'userId',
    )

    const resolvedAt =
      input.now ?? new Date().toISOString()

    const requestedMemoryIds = Array.from(
      new Set(
        input.memoryIds.map(
          (memoryId) =>
            assertNonEmpty(
              memoryId,
              'memoryId',
            ),
        ),
      ),
    )

    if (requestedMemoryIds.length < 1) {
      throw new Error(
        'At least one memory is required for relation graph resolution.',
      )
    }

    for (const memoryId of requestedMemoryIds) {
      const memory = this.readMemoryById({
        tenantId,
        userId,
        memoryId,
      })

      if (!memory) {
        throw new Error(
          `Memory ${memoryId} was not found in the requested scope.`,
        )
      }
    }

    const requestedMemoryIdSet =
      new Set(requestedMemoryIds)

    const relations =
      this.readMemoryRelations({
        tenantId,
        userId,
        limit: 500,
      }).filter(
        (relation) =>
          requestedMemoryIdSet.has(
            relation.sourceMemoryId,
          ) &&
          requestedMemoryIdSet.has(
            relation.targetMemoryId,
          ),
      )

    const supportingRelations =
      relations.filter(
        (relation) =>
          relation.relationType === 'supports',
      )

    const contradictionRelations =
      relations.filter(
        (relation) =>
          relation.relationType ===
          'contradicts',
      )

    const supersessionRelations =
      relations.filter(
        (relation) =>
          relation.relationType ===
          'supersedes',
      )

    const supersededMemoryIds = Array.from(
      new Set(
        supersessionRelations.map(
          (relation) =>
            relation.targetMemoryId,
        ),
      ),
    )

    const supersededMemoryIdSet =
      new Set(supersededMemoryIds)

    const eligibleMemoryIds =
      requestedMemoryIds.filter(
        (memoryId) =>
          !supersededMemoryIdSet.has(
            memoryId,
          ),
      )

    let winnerMemoryId:
      | string
      | undefined

    let temporalResolution:
      | TemporalMemoryConflictResolution
      | undefined

    if (eligibleMemoryIds.length === 1) {
      const onlyMemory =
        this.readMemoryById({
          tenantId,
          userId,
          memoryId:
            eligibleMemoryIds[0],
        })

      const temporallyValid =
        Boolean(
          onlyMemory &&
          onlyMemory.validFrom <=
            resolvedAt &&
          (
            onlyMemory.validUntil ===
              undefined ||
            onlyMemory.validUntil >
              resolvedAt
          ),
        )

      const statusEligible =
        onlyMemory?.status === 'active' ||
        onlyMemory?.status === 'candidate'

      if (
        onlyMemory &&
        temporallyValid &&
        statusEligible
      ) {
        winnerMemoryId =
          onlyMemory.memoryId
      }
    } else if (eligibleMemoryIds.length > 1) {
      temporalResolution =
        this.resolveTemporalMemoryConflict({
          tenantId,
          userId,
          memoryIds: eligibleMemoryIds,
          now: resolvedAt,
        })

      winnerMemoryId =
        temporalResolution.winnerMemoryId
    }

    return {
      source:
        'runtime-enterprise-cognitive-memory-repository',
      resolvedAt,
      tenantId,
      userId,
      requestedMemoryIds,
      eligibleMemoryIds,
      supersededMemoryIds,
      supportingRelations,
      contradictionRelations,
      supersessionRelations,
      ...(winnerMemoryId
        ? {
            winnerMemoryId,
          }
        : {}),
      unresolved: !winnerMemoryId,
      ...(temporalResolution
        ? {
            temporalResolution,
          }
        : {}),
      reasoning: [
        `requested=${requestedMemoryIds.length}`,
        `relations=${relations.length}`,
        `supports=${supportingRelations.length}`,
        `contradictions=${contradictionRelations.length}`,
        `supersessions=${supersessionRelations.length}`,
        `superseded=${supersededMemoryIds.length}`,
        `eligible=${eligibleMemoryIds.length}`,
        `winner=${winnerMemoryId ?? 'none'}`,
        'Superseded memories are removed before temporal conflict resolution.',
        'Contradictions and supporting relations remain explicit for auditability.',
        'Final precedence remains governed by temporal validity, source authority, confidence, version and observation time.',
      ],
    }
  }


  appendMemoryUtilityAssessment(
    input: AppendGovernedMemoryUtilityAssessmentInput,
  ): GovernedMemoryUtilityAssessment {
    const assessment = input.assessment

    const tenantId = assertNonEmpty(
      assessment.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      assessment.userId,
      'userId',
    )

    const memoryId = assertNonEmpty(
      assessment.memoryId,
      'memoryId',
    )

    const assessmentId = assertNonEmpty(
      assessment.assessmentId,
      'assessmentId',
    )

    if (assessment.assessmentVersion !== 1) {
      throw new Error(
        'Unsupported memory utility assessment version.',
      )
    }

    if (
      !Number.isInteger(assessment.utilityScore) ||
      assessment.utilityScore < 0 ||
      assessment.utilityScore > 100
    ) {
      throw new Error(
        'Memory utility assessment score must be an integer between 0 and 100.',
      )
    }

    if (assessment.mutationApplied !== false) {
      throw new Error(
        'Memory utility assessment persistence cannot record an applied mutation.',
      )
    }

    if (!Number.isFinite(Date.parse(assessment.evaluatedAt))) {
      throw new Error(
        'Memory utility assessment evaluatedAt must be a valid ISO date.',
      )
    }

    const memory = this.readMemoryById({
      tenantId,
      userId,
      memoryId,
    })

    if (!memory) {
      throw new Error(
        'Memory utility assessment target was not found in the requested scope.',
      )
    }

    const createdAt =
      input.createdAt ?? new Date().toISOString()

    if (!Number.isFinite(Date.parse(createdAt))) {
      throw new Error(
        'Memory utility assessment createdAt must be a valid ISO date.',
      )
    }

    this.database
      .prepare(`
        INSERT INTO enterprise_memory_utility_assessments (
          assessment_id,
          assessment_version,
          tenant_id,
          user_id,
          memory_id,
          evaluated_at,
          utility_score,
          recommendation,
          mutation_applied,
          payload_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        assessmentId,
        assessment.assessmentVersion,
        tenantId,
        userId,
        memoryId,
        assessment.evaluatedAt,
        assessment.utilityScore,
        assessment.recommendation,
        0,
        JSON.stringify(assessment),
        createdAt,
      )

    return assessment
  }

  readMemoryUtilityAssessmentHistory(
    scope: GovernedMemoryUtilityAssessmentHistoryScope,
  ): GovernedMemoryUtilityAssessment[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const conditions = [
      'tenant_id = ?',
      'user_id = ?',
    ]

    const parameters: Array<string | number> = [
      tenantId,
      userId,
    ]

    if (scope.memoryId) {
      conditions.push('memory_id = ?')
      parameters.push(
        assertNonEmpty(scope.memoryId, 'memoryId'),
      )
    }

    parameters.push(limit)

    const rows = this.database
      .prepare(`
        SELECT payload_json
        FROM enterprise_memory_utility_assessments
        WHERE ${conditions.join(' AND ')}
        ORDER BY sequence ASC
        LIMIT ?
      `)
      .all(...parameters) as Array<{
        payload_json: string
      }>

    return rows.map((row) => {
      const assessment = JSON.parse(
        row.payload_json,
      ) as GovernedMemoryUtilityAssessment

      if (
        assessment.tenantId !== tenantId ||
        assessment.userId !== userId
      ) {
        throw new Error(
          'Persisted memory utility assessment scope integrity failed.',
        )
      }

      return assessment
    })
  }


  createMemoryReviewRequest(
    input: CreateGovernedMemoryReviewRequestInput,
  ): GovernedMemoryReviewRequest | undefined {
    const decision = input.decision

    if (!decision.requiresReview) {
      return undefined
    }

    if (decision.mutationApplied !== false) {
      throw new Error(
        'A mutated review decision cannot create a governed review request.',
      )
    }

    const requestId =
      input.requestId ?? randomUUID()

    const createdAt =
      input.createdAt ?? new Date().toISOString()

    const source = assertNonEmpty(
      input.source,
      'source',
    )

    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const memory = this.readMemoryById({
      tenantId: decision.tenantId,
      userId: decision.userId,
      memoryId: decision.memoryId,
    })

    if (!memory) {
      throw new Error(
        'Memory selected for governed review was not found in the requested scope.',
      )
    }

    const request: GovernedMemoryReviewRequest = {
      workflowVersion: 1,
      requestId,
      decisionId: decision.decisionId,
      tenantId: decision.tenantId,
      userId: decision.userId,
      memoryId: decision.memoryId,
      recommendation: decision.recommendation,
      status: 'pending',
      createdAt,
      source,
      sourceAuthority,
      mutationApplied: false,
    }

    const requestedEvent: GovernedMemoryReviewEvent = {
      workflowVersion: 1,
      eventId: randomUUID(),
      requestId,
      decisionId: decision.decisionId,
      tenantId: decision.tenantId,
      userId: decision.userId,
      memoryId: decision.memoryId,
      eventType: 'review-requested',
      resultingStatus: 'pending',
      actorId: decision.userId,
      source,
      sourceAuthority,
      reason:
        'Governed memory review was requested from a review decision.',
      createdAt,
      mutationApplied: false,
    }

    this.database.exec('BEGIN IMMEDIATE')

    try {
      this.database
        .prepare(
          `
            INSERT INTO enterprise_memory_review_requests (
              request_id,
              decision_id,
              tenant_id,
              user_id,
              memory_id,
              recommendation,
              decision_json,
              source,
              source_authority,
              mutation_applied,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          request.requestId,
          request.decisionId,
          request.tenantId,
          request.userId,
          request.memoryId,
          request.recommendation,
          JSON.stringify(decision),
          request.source,
          request.sourceAuthority,
          0,
          request.createdAt,
        )

      this.database
        .prepare(
          `
            INSERT INTO enterprise_memory_review_events (
              event_id,
              request_id,
              decision_id,
              tenant_id,
              user_id,
              memory_id,
              event_type,
              resulting_status,
              actor_id,
              source,
              source_authority,
              reason,
              mutation_applied,
              payload_json,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          requestedEvent.eventId,
          requestedEvent.requestId,
          requestedEvent.decisionId,
          requestedEvent.tenantId,
          requestedEvent.userId,
          requestedEvent.memoryId,
          requestedEvent.eventType,
          requestedEvent.resultingStatus,
          requestedEvent.actorId,
          requestedEvent.source,
          requestedEvent.sourceAuthority,
          requestedEvent.reason,
          0,
          JSON.stringify(requestedEvent),
          requestedEvent.createdAt,
        )

      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    return request
  }

  createMemoryActionAuthorization(
    input: CreateGovernedMemoryActionAuthorizationInput,
  ): GovernedMemoryActionAuthorization {
    const reviewRequest = input.reviewRequest

    if (reviewRequest.status !== 'accepted') {
      throw new Error(
        'Only an accepted governed memory review request can originate an action authorization.',
      )
    }

    const authorizationId = assertNonEmpty(
      input.authorizationId,
      'authorizationId',
    )

    const proposedAction = assertNonEmpty(
      input.proposedAction,
      'proposedAction',
    )

    const actorId = assertNonEmpty(
      input.actorId,
      'actorId',
    )

    const source = assertNonEmpty(
      input.source,
      'source',
    )

    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const createdAt =
      input.createdAt ?? new Date().toISOString()

    const authorization: GovernedMemoryActionAuthorization = {
      workflowVersion: 1,
      authorizationId,
      requestId: reviewRequest.requestId,
      decisionId: reviewRequest.decisionId,
      tenantId: reviewRequest.tenantId,
      userId: reviewRequest.userId,
      memoryId: reviewRequest.memoryId,
      proposedAction,
      status: 'pending',
      createdAt,
      actorId,
      source,
      sourceAuthority,
      executionApplied: false,
      mutationApplied: false,
    }

    const requestedEvent: GovernedMemoryActionAuthorizationEvent = {
      workflowVersion: 1,
      eventId: randomUUID(),
      authorizationId: authorization.authorizationId,
      requestId: authorization.requestId,
      decisionId: authorization.decisionId,
      tenantId: authorization.tenantId,
      userId: authorization.userId,
      memoryId: authorization.memoryId,
      eventType: 'authorization-requested',
      resultingStatus: 'pending',
      actorId: authorization.actorId,
      source: authorization.source,
      sourceAuthority: authorization.sourceAuthority,
      reason:
        'Governed memory action authorization was requested from an accepted review request.',
      createdAt,
      executionApplied: false,
      mutationApplied: false,
    }

    this.database.exec('BEGIN IMMEDIATE')

    try {
      this.database
        .prepare(
          `
          INSERT INTO enterprise_memory_action_authorizations (
            authorization_id,
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            proposed_action,
            actor_id,
            source,
            source_authority,
            execution_applied,
            mutation_applied,
            payload_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          authorization.authorizationId,
          authorization.requestId,
          authorization.decisionId,
          authorization.tenantId,
          authorization.userId,
          authorization.memoryId,
          authorization.proposedAction,
          authorization.actorId,
          authorization.source,
          authorization.sourceAuthority,
          0,
          0,
          JSON.stringify(authorization),
          authorization.createdAt,
        )

      this.database
        .prepare(
          `
          INSERT INTO enterprise_memory_action_authorization_events (
            event_id,
            authorization_id,
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            event_type,
            resulting_status,
            actor_id,
            source,
            source_authority,
            reason,
            execution_applied,
            mutation_applied,
            payload_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          requestedEvent.eventId,
          requestedEvent.authorizationId,
          requestedEvent.requestId,
          requestedEvent.decisionId,
          requestedEvent.tenantId,
          requestedEvent.userId,
          requestedEvent.memoryId,
          requestedEvent.eventType,
          requestedEvent.resultingStatus,
          requestedEvent.actorId,
          requestedEvent.source,
          requestedEvent.sourceAuthority,
          requestedEvent.reason,
          0,
          0,
          JSON.stringify(requestedEvent),
          requestedEvent.createdAt,
        )

      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    return authorization
  }

  readMemoryActionAuthorizationHistory(
    scope: GovernedMemoryActionAuthorizationHistoryScope,
  ): GovernedMemoryActionAuthorizationEvent[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const authorizationId = assertNonEmpty(
      scope.authorizationId,
      'authorizationId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const rows = this.database
      .prepare(
        `
        SELECT payload_json
        FROM enterprise_memory_action_authorization_events
        WHERE tenant_id = ?
          AND user_id = ?
          AND authorization_id = ?
        ORDER BY sequence ASC
        LIMIT ?
        `,
      )
      .all(
        tenantId,
        userId,
        authorizationId,
        limit,
      ) as Array<{
        payload_json: string
      }>

    return rows.map((row) => {
      const event = JSON.parse(
        row.payload_json,
      ) as GovernedMemoryActionAuthorizationEvent

      if (
        event.tenantId !== tenantId ||
        event.userId !== userId ||
        event.authorizationId !== authorizationId
      ) {
        throw new Error(
          'Governed memory action authorization event violated scope isolation.',
        )
      }

      if (
        event.executionApplied !== false ||
        event.mutationApplied !== false
      ) {
        throw new Error(
          'Governed memory action authorization event applied execution or mutation.',
        )
      }

      return event
    })
  }

  readMemoryReviewHistory(
    scope: GovernedMemoryReviewHistoryScope,
  ): GovernedMemoryReviewEvent[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const requestId = assertNonEmpty(
      scope.requestId,
      'requestId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const rows = this.database
      .prepare(
        `
          SELECT payload_json
          FROM enterprise_memory_review_events
          WHERE tenant_id = ?
            AND user_id = ?
            AND request_id = ?
          ORDER BY sequence ASC
          LIMIT ?
        `,
      )
      .all(
        tenantId,
        userId,
        requestId,
        limit,
      ) as Array<{
        payload_json: string
      }>

    return rows.map((row) => {
      const event = JSON.parse(
        row.payload_json,
      ) as GovernedMemoryReviewEvent

      if (
        event.tenantId !== tenantId ||
        event.userId !== userId ||
        event.requestId !== requestId
      ) {
        throw new Error(
          'Persisted memory review event scope integrity failed.',
        )
      }

      return event
    })
  }

  readMemoryReviewRequest(
    scope: GovernedMemoryReviewRequestScope,
  ): GovernedMemoryReviewRequest | undefined {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const requestId = assertNonEmpty(
      scope.requestId,
      'requestId',
    )

    const row = this.database
      .prepare(
        `
          SELECT
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            recommendation,
            source,
            source_authority,
            created_at
          FROM enterprise_memory_review_requests
          WHERE tenant_id = ?
            AND user_id = ?
            AND request_id = ?
        `,
      )
      .get(
        tenantId,
        userId,
        requestId,
      ) as
      | {
          request_id: string
          decision_id: string
          tenant_id: string
          user_id: string
          memory_id: string
          recommendation:
            GovernedMemoryUtilityReviewDecision['recommendation']
          source: string
          source_authority: number
          created_at: string
        }
      | undefined

    if (!row) {
      return undefined
    }

    const history = this.readMemoryReviewHistory({
      tenantId,
      userId,
      requestId,
      limit: 500,
    })

    const latest = history[history.length - 1]

    if (!latest) {
      throw new Error(
        'Governed memory review request has no append-only history.',
      )
    }

    return {
      workflowVersion: 1,
      requestId: row.request_id,
      decisionId: row.decision_id,
      tenantId: row.tenant_id,
      userId: row.user_id,
      memoryId: row.memory_id,
      recommendation: row.recommendation,
      status: latest.resultingStatus,
      createdAt: row.created_at,
      source: row.source,
      sourceAuthority: row.source_authority,
      mutationApplied: false,
    }
  }

  readMemoryActionAuthorization(
    scope: GovernedMemoryActionAuthorizationScope,
  ): GovernedMemoryActionAuthorization | undefined {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const authorizationId = assertNonEmpty(
      scope.authorizationId,
      'authorizationId',
    )

    const row = this.database
      .prepare(
        `
        SELECT
          authorization_id,
          request_id,
          decision_id,
          tenant_id,
          user_id,
          memory_id,
          proposed_action,
          actor_id,
          source,
          source_authority,
          execution_applied,
          mutation_applied,
          created_at
        FROM enterprise_memory_action_authorizations
        WHERE tenant_id = ?
          AND user_id = ?
          AND authorization_id = ?
        `,
      )
      .get(
        tenantId,
        userId,
        authorizationId,
      ) as
      | {
          authorization_id: string
          request_id: string
          decision_id: string
          tenant_id: string
          user_id: string
          memory_id: string
          proposed_action: string
          actor_id: string
          source: string
          source_authority: number
          execution_applied: number
          mutation_applied: number
          created_at: string
        }
      | undefined

    if (!row) {
      return undefined
    }

    if (
      row.execution_applied !== 0 ||
      row.mutation_applied !== 0
    ) {
      throw new Error(
        'Governed memory action authorization applied execution or mutation.',
      )
    }

    const history =
      this.readMemoryActionAuthorizationHistory({
        tenantId,
        userId,
        authorizationId,
        limit: 500,
      })

    const latest = history[history.length - 1]

    if (!latest) {
      throw new Error(
        'Governed memory action authorization has no append-only history.',
      )
    }

    if (
      latest.requestId !== row.request_id ||
      latest.decisionId !== row.decision_id ||
      latest.memoryId !== row.memory_id
    ) {
      throw new Error(
        'Governed memory action authorization history violated identity linkage.',
      )
    }

    return {
      workflowVersion: 1,
      authorizationId: row.authorization_id,
      requestId: row.request_id,
      decisionId: row.decision_id,
      tenantId: row.tenant_id,
      userId: row.user_id,
      memoryId: row.memory_id,
      proposedAction: row.proposed_action,
      status: latest.resultingStatus,
      createdAt: row.created_at,
      actorId: row.actor_id,
      source: row.source,
      sourceAuthority: row.source_authority,
      executionApplied: false,
      mutationApplied: false,
    }
  }

  transitionMemoryReviewRequest(
    input: TransitionGovernedMemoryReviewRequestInput,
  ): GovernedMemoryReviewEvent {
    const current = this.readMemoryReviewRequest({
      tenantId: input.tenantId,
      userId: input.userId,
      requestId: input.requestId,
    })

    if (!current) {
      throw new Error(
        'Governed memory review request was not found in the requested scope.',
      )
    }

    if (current.status !== 'pending') {
      throw new Error(
        `Governed memory review request status ${current.status} is terminal.`,
      )
    }

    const reason =
      input.reason?.trim() ?? ''

    if (
      input.targetStatus === 'rejected' &&
      reason.length === 0
    ) {
      throw new Error(
        'Rejected governed memory review requests require a reason.',
      )
    }

    const eventTypeByStatus = {
      accepted: 'review-accepted',
      rejected: 'review-rejected',
      cancelled: 'review-cancelled',
    } as const

    const event: GovernedMemoryReviewEvent = {
      workflowVersion: 1,
      eventId: input.eventId ?? randomUUID(),
      requestId: current.requestId,
      decisionId: current.decisionId,
      tenantId: current.tenantId,
      userId: current.userId,
      memoryId: current.memoryId,
      eventType:
        eventTypeByStatus[input.targetStatus],
      resultingStatus: input.targetStatus,
      actorId: assertNonEmpty(
        input.actorId,
        'actorId',
      ),
      source: assertNonEmpty(
        input.source,
        'source',
      ),
      sourceAuthority: assertScore(
        input.sourceAuthority,
        'sourceAuthority',
      ),
      reason:
        reason ||
        `Governed memory review request ${input.targetStatus}.`,
      createdAt:
        input.createdAt ?? new Date().toISOString(),
      mutationApplied: false,
    }

    this.database
      .prepare(
        `
          INSERT INTO enterprise_memory_review_events (
            event_id,
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            event_type,
            resulting_status,
            actor_id,
            source,
            source_authority,
            reason,
            mutation_applied,
            payload_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        event.eventId,
        event.requestId,
        event.decisionId,
        event.tenantId,
        event.userId,
        event.memoryId,
        event.eventType,
        event.resultingStatus,
        event.actorId,
        event.source,
        event.sourceAuthority,
        event.reason,
        0,
        JSON.stringify(event),
        event.createdAt,
      )

    return event
  }

  transitionMemoryActionAuthorization(
    input: TransitionGovernedMemoryActionAuthorizationInput,
  ): GovernedMemoryActionAuthorizationEvent {
    const current = this.readMemoryActionAuthorization({
      tenantId: input.tenantId,
      userId: input.userId,
      authorizationId: input.authorizationId,
    })

    if (!current) {
      throw new Error(
        'Governed memory action authorization was not found in the requested scope.',
      )
    }

    if (current.status !== 'pending') {
      throw new Error(
        `Governed memory action authorization status ${current.status} is terminal.`,
      )
    }

    const reason =
      input.reason?.trim() ?? ''

    if (
      input.targetStatus === 'denied' &&
      reason.length === 0
    ) {
      throw new Error(
        'Denied governed memory action authorizations require a reason.',
      )
    }

    const eventTypeByStatus = {
      authorized: 'authorization-authorized',
      denied: 'authorization-denied',
      expired: 'authorization-expired',
      cancelled: 'authorization-cancelled',
    } as const

    const event: GovernedMemoryActionAuthorizationEvent = {
      workflowVersion: 1,
      eventId: input.eventId ?? randomUUID(),
      authorizationId: current.authorizationId,
      requestId: current.requestId,
      decisionId: current.decisionId,
      tenantId: current.tenantId,
      userId: current.userId,
      memoryId: current.memoryId,
      eventType:
        eventTypeByStatus[input.targetStatus],
      resultingStatus: input.targetStatus,
      actorId: assertNonEmpty(
        input.actorId,
        'actorId',
      ),
      source: assertNonEmpty(
        input.source,
        'source',
      ),
      sourceAuthority: assertScore(
        input.sourceAuthority,
        'sourceAuthority',
      ),
      reason:
        reason ||
        `Governed memory action authorization ${input.targetStatus}.`,
      createdAt:
        input.createdAt ?? new Date().toISOString(),
      executionApplied: false,
      mutationApplied: false,
    }

    this.database.exec('BEGIN IMMEDIATE')

    try {
      this.database
        .prepare(
          `
          INSERT INTO enterprise_memory_action_authorization_events (
            event_id,
            authorization_id,
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            event_type,
            resulting_status,
            actor_id,
            source,
            source_authority,
            reason,
            execution_applied,
            mutation_applied,
            payload_json,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          event.eventId,
          event.authorizationId,
          event.requestId,
          event.decisionId,
          event.tenantId,
          event.userId,
          event.memoryId,
          event.eventType,
          event.resultingStatus,
          event.actorId,
          event.source,
          event.sourceAuthority,
          event.reason,
          0,
          0,
          JSON.stringify(event),
          event.createdAt,
        )

      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    return event
  }

  readMemoryActionExecutionHistory(
    scope: GovernedMemoryActionExecutionHistoryScope,
  ): GovernedMemoryActionExecutionEvent[] {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const executionId = assertNonEmpty(
      scope.executionId,
      'executionId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 100, 500),
    )

    const rows = this.database
      .prepare(
        `
          SELECT payload_json
          FROM enterprise_memory_action_execution_events
          WHERE tenant_id = ?
            AND user_id = ?
            AND execution_id = ?
          ORDER BY sequence ASC
          LIMIT ?
        `,
      )
      .all(
        tenantId,
        userId,
        executionId,
        limit,
      ) as Array<{
        payload_json: string
      }>

    return rows.map((row) => {
      const event = JSON.parse(
        row.payload_json,
      ) as GovernedMemoryActionExecutionEvent

      if (
        event.tenantId !== tenantId ||
        event.userId !== userId ||
        event.executionId !== executionId
      ) {
        throw new Error(
          'Governed memory action execution event violated scope isolation.',
        )
      }

      if (
        typeof event.executionApplied !== 'boolean' ||
        typeof event.mutationApplied !== 'boolean'
      ) {
        throw new Error(
          'Governed memory action execution event contains invalid application flags.',
        )
      }

      if (
        event.mutationApplied === true &&
        event.executionApplied !== true
      ) {
        throw new Error(
          'Governed memory action execution event applied mutation without execution.',
        )
      }

      if (
        event.executionApplied === true &&
        event.resultingStatus !== 'succeeded'
      ) {
        throw new Error(
          'Governed memory action execution event applied execution outside succeeded status.',
        )
      }

      return event
    })
  }

  readMemoryActionExecution(
    scope: GovernedMemoryActionExecutionScope,
  ): GovernedMemoryActionExecution | undefined {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const executionId = assertNonEmpty(
      scope.executionId,
      'executionId',
    )

    const row = this.database
      .prepare(
        `
          SELECT
            execution_id,
            authorization_id,
            request_id,
            decision_id,
            tenant_id,
            user_id,
            memory_id,
            proposed_action,
            execution_key,
            actor_id,
            source,
            source_authority,
            execution_applied,
            mutation_applied,
            created_at
          FROM enterprise_memory_action_executions
          WHERE tenant_id = ?
            AND user_id = ?
            AND execution_id = ?
        `,
      )
      .get(
        tenantId,
        userId,
        executionId,
      ) as
      | {
          execution_id: string
          authorization_id: string
          request_id: string
          decision_id: string
          tenant_id: string
          user_id: string
          memory_id: string
          proposed_action: string
          execution_key: string
          actor_id: string
          source: string
          source_authority: number
          execution_applied: number
          mutation_applied: number
          created_at: string
        }
      | undefined

    if (!row) {
      return undefined
    }

    if (
      row.execution_applied !== 0 ||
      row.mutation_applied !== 0
    ) {
      throw new Error(
        'Governed memory action execution base record applied execution or mutation.',
      )
    }

    const history =
      this.readMemoryActionExecutionHistory({
        tenantId,
        userId,
        executionId,
        limit: 500,
      })

    const latest = history[history.length - 1]

    if (!latest) {
      throw new Error(
        'Governed memory action execution has no append-only history.',
      )
    }

    if (
      latest.authorizationId !== row.authorization_id ||
      latest.requestId !== row.request_id ||
      latest.decisionId !== row.decision_id ||
      latest.memoryId !== row.memory_id
    ) {
      throw new Error(
        'Governed memory action execution history violated identity linkage.',
      )
    }

    return {
      workflowVersion: 1,
      executionId: row.execution_id,
      authorizationId: row.authorization_id,
      requestId: row.request_id,
      decisionId: row.decision_id,
      tenantId: row.tenant_id,
      userId: row.user_id,
      memoryId: row.memory_id,
      proposedAction: row.proposed_action,
      executionKey: row.execution_key,
      status: latest.resultingStatus,
      createdAt: row.created_at,
      actorId: row.actor_id,
      source: row.source,
      sourceAuthority: row.source_authority,
      executionApplied: latest.executionApplied,
      mutationApplied: latest.mutationApplied,
    }
  }

  createMemoryActionExecution(
    input: CreateGovernedMemoryActionExecutionInput,
  ): GovernedMemoryActionExecution {
    const suppliedAuthorization = input.authorization

    const authorization =
      this.readMemoryActionAuthorization({
        tenantId: suppliedAuthorization.tenantId,
        userId: suppliedAuthorization.userId,
        authorizationId:
          suppliedAuthorization.authorizationId,
      })

    if (!authorization) {
      throw new Error(
        'Governed memory action authorization was not found in the requested scope.',
      )
    }

    if (authorization.status !== 'authorized') {
      throw new Error(
        `Governed memory action authorization status ${authorization.status} cannot create an execution.`,
      )
    }

    if (
      authorization.requestId !==
        suppliedAuthorization.requestId ||
      authorization.decisionId !==
        suppliedAuthorization.decisionId ||
      authorization.memoryId !==
        suppliedAuthorization.memoryId ||
      authorization.proposedAction !==
        suppliedAuthorization.proposedAction
    ) {
      throw new Error(
        'Governed memory action authorization identity linkage was violated.',
      )
    }

    if (
      authorization.executionApplied !== false ||
      authorization.mutationApplied !== false
    ) {
      throw new Error(
        'Governed memory action authorization already applied execution or mutation.',
      )
    }

    const executionId = assertNonEmpty(
      input.executionId,
      'executionId',
    )

    const executionKey = assertNonEmpty(
      input.executionKey,
      'executionKey',
    )

    const actorId = assertNonEmpty(
      input.actorId,
      'actorId',
    )

    const source = assertNonEmpty(
      input.source,
      'source',
    )

    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const createdAt =
      input.createdAt ?? new Date().toISOString()

    const execution: GovernedMemoryActionExecution = {
      workflowVersion: 1,
      executionId,
      authorizationId: authorization.authorizationId,
      requestId: authorization.requestId,
      decisionId: authorization.decisionId,
      tenantId: authorization.tenantId,
      userId: authorization.userId,
      memoryId: authorization.memoryId,
      proposedAction: authorization.proposedAction,
      executionKey,
      status: 'pending',
      createdAt,
      actorId,
      source,
      sourceAuthority,
      executionApplied: false,
      mutationApplied: false,
    }

    const requestedEvent:
      GovernedMemoryActionExecutionEvent = {
        workflowVersion: 1,
        eventId: randomUUID(),
        executionId: execution.executionId,
        authorizationId: execution.authorizationId,
        requestId: execution.requestId,
        decisionId: execution.decisionId,
        tenantId: execution.tenantId,
        userId: execution.userId,
        memoryId: execution.memoryId,
        eventType: 'execution-requested',
        resultingStatus: 'pending',
        actorId,
        source,
        sourceAuthority,
        reason:
          'Governed memory action execution was requested from an authorized action.',
        result: null,
        error: null,
        createdAt,
        executionApplied: false,
        mutationApplied: false,
      }

    this.database.exec('BEGIN IMMEDIATE')

    try {
      this.database
        .prepare(
          `
            INSERT INTO enterprise_memory_action_executions (
              execution_id,
              authorization_id,
              request_id,
              decision_id,
              tenant_id,
              user_id,
              memory_id,
              proposed_action,
              execution_key,
              actor_id,
              source,
              source_authority,
              execution_applied,
              mutation_applied,
              payload_json,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        )
        .run(
          execution.executionId,
          execution.authorizationId,
          execution.requestId,
          execution.decisionId,
          execution.tenantId,
          execution.userId,
          execution.memoryId,
          execution.proposedAction,
          execution.executionKey,
          execution.actorId,
          execution.source,
          execution.sourceAuthority,
          0,
          0,
          JSON.stringify(execution),
          execution.createdAt,
        )

      this.database
        .prepare(
          `
            INSERT INTO enterprise_memory_action_execution_events (
              event_id,
              execution_id,
              authorization_id,
              request_id,
              decision_id,
              tenant_id,
              user_id,
              memory_id,
              event_type,
              resulting_status,
              actor_id,
              source,
              source_authority,
              reason,
              result_json,
              error_text,
              execution_applied,
              mutation_applied,
              payload_json,
              created_at
            )
            VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
          `,
        )
        .run(
          requestedEvent.eventId,
          requestedEvent.executionId,
          requestedEvent.authorizationId,
          requestedEvent.requestId,
          requestedEvent.decisionId,
          requestedEvent.tenantId,
          requestedEvent.userId,
          requestedEvent.memoryId,
          requestedEvent.eventType,
          requestedEvent.resultingStatus,
          requestedEvent.actorId,
          requestedEvent.source,
          requestedEvent.sourceAuthority,
          requestedEvent.reason,
          null,
          null,
          0,
          0,
          JSON.stringify(requestedEvent),
          requestedEvent.createdAt,
        )

      this.database.exec('COMMIT')
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }

    return execution
  }

  transitionMemoryActionExecution(
    input: TransitionGovernedMemoryActionExecutionInput,
  ): GovernedMemoryActionExecutionEvent {
    const executionId = assertNonEmpty(
      input.executionId,
      'executionId',
    )

    const tenantId = assertNonEmpty(
      input.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      input.userId,
      'userId',
    )

    const actorId = assertNonEmpty(
      input.actorId,
      'actorId',
    )

    const source = assertNonEmpty(
      input.source,
      'source',
    )

    const sourceAuthority = assertScore(
      input.sourceAuthority,
      'sourceAuthority',
    )

    const reason = input.reason?.trim() ?? ''
    const errorText = input.error?.trim() || null
    const result = input.result ?? null
    const executionApplied =
      input.executionApplied ?? false
    const mutationApplied =
      input.mutationApplied ?? false

    if (
      input.targetStatus === 'succeeded' &&
      result === null
    ) {
      throw new Error(
        'Succeeded governed memory action executions require a result.',
      )
    }

    if (
      input.targetStatus === 'failed' &&
      errorText === null
    ) {
      throw new Error(
        'Failed governed memory action executions require an error.',
      )
    }

    if (
      input.targetStatus === 'cancelled' &&
      reason.length === 0
    ) {
      throw new Error(
        'Cancelled governed memory action executions require a reason.',
      )
    }

    if (
      executionApplied === true &&
      input.targetStatus !== 'succeeded'
    ) {
      throw new Error(
        'Governed memory action execution can apply execution only when succeeded.',
      )
    }

    if (
      mutationApplied === true &&
      executionApplied !== true
    ) {
      throw new Error(
        'Governed memory action execution cannot apply mutation without execution.',
      )
    }

    const allowedTransitions: Record<
      GovernedMemoryActionExecutionStatus,
      GovernedMemoryActionExecutionStatus[]
    > = {
      pending: ['running', 'cancelled'],
      running: [
        'succeeded',
        'failed',
        'cancelled',
      ],
      succeeded: [],
      failed: [],
      cancelled: [],
    }

    const eventTypeByStatus: Record<
      Exclude<
        GovernedMemoryActionExecutionStatus,
        'pending'
      >,
      GovernedMemoryActionExecutionEventType
    > = {
      running: 'execution-started',
      succeeded: 'execution-succeeded',
      failed: 'execution-failed',
      cancelled: 'execution-cancelled',
    }

    this.database.exec('BEGIN IMMEDIATE')

    try {
      const current = this.readMemoryActionExecution({
        tenantId,
        userId,
        executionId,
      })

      if (!current) {
        throw new Error(
          'Governed memory action execution was not found in the requested scope.',
        )
      }

      if (
        !allowedTransitions[current.status].includes(
          input.targetStatus,
        )
      ) {
        throw new Error(
          `Invalid governed memory action execution transition ${current.status} -> ${input.targetStatus}.`,
        )
      }

      if (
        current.executionApplied === true ||
        current.mutationApplied === true
      ) {
        throw new Error(
          'Governed memory action execution already applied execution or mutation.',
        )
      }

      const event:
        GovernedMemoryActionExecutionEvent = {
          workflowVersion: 1,
          eventId: input.eventId ?? randomUUID(),
          executionId: current.executionId,
          authorizationId: current.authorizationId,
          requestId: current.requestId,
          decisionId: current.decisionId,
          tenantId: current.tenantId,
          userId: current.userId,
          memoryId: current.memoryId,
          eventType:
            eventTypeByStatus[input.targetStatus],
          resultingStatus: input.targetStatus,
          actorId,
          source,
          sourceAuthority,
          reason:
            reason ||
            `Governed memory action execution transitioned to ${input.targetStatus}.`,
          result,
          error: errorText,
          createdAt:
            input.createdAt ??
            new Date().toISOString(),
          executionApplied,
          mutationApplied,
        }

      this.database
        .prepare(
          `
            INSERT INTO enterprise_memory_action_execution_events (
              event_id,
              execution_id,
              authorization_id,
              request_id,
              decision_id,
              tenant_id,
              user_id,
              memory_id,
              event_type,
              resulting_status,
              actor_id,
              source,
              source_authority,
              reason,
              result_json,
              error_text,
              execution_applied,
              mutation_applied,
              payload_json,
              created_at
            )
            VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
          `,
        )
        .run(
          event.eventId,
          event.executionId,
          event.authorizationId,
          event.requestId,
          event.decisionId,
          event.tenantId,
          event.userId,
          event.memoryId,
          event.eventType,
          event.resultingStatus,
          event.actorId,
          event.source,
          event.sourceAuthority,
          event.reason,
          event.result === null
            ? null
            : JSON.stringify(event.result),
          event.error,
          event.executionApplied ? 1 : 0,
          event.mutationApplied ? 1 : 0,
          JSON.stringify(event),
          event.createdAt,
        )

      this.database.exec('COMMIT')

      return event
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }
  }


  readMemoryEndToEndAudit(
    scope: GovernedMemoryEndToEndAuditScope,
  ): GovernedMemoryEndToEndAuditReport {
    const tenantId = assertNonEmpty(
      scope.tenantId,
      'tenantId',
    )

    const userId = assertNonEmpty(
      scope.userId,
      'userId',
    )

    const requestId = assertNonEmpty(
      scope.requestId,
      'requestId',
    )

    const authorizationId = assertNonEmpty(
      scope.authorizationId,
      'authorizationId',
    )

    const executionId = assertNonEmpty(
      scope.executionId,
      'executionId',
    )

    const limit = Math.max(
      1,
      Math.min(scope.limit ?? 500, 500),
    )

    const request = this.readMemoryReviewRequest({
      tenantId,
      userId,
      requestId,
    })

    if (!request) {
      throw new Error(
        'Governed memory review request was not found in the requested audit scope.',
      )
    }

    const authorization =
      this.readMemoryActionAuthorization({
        tenantId,
        userId,
        authorizationId,
      })

    if (!authorization) {
      throw new Error(
        'Governed memory action authorization was not found in the requested audit scope.',
      )
    }

    const execution = this.readMemoryActionExecution({
      tenantId,
      userId,
      executionId,
    })

    if (!execution) {
      throw new Error(
        'Governed memory action execution was not found in the requested audit scope.',
      )
    }

    const assessmentHistory =
      this.readMemoryUtilityAssessmentHistory({
        tenantId,
        userId,
        memoryId: request.memoryId,
        limit,
      })

    const reviewHistory = this.readMemoryReviewHistory({
      tenantId,
      userId,
      requestId,
      limit,
    })

    const authorizationHistory =
      this.readMemoryActionAuthorizationHistory({
        tenantId,
        userId,
        authorizationId,
        limit,
      })

    const executionHistory =
      this.readMemoryActionExecutionHistory({
        tenantId,
        userId,
        executionId,
        limit,
      })

    const violations: string[] = []

    if (
      authorization.requestId !== request.requestId ||
      authorization.decisionId !== request.decisionId ||
      authorization.memoryId !== request.memoryId
    ) {
      violations.push(
        'Authorization identity linkage does not match the review request.',
      )
    }

    if (
      execution.authorizationId !==
        authorization.authorizationId ||
      execution.requestId !== request.requestId ||
      execution.decisionId !== request.decisionId ||
      execution.memoryId !== request.memoryId
    ) {
      violations.push(
        'Execution identity linkage does not match the authorization and review request.',
      )
    }

    if (reviewHistory.length === 0) {
      violations.push(
        'Review request has no append-only history.',
      )
    }

    if (authorizationHistory.length === 0) {
      violations.push(
        'Action authorization has no append-only history.',
      )
    }

    if (executionHistory.length === 0) {
      violations.push(
        'Action execution has no append-only history.',
      )
    }

    const asRecord = (
      value: unknown,
    ): Record<string, unknown> =>
      typeof value === 'object' &&
      value !== null
        ? value as Record<string, unknown>
        : {}

    const readString = (
      record: Record<string, unknown>,
      ...fields: string[]
    ): string | null => {
      for (const field of fields) {
        const value = record[field]

        if (
          typeof value === 'string' &&
          value.length > 0
        ) {
          return value
        }
      }

      return null
    }

    const createTimelineEntry = (
      stage: GovernedMemoryEndToEndAuditStage,
      value: unknown,
      index: number,
    ): GovernedMemoryEndToEndAuditTimelineEntry => {
      const record = asRecord(value)

      return {
        stage,
        eventId:
          readString(
            record,
            'eventId',
            'assessmentId',
          ) ??
          `${stage}-event-${index + 1}`,
        eventType:
          readString(
            record,
            'eventType',
            'assessmentType',
            'recommendation',
          ) ??
          `${stage}-recorded`,
        resultingStatus:
          readString(
            record,
            'resultingStatus',
            'status',
            'recommendation',
          ),
        createdAt:
          readString(
            record,
            'createdAt',
            'assessedAt',
          ) ??
          '',
      }
    }

    const timeline = [
      ...assessmentHistory.map(
        (event, index) =>
          createTimelineEntry(
            'assessment',
            event,
            index,
          ),
      ),
      ...reviewHistory.map(
        (event, index) =>
          createTimelineEntry(
            'review',
            event,
            index,
          ),
      ),
      ...authorizationHistory.map(
        (event, index) =>
          createTimelineEntry(
            'authorization',
            event,
            index,
          ),
      ),
      ...executionHistory.map(
        (event, index) =>
          createTimelineEntry(
            'execution',
            event,
            index,
          ),
      ),
    ].sort((left, right) => {
      const createdAtComparison =
        left.createdAt.localeCompare(right.createdAt)

      if (createdAtComparison !== 0) {
        return createdAtComparison
      }

      return left.eventId.localeCompare(right.eventId)
    })

    const stagesPresent = {
      assessment: assessmentHistory.length > 0,
      review: reviewHistory.length > 0,
      authorization:
        authorizationHistory.length > 0,
      execution: executionHistory.length > 0,
    }

    const chainComplete =
      stagesPresent.assessment &&
      stagesPresent.review &&
      stagesPresent.authorization &&
      stagesPresent.execution

    const executionApplied =
      authorization.executionApplied ||
      execution.executionApplied ||
      executionHistory.some(
        (event) => event.executionApplied,
      )

    const mutationApplied =
      request.mutationApplied ||
      authorization.mutationApplied ||
      execution.mutationApplied ||
      reviewHistory.some(
        (event) => event.mutationApplied,
      ) ||
      authorizationHistory.some(
        (event) => event.mutationApplied,
      ) ||
      executionHistory.some(
        (event) => event.mutationApplied,
      )

    return {
      workflowVersion: 1,
      tenantId,
      userId,
      memoryId: request.memoryId,
      decisionId: request.decisionId,
      requestId,
      authorizationId,
      executionId,
      assessmentCount: assessmentHistory.length,
      reviewEventCount: reviewHistory.length,
      authorizationEventCount:
        authorizationHistory.length,
      executionEventCount: executionHistory.length,
      totalEventCount: timeline.length,
      stagesPresent,
      terminalStates: {
        review: request.status,
        authorization: authorization.status,
        execution: execution.status,
      },
      timeline,
      violations,
      chainComplete,
      integrityValid:
        chainComplete &&
        violations.length === 0,
      executionApplied,
      mutationApplied,
    }
  }

  close(): void {
    this.database.close()
  }
}
