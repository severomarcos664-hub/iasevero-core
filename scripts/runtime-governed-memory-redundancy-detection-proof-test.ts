import assert from 'node:assert/strict'

import type {
  EnterpriseCognitiveMemoryRecord,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

import {
  detectGovernedMemoryRedundancy,
} from '../app/lib/runtime-core/runtime-enterprise-cognitive-memory-repository'

function createMemory(
  overrides: Partial<EnterpriseCognitiveMemoryRecord> = {},
): EnterpriseCognitiveMemoryRecord {
  const base: EnterpriseCognitiveMemoryRecord = {
    memoryId: 'memory-redundancy-left',
    tenantId: 'tenant-redundancy-proof',
    userId: 'user-redundancy-proof',
    type: 'semantic',
    source: 'runtime-governed-memory-redundancy-proof',
    content:
      'IASevero preserves governed cognitive memory with deterministic evidence.',
    structuredPayload: {
      topic: 'governed-memory',
      capability: 'redundancy-detection',
    },
    sourceEventIds: [
      'event-redundancy-1',
      'event-redundancy-2',
    ],
    sourceAuthority: 90,
    confidence: 92,
    createdAt: '2026-07-18T10:00:00.000Z',
    updatedAt: '2026-07-18T10:00:00.000Z',
    observedAt: '2026-07-18T10:00:00.000Z',
    validFrom: '2026-07-18T10:00:00.000Z',
    validUntil: '2099-12-31T23:59:59.000Z',
    version: 1,
    status: 'active',
    retentionPolicy: 'governed',
    policyTags: [
      'memory',
      'redundancy',
    ],
    checksum: 'redundancy-proof-checksum',
  }

  return Object.assign(base, overrides)
}

const duplicateLeft = createMemory({
  memoryId: 'memory-duplicate-left',
  version: 1,
  updatedAt: '2026-07-18T10:00:00.000Z',
})

const duplicateRight = createMemory({
  memoryId: 'memory-duplicate-right',
  version: 2,
  updatedAt: '2026-07-18T11:00:00.000Z',
})

const duplicateLeftSnapshot = JSON.stringify(duplicateLeft)
const duplicateRightSnapshot = JSON.stringify(duplicateRight)

const duplicateDetection = detectGovernedMemoryRedundancy({
  leftMemory: duplicateLeft,
  rightMemory: duplicateRight,
})

assert.equal(
  duplicateDetection.relationship,
  'duplicate',
)

assert.equal(
  duplicateDetection.consolidationRecommended,
  true,
)

assert.equal(
  duplicateDetection.recommendedCanonicalRelation?.relationType,
  'supersedes',
)

assert.equal(
  duplicateDetection.recommendedCanonicalRelation?.sourceMemoryId,
  duplicateRight.memoryId,
)

assert.equal(
  duplicateDetection.recommendedCanonicalRelation?.targetMemoryId,
  duplicateLeft.memoryId,
)

assert.equal(
  duplicateDetection.mutationApplied,
  false,
)

assert.equal(
  JSON.stringify(duplicateLeft),
  duplicateLeftSnapshot,
)

assert.equal(
  JSON.stringify(duplicateRight),
  duplicateRightSnapshot,
)

const duplicateRepeated = detectGovernedMemoryRedundancy({
  leftMemory: duplicateLeft,
  rightMemory: duplicateRight,
})

assert.deepEqual(
  duplicateRepeated,
  duplicateDetection,
  'The same input must produce the same redundancy detection.',
)

const duplicateReversed = detectGovernedMemoryRedundancy({
  leftMemory: duplicateRight,
  rightMemory: duplicateLeft,
})

assert.equal(
  duplicateReversed.detectionId,
  duplicateDetection.detectionId,
)

assert.deepEqual(
  duplicateReversed.memoryIds,
  duplicateDetection.memoryIds,
)

assert.equal(
  duplicateReversed.relationship,
  duplicateDetection.relationship,
)

const nearDuplicateDetection =
  detectGovernedMemoryRedundancy({
    leftMemory: createMemory({
      memoryId: 'memory-near-left',
      entityId: 'entity-governed-memory',
      content:
        'IASevero preserves governed cognitive memory with deterministic evidence.',
      structuredPayload: {
        topic: 'governed-memory',
        capability: 'redundancy-detection',
      },
      sourceEventIds: [
        'event-near-1',
      ],
    }),
    rightMemory: createMemory({
      memoryId: 'memory-near-right',
      entityId: 'entity-governed-memory',
      content:
        'IASevero preserves governed memory using deterministic cognitive evidence.',
      structuredPayload: {
        topic: 'governed-memory',
        capability: 'redundancy-detection',
      },
      sourceEventIds: [
        'event-near-2',
      ],
    }),
  })

assert.equal(
  nearDuplicateDetection.relationship,
  'near-duplicate',
)

assert.equal(
  nearDuplicateDetection.consolidationRecommended,
  true,
)

assert.equal(
  nearDuplicateDetection.recommendedCanonicalRelation?.relationType,
  'supports',
)

const overlappingDetection =
  detectGovernedMemoryRedundancy({
    leftMemory: createMemory({
      memoryId: 'memory-overlap-left',
      entityId: 'entity-memory-quality',
      content:
        'IASevero uses governed memory and deterministic evidence.',
      structuredPayload: {
        topic: 'governed-memory',
      },
      sourceEventIds: [
        'event-overlap-left',
      ],
    }),
    rightMemory: createMemory({
      memoryId: 'memory-overlap-right',
      entityId: 'entity-memory-quality',
      content:
        'Governed memory improves evidence quality in IASevero.',
      structuredPayload: {
        topic: 'memory-quality',
      },
      sourceEventIds: [
        'event-overlap-right',
      ],
    }),
  })

assert.equal(
  overlappingDetection.relationship,
  'overlapping',
)

assert.equal(
  overlappingDetection.consolidationRecommended,
  false,
)

const independentDetection =
  detectGovernedMemoryRedundancy({
    leftMemory: createMemory({
      memoryId: 'memory-independent-left',
      type: 'semantic',
      content:
        'IASevero preserves governed cognitive memory.',
      structuredPayload: {
        topic: 'memory',
      },
      sourceEventIds: [
        'event-independent-left',
      ],
    }),
    rightMemory: createMemory({
      memoryId: 'memory-independent-right',
      type: 'procedural',
      content:
        'A scheduler distributes queued jobs across workers.',
      structuredPayload: {
        topic: 'scheduler',
      },
      sourceEventIds: [
        'event-independent-right',
      ],
    }),
  })

assert.equal(
  independentDetection.relationship,
  'independent',
)

assert.equal(
  independentDetection.consolidationRecommended,
  false,
)

assert.equal(
  independentDetection.recommendedCanonicalRelation,
  undefined,
)

let crossUserBlocked = false

try {
  detectGovernedMemoryRedundancy({
    leftMemory: createMemory({
      memoryId: 'memory-scope-left',
    }),
    rightMemory: createMemory({
      memoryId: 'memory-scope-right',
      userId: 'other-user',
    }),
  })
} catch {
  crossUserBlocked = true
}

assert.equal(
  crossUserBlocked,
  true,
)

let sameMemoryBlocked = false

try {
  const sameMemory = createMemory({
    memoryId: 'memory-same-record',
  })

  detectGovernedMemoryRedundancy({
    leftMemory: sameMemory,
    rightMemory: sameMemory,
  })
} catch {
  sameMemoryBlocked = true
}

assert.equal(
  sameMemoryBlocked,
  true,
)

for (const detection of [
  duplicateDetection,
  nearDuplicateDetection,
  overlappingDetection,
  independentDetection,
]) {
  assert.ok(
    detection.redundancyScore >= 0 &&
      detection.redundancyScore <= 100,
  )

  assert.equal(
    detection.mutationApplied,
    false,
  )
}

console.log(
  'Runtime governed memory redundancy detection proof passed.',
)

console.log({
  duplicateRelationship:
    duplicateDetection.relationship,
  duplicateScore:
    duplicateDetection.redundancyScore,
  duplicateCanonicalRelation:
    duplicateDetection.recommendedCanonicalRelation
      ?.relationType,
  nearDuplicateRelationship:
    nearDuplicateDetection.relationship,
  nearDuplicateScore:
    nearDuplicateDetection.redundancyScore,
  overlappingRelationship:
    overlappingDetection.relationship,
  overlappingScore:
    overlappingDetection.redundancyScore,
  independentRelationship:
    independentDetection.relationship,
  independentScore:
    independentDetection.redundancyScore,
  deterministic:
    JSON.stringify(duplicateRepeated) ===
    JSON.stringify(duplicateDetection),
  orderIndependent:
    duplicateReversed.detectionId ===
      duplicateDetection.detectionId &&
    JSON.stringify(duplicateReversed.memoryIds) ===
      JSON.stringify(duplicateDetection.memoryIds),
  crossUserBlocked,
  sameMemoryBlocked,
  mutationApplied:
    duplicateDetection.mutationApplied,
  sourceMemoriesPreserved:
    JSON.stringify(duplicateLeft) ===
      duplicateLeftSnapshot &&
    JSON.stringify(duplicateRight) ===
      duplicateRightSnapshot,
})
