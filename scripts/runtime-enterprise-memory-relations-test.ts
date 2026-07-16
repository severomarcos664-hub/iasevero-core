import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const { DatabaseSync } = require(
  'node:sqlite',
) as {
  DatabaseSync: new (
    path: string,
  ) => {
    prepare: (
      sql: string,
    ) => {
      run: (
        ...parameters: unknown[]
      ) => unknown
    }
    close: () => void
  }
}

import {
  RuntimeEnterpriseCognitiveMemoryRepository,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

const databasePath = join(
  tmpdir(),
  'iasevero-enterprise-memory-relations-test.sqlite',
)

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}

const repository =
  new RuntimeEnterpriseCognitiveMemoryRepository(
    databasePath,
  )

const tenantId = 'tenant-relations'
const userId = 'user-relations'
const otherUserId = 'other-user-relations'
const now = '2026-07-15T23:20:00.000Z'

const originalMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preference',
  executionKey: 'relation-test',
  type: 'semantic',
  content:
    'O usuário prefere respostas detalhadas.',
  structuredPayload: {
    preference: 'detailed',
  },
  source: 'runtime-enterprise-memory-relations-test',
  sourceAuthority: 80,
  confidence: 80,
  observedAt: now,
  validFrom: now,
  status: 'active',
  retentionPolicy: 'standard',
  policyTags: ['preference'],
})

const supportingMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preference',
  executionKey: 'relation-test',
  type: 'semantic',
  content:
    'O usuário confirmou que valoriza explicações técnicas.',
  structuredPayload: {
    preference: 'technical-explanation',
  },
  source: 'runtime-enterprise-memory-relations-test',
  sourceAuthority: 90,
  confidence: 92,
  observedAt: now,
  validFrom: now,
  status: 'active',
  retentionPolicy: 'standard',
  policyTags: ['preference', 'supporting'],
})

const contradictoryMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preference',
  executionKey: 'relation-test',
  type: 'semantic',
  content:
    'O usuário prefere somente respostas extremamente curtas.',
  structuredPayload: {
    preference: 'extremely-short',
  },
  source: 'runtime-enterprise-memory-relations-test',
  sourceAuthority: 70,
  confidence: 65,
  observedAt: now,
  validFrom: now,
  status: 'disputed',
  retentionPolicy: 'standard',
  policyTags: ['preference', 'conflict'],
})

const supportsRelation =
  repository.appendMemoryRelation({
    tenantId,
    userId,
    sourceMemoryId: supportingMemory.memoryId,
    targetMemoryId: originalMemory.memoryId,
    relationType: 'supports',
    source: 'runtime-enterprise-memory-relations-test',
    sourceAuthority: 90,
    confidence: 92,
    reason:
      'A confirmação técnica reforça a preferência registrada.',
    createdAt: now,
  })

const contradictsRelation =
  repository.appendMemoryRelation({
    tenantId,
    userId,
    sourceMemoryId: contradictoryMemory.memoryId,
    targetMemoryId: originalMemory.memoryId,
    relationType: 'contradicts',
    source: 'runtime-enterprise-memory-relations-test',
    sourceAuthority: 70,
    confidence: 65,
    reason:
      'As preferências registradas são incompatíveis.',
    createdAt: now,
  })

const replacementMemory = repository.createMemory({
  tenantId,
  userId,
  entityId: 'response-preference',
  executionKey: 'relation-test',
  type: 'semantic',
  content:
    'O usuário prefere respostas técnicas, diretas e suficientemente detalhadas.',
  structuredPayload: {
    preference: 'technical-direct-detailed',
  },
  source: 'runtime-enterprise-memory-relations-test',
  sourceAuthority: 98,
  confidence: 97,
  observedAt: now,
  validFrom: now,
  supersedesMemoryId: originalMemory.memoryId,
  status: 'active',
  retentionPolicy: 'standard',
  policyTags: ['preference', 'current'],
})

const supersedesRelation =
  repository.appendMemoryRelation({
    tenantId,
    userId,
    sourceMemoryId: replacementMemory.memoryId,
    targetMemoryId: originalMemory.memoryId,
    relationType: 'supersedes',
    source: 'runtime-enterprise-memory-relations-test',
    sourceAuthority: 98,
    confidence: 97,
    reason:
      'A nova memória atualiza e substitui a preferência anterior.',
    createdAt: now,
  })

const allRelations =
  repository.readMemoryRelations({
    tenantId,
    userId,
    limit: 20,
  })

if (allRelations.length !== 3) {
  throw new Error(
    `Expected 3 memory relations; received ${allRelations.length}.`,
  )
}

const contradictionRelations =
  repository.readMemoryRelations({
    tenantId,
    userId,
    targetMemoryId: originalMemory.memoryId,
    relationTypes: ['contradicts'],
  })

if (
  contradictionRelations.length !== 1 ||
  contradictionRelations[0]?.relationId !==
    contradictsRelation.relationId
) {
  throw new Error(
    'Contradiction relation filtering failed.',
  )
}

const outgoingSupports =
  repository.readMemoryRelations({
    tenantId,
    userId,
    sourceMemoryId: supportingMemory.memoryId,
    relationTypes: ['supports'],
  })

if (
  outgoingSupports.length !== 1 ||
  outgoingSupports[0]?.relationId !==
    supportsRelation.relationId
) {
  throw new Error(
    'Supports relation filtering failed.',
  )
}

if (
  supersedesRelation.relationType !== 'supersedes' ||
  !supportsRelation.checksum ||
  !contradictsRelation.checksum
) {
  throw new Error(
    'Relation type or checksum persistence failed.',
  )
}

let crossUserRejected = false

try {
  repository.appendMemoryRelation({
    tenantId,
    userId: otherUserId,
    sourceMemoryId: supportingMemory.memoryId,
    targetMemoryId: originalMemory.memoryId,
    relationType: 'supports',
    source: 'runtime-enterprise-memory-relations-test',
    sourceAuthority: 100,
    confidence: 100,
    reason: 'Tentativa inválida de cruzar usuários.',
    createdAt: now,
  })
} catch {
  crossUserRejected = true
}

if (!crossUserRejected) {
  throw new Error(
    'Cross-user memory relation was not rejected.',
  )
}

const relationGraphResolution =
  repository.resolveMemoryRelationGraph({
    tenantId,
    userId,
    memoryIds: [
      originalMemory.memoryId,
      supportingMemory.memoryId,
      contradictoryMemory.memoryId,
      replacementMemory.memoryId,
    ],
    now,
  })

if (
  relationGraphResolution.winnerMemoryId !==
    replacementMemory.memoryId
) {
  throw new Error(
    'Relation graph did not select the authoritative replacement memory.',
  )
}

if (
  !relationGraphResolution
    .supersededMemoryIds
    .includes(originalMemory.memoryId)
) {
  throw new Error(
    'Superseded memory was not removed from graph eligibility.',
  )
}

if (
  relationGraphResolution
    .supportingRelations.length !== 1 ||
  relationGraphResolution
    .contradictionRelations.length !== 1 ||
  relationGraphResolution
    .supersessionRelations.length !== 1
) {
  throw new Error(
    'Relation graph did not preserve the expected relation evidence.',
  )
}

if (
  relationGraphResolution
    .eligibleMemoryIds
    .includes(originalMemory.memoryId)
) {
  throw new Error(
    'Superseded memory remained eligible in the relation graph.',
  )
}

const authoritativeOlderMemory =
  repository.createMemory({
    tenantId,
    userId,
    entityId: 'temporal-authority-test',
    executionKey: 'relation-test',
    type: 'semantic',
    content:
      'Informação validada por uma fonte de alta autoridade.',
    structuredPayload: {
      scenario: 'authority-over-recency',
      authority: 'high',
    },
    source:
      'runtime-enterprise-memory-relations-test',
    sourceAuthority: 98,
    confidence: 96,
    observedAt: '2026-07-14T12:00:00.000Z',
    validFrom: '2026-07-14T12:00:00.000Z',
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['temporal', 'authority'],
  })

const recentLowerAuthorityMemory =
  repository.createMemory({
    tenantId,
    userId,
    entityId: 'temporal-authority-test',
    executionKey: 'relation-test',
    type: 'semantic',
    content:
      'Informação mais recente, porém com autoridade inferior.',
    structuredPayload: {
      scenario: 'authority-over-recency',
      authority: 'lower',
    },
    source:
      'runtime-enterprise-memory-relations-test',
    sourceAuthority: 60,
    confidence: 90,
    observedAt: '2026-07-15T23:19:00.000Z',
    validFrom: '2026-07-15T23:19:00.000Z',
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['temporal', 'recent'],
  })

const revokedHighScoreMemory =
  repository.createMemory({
    tenantId,
    userId,
    entityId: 'temporal-revoked-test',
    executionKey: 'relation-test',
    type: 'semantic',
    content:
      'Informação revogada que não pode influenciar.',
    structuredPayload: {
      scenario: 'revoked-exclusion',
    },
    source:
      'runtime-enterprise-memory-relations-test',
    sourceAuthority: 100,
    confidence: 100,
    observedAt: '2026-07-15T23:19:30.000Z',
    validFrom: '2026-07-15T23:19:30.000Z',
    status: 'revoked',
    retentionPolicy: 'standard',
    policyTags: ['temporal', 'revoked'],
  })

const expiredHighScoreMemory =
  repository.createMemory({
    tenantId,
    userId,
    entityId: 'temporal-expired-test',
    executionKey: 'relation-test',
    type: 'semantic',
    content:
      'Informação cuja validade temporal terminou.',
    structuredPayload: {
      scenario: 'expired-exclusion',
    },
    source:
      'runtime-enterprise-memory-relations-test',
    sourceAuthority: 100,
    confidence: 100,
    observedAt: '2026-07-13T12:00:00.000Z',
    validFrom: '2026-07-13T12:00:00.000Z',
    validUntil: '2026-07-14T12:00:00.000Z',
    status: 'active',
    retentionPolicy: 'standard',
    policyTags: ['temporal', 'expired'],
  })

const authorityBeatsRecencyResolution =
  repository.resolveTemporalMemoryConflict({
    tenantId,
    userId,
    memoryIds: [
      authoritativeOlderMemory.memoryId,
      recentLowerAuthorityMemory.memoryId,
    ],
    now,
  })

if (
  authorityBeatsRecencyResolution.winnerMemoryId !==
  authoritativeOlderMemory.memoryId
) {
  throw new Error(
    'Source authority did not take precedence over simple recency.',
  )
}

const revokedExclusionResolution =
  repository.resolveTemporalMemoryConflict({
    tenantId,
    userId,
    memoryIds: [
      authoritativeOlderMemory.memoryId,
      revokedHighScoreMemory.memoryId,
    ],
    now,
  })

if (
  revokedExclusionResolution.winnerMemoryId !==
    authoritativeOlderMemory.memoryId ||
  revokedExclusionResolution.candidates.find(
    (candidate) =>
      candidate.memoryId ===
      revokedHighScoreMemory.memoryId,
  )?.rejectionReason !== 'status-revoked'
) {
  throw new Error(
    'Revoked memory was not excluded from conflict resolution.',
  )
}

const expiredExclusionResolution =
  repository.resolveTemporalMemoryConflict({
    tenantId,
    userId,
    memoryIds: [
      authoritativeOlderMemory.memoryId,
      expiredHighScoreMemory.memoryId,
    ],
    now,
  })

if (
  expiredExclusionResolution.winnerMemoryId !==
    authoritativeOlderMemory.memoryId ||
  expiredExclusionResolution.candidates.find(
    (candidate) =>
      candidate.memoryId ===
      expiredHighScoreMemory.memoryId,
  )?.rejectionReason !==
    'outside-temporal-validity'
) {
  throw new Error(
    'Expired memory was not excluded from conflict resolution.',
  )
}

repository.close()

const verificationDatabase =
  new DatabaseSync(databasePath)

let updateBlocked = false
let deleteBlocked = false

try {
  verificationDatabase
    .prepare(`
      UPDATE enterprise_memory_relations
      SET reason = ?
      WHERE relation_id = ?
    `)
    .run(
      'mutação proibida',
      supportsRelation.relationId,
    )
} catch {
  updateBlocked = true
}

try {
  verificationDatabase
    .prepare(`
      DELETE FROM enterprise_memory_relations
      WHERE relation_id = ?
    `)
    .run(contradictsRelation.relationId)
} catch {
  deleteBlocked = true
}

verificationDatabase.close()

if (!updateBlocked || !deleteBlocked) {
  throw new Error(
    'Append-only protection for memory relations failed.',
  )
}

console.log(
  'Runtime enterprise memory relations test passed.',
)

console.log({
  relationCount: allRelations.length,
  supportsCount: outgoingSupports.length,
  contradictsCount:
    contradictionRelations.length,
  supersedesCount: allRelations.filter(
    (relation) =>
      relation.relationType === 'supersedes',
  ).length,
  crossUserRejected,
  updateBlocked,
  deleteBlocked,
  checksumsPresent: true,
  authorityBeatsRecency:
    authorityBeatsRecencyResolution
      .winnerMemoryId ===
    authoritativeOlderMemory.memoryId,
  revokedExcluded:
    revokedExclusionResolution
      .winnerMemoryId ===
    authoritativeOlderMemory.memoryId,
  expiredExcluded:
    expiredExclusionResolution
      .winnerMemoryId ===
    authoritativeOlderMemory.memoryId,
  relationGraphWinnerCorrect:
    relationGraphResolution
      .winnerMemoryId ===
    replacementMemory.memoryId,
  supersededRemoved:
    relationGraphResolution
      .supersededMemoryIds
      .includes(originalMemory.memoryId),
  graphSupportsCount:
    relationGraphResolution
      .supportingRelations.length,
  graphContradictionsCount:
    relationGraphResolution
      .contradictionRelations.length,
  graphSupersessionsCount:
    relationGraphResolution
      .supersessionRelations.length,
})

for (const suffix of ['', '-wal', '-shm']) {
  rmSync(`${databasePath}${suffix}`, {
    force: true,
  })
}
