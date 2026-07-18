import { createHash, randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
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

  close(): void {
    this.database.close()
  }
}
