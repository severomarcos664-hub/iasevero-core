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

const { DatabaseSync } = require('node:sqlite') as SQLiteModule

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

  close(): void {
    this.database.close()
  }
}
